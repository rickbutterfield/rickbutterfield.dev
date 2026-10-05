import { getAccessToken, REQUEST_TIMEOUT_MS, type ActivityEnv, type ActivityItem } from '.';

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string; width: number }[] };
  external_urls: { spotify: string };
}

function toItem(track: SpotifyTrack, label: string, date?: string): ActivityItem {
  const images = track.album.images;
  return {
    source: 'spotify',
    label,
    title: track.name,
    detail: track.artists.map((artist) => artist.name).join(', '),
    url: track.external_urls.spotify,
    linkText: 'Listen on Spotify',
    date,
    // Images come largest first; ~300px covers the card at 2x
    image: (images.find((image) => image.width <= 300) ?? images[0])?.url,
  };
}

export async function loadSpotify(env: ActivityEnv): Promise<ActivityItem | null> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;

  const accessToken = await getAccessToken('spotify', env, SPOTIFY_REFRESH_TOKEN, async (refreshToken) => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Spotify token refresh returned ${response.status}`);
    return response.json();
  });
  const headers = { Authorization: `Bearer ${accessToken}` };

  // 204 means nothing is playing right now, so fall back to the last played track
  const playing = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (playing.status === 200) {
    const current = await playing.json() as { is_playing: boolean; item: SpotifyTrack | null };
    if (current.is_playing && current.item?.external_urls) {
      return toItem(current.item, 'Listening to');
    }
  } else if (playing.status !== 204) {
    throw new Error(`Spotify currently-playing returned ${playing.status}`);
  }

  const recent = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!recent.ok) throw new Error(`Spotify recently-played returned ${recent.status}`);

  const { items } = await recent.json() as { items: { track: SpotifyTrack; played_at: string }[] };
  return items[0] ? toItem(items[0].track, 'Last played', items[0].played_at) : null;
}
