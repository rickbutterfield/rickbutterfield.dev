import { loadGitHub } from './github';
import { loadSpotify } from './spotify';
import { loadStrava } from './strava';
import { loadX } from './x';

/** One card in the /now activity section. */
export interface ActivityItem {
  source: 'github' | 'strava' | 'spotify' | 'x';
  label: string;
  title: string;
  detail?: string;
  url: string;
  linkText: string;
  /** ISO date the activity happened, shown as relative time */
  date?: string;
  image?: string;
  /** GitHub only: a year of contributions, drawn as a graph on a full-width card */
  calendar?: ContributionCalendar;
}

export interface ContributionCalendar {
  total: number;
  /** Sunday-first weeks of days, oldest first, as GitHub returns them */
  weeks: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[][];
}

/** Minimal shape of a Workers KV namespace, so we don't need @cloudflare/workers-types */
export interface KeyValueStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

/**
 * Worker vars and secrets read by the activity loaders. Every source is optional:
 * a source whose credentials are missing is skipped rather than failing the island.
 */
export interface ActivityEnv {
  GITHUB_USERNAME?: string;
  /** Optional for the latest event; required for the contribution graph (GraphQL needs auth) */
  GITHUB_TOKEN?: string;
  STRAVA_CLIENT_ID?: string;
  STRAVA_CLIENT_SECRET?: string;
  STRAVA_REFRESH_TOKEN?: string;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_REFRESH_TOKEN?: string;
  X_BEARER_TOKEN?: string;
  X_USER_ID?: string;
  /** Holds rotated OAuth refresh tokens; without it the env refresh tokens are used as-is */
  ACTIVITY_KV?: KeyValueStore;
}

export const REQUEST_TIMEOUT_MS = 4000;

/**
 * Cache a loader's result in the Cloudflare edge cache so a busy page doesn't
 * hit third-party rate limits. Outside Workers (or on workers.dev) it just calls the loader.
 */
export async function cached<T>(origin: string, key: string, ttlSeconds: number, load: () => Promise<T | null>): Promise<T | null> {
  // Skipped in dev so new credentials and code changes show up straight away
  const cache = import.meta.env.DEV ? undefined : (globalThis.caches as unknown as { default?: Cache } | undefined)?.default;
  const request = new Request(`${origin}/_activity-cache/${key}`);

  const hit = await cache?.match(request);
  if (hit) {
    return hit.json() as Promise<T>;
  }

  const value = await load();
  if (value && cache) {
    await cache.put(request, new Response(JSON.stringify(value), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${ttlSeconds}`,
      },
    }));
  }
  return value;
}

/**
 * Swap a refresh token for an access token, keeping whichever refresh token the
 * provider hands back. Strava and Spotify can both rotate them, and a stale one stops working.
 */
export async function getAccessToken(
  service: string,
  env: ActivityEnv,
  fallbackRefreshToken: string,
  exchange: (refreshToken: string) => Promise<{ access_token: string; refresh_token?: string }>,
): Promise<string> {
  const key = `${service}:refresh_token`;
  const refreshToken = (await env.ACTIVITY_KV?.get(key)) ?? fallbackRefreshToken;

  const token = await exchange(refreshToken);
  if (token.refresh_token && token.refresh_token !== refreshToken) {
    await env.ACTIVITY_KV?.put(key, token.refresh_token);
  }
  return token.access_token;
}

/** Load every configured source in parallel; one failing source never hides the others. */
export async function loadActivity(env: ActivityEnv, origin: string): Promise<ActivityItem[]> {
  const loaders: [string, number, () => Promise<ActivityItem | null>][] = [
    // Order on the page: two-up cards first, then the full-width GitHub graph
    ['strava', 15 * 60, () => loadStrava(env)],
    ['spotify', 2 * 60, () => loadSpotify(env)],
    ['x', 30 * 60, () => loadX(env)],
    ['github', 10 * 60, () => loadGitHub(env)],
  ];

  const results = await Promise.allSettled(
    loaders.map(([key, ttl, load]) => cached(origin, key, ttl, load)),
  );

  return results.flatMap((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Activity source "${loaders[i][0]}" failed`, result.reason);
      return [];
    }
    return result.value ? [result.value] : [];
  });
}
