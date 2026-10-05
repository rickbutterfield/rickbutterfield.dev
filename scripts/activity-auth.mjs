// One-off OAuth helper for the /now activity cards.
// Authorises your own Strava or Spotify account and writes the client ID, secret and
// refresh token to .dev.vars, so no secret has to be copied by hand.
//
//   npm run activity:auth -- strava
//   npm run activity:auth -- spotify [--redirect http://127.0.0.1:8976/callback]
//
// Then copy the same values to production with `npx wrangler secret put NAME`.

import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';

const DEV_VARS = '.dev.vars';

const providers = {
  strava: {
    prefix: 'STRAVA',
    // Strava only checks the callback *domain* set on the app (localhost)
    authorizeUrl: ({ clientId, redirectUri, state }) => `https://www.strava.com/oauth/authorize?${new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      approval_prompt: 'force',
      // Public and followers-only activities; "Only you" activities stay private
      scope: 'activity:read',
      state,
    })}`,
    exchange: ({ clientId, clientSecret, code }) => fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code' }),
    }),
  },
  spotify: {
    prefix: 'SPOTIFY',
    authorizeUrl: ({ clientId, redirectUri, state }) => `https://accounts.spotify.com/authorize?${new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: 'user-read-currently-playing user-read-recently-played',
      state,
    })}`,
    exchange: ({ clientId, clientSecret, code, redirectUri }) => fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
    }),
  },
};

function readDevVars() {
  if (!existsSync(DEV_VARS)) return new Map();
  return new Map(readFileSync(DEV_VARS, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('=') && !line.trimStart().startsWith('#'))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]));
}

function writeDevVars(updates) {
  const vars = readDevVars();
  for (const [key, value] of Object.entries(updates)) vars.set(key, value);
  writeFileSync(DEV_VARS, `${[...vars].map(([key, value]) => `${key}=${value}`).join('\n')}\n`);
}

function openBrowser(url) {
  const command = process.platform === 'win32' ? `start "" "${url}"`
    : process.platform === 'darwin' ? `open "${url}"`
    : `xdg-open "${url}"`;
  exec(command, () => {});
}

async function main() {
  const name = process.argv[2];
  const provider = providers[name];
  if (!provider) {
    console.error(`Usage: npm run activity:auth -- <${Object.keys(providers).join('|')}> [--redirect <uri>]`);
    process.exit(1);
  }

  const redirectFlag = process.argv.indexOf('--redirect');
  const redirectUri = redirectFlag > -1 ? process.argv[redirectFlag + 1] : 'http://localhost:8976/callback';
  const { port, pathname } = new URL(redirectUri);

  // Reuse the client ID and secret from .dev.vars; only prompt when there's a terminal to type in
  const vars = readDevVars();
  let clientId = vars.get(`${provider.prefix}_CLIENT_ID`);
  let clientSecret = vars.get(`${provider.prefix}_CLIENT_SECRET`);
  if (!clientId || !clientSecret) {
    if (!process.stdin.isTTY) {
      console.error(`Add ${provider.prefix}_CLIENT_ID and ${provider.prefix}_CLIENT_SECRET to ${DEV_VARS} first, then run this again.`);
      process.exit(1);
    }
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    clientId ||= (await rl.question(`${provider.prefix} client ID: `)).trim();
    clientSecret ||= (await rl.question(`${provider.prefix} client secret: `)).trim();
    rl.close();
  }

  const state = randomBytes(16).toString('hex');
  const url = provider.authorizeUrl({ clientId, redirectUri, state });

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const params = new URL(req.url, redirectUri).searchParams;
      if (new URL(req.url, redirectUri).pathname !== pathname) {
        res.writeHead(404).end();
        return;
      }
      const finish = (message, result) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' }).end(message);
        server.close();
        result();
      };
      if (params.get('state') !== state) return finish('State mismatch, try again.', () => reject(new Error('OAuth state mismatch')));
      if (params.get('error')) return finish(`Authorisation failed: ${params.get('error')}`, () => reject(new Error(params.get('error'))));
      finish('Done, you can close this tab.', () => resolve(params.get('code')));
    });
    server.listen(Number(port), () => {
      console.log(`\nOpening ${name} to authorise. If nothing opens, visit:\n${url}\n`);
      openBrowser(url);
    });
  });

  const response = await provider.exchange({ clientId, clientSecret, code, redirectUri });
  const token = await response.json();
  if (!response.ok || !token.refresh_token) {
    throw new Error(`Token exchange failed (${response.status}): ${token.message ?? token.error_description ?? token.error ?? 'no refresh token returned'}`);
  }

  writeDevVars({
    [`${provider.prefix}_CLIENT_ID`]: clientId,
    [`${provider.prefix}_CLIENT_SECRET`]: clientSecret,
    [`${provider.prefix}_REFRESH_TOKEN`]: token.refresh_token,
  });
  console.log(`Saved ${provider.prefix}_CLIENT_ID, ${provider.prefix}_CLIENT_SECRET and ${provider.prefix}_REFRESH_TOKEN to ${DEV_VARS}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
