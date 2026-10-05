import { getAccessToken, REQUEST_TIMEOUT_MS, type ActivityEnv, type ActivityItem } from '.';

interface StravaActivity {
  id: number;
  name: string;
  sport_type: string;
  /** metres */
  distance: number;
  /** seconds */
  moving_time: number;
  start_date: string;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export async function loadStrava(env: ActivityEnv): Promise<ActivityItem | null> {
  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = env;
  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) return null;

  const accessToken = await getAccessToken('strava', env, STRAVA_REFRESH_TOKEN, async (refreshToken) => {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Strava token refresh returned ${response.status}`);
    return response.json();
  });

  // The token's scope decides which activities come back; activity:read skips "Only you" ones
  const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Strava activities returned ${response.status}`);

  const [activity] = await response.json() as StravaActivity[];
  if (!activity) return null;

  const km = activity.distance / 1000;
  const parts = [`${km.toFixed(1)} km`, formatDuration(activity.moving_time)];
  if (activity.sport_type === 'Run' && km > 0) {
    parts.push(`${formatDuration(Math.round(activity.moving_time / km))} /km`);
  }

  return {
    source: 'strava',
    label: activity.sport_type === 'Run' ? 'Latest run' : 'Latest activity',
    title: activity.name,
    detail: parts.join(' · '),
    url: `https://www.strava.com/activities/${activity.id}`,
    linkText: 'View on Strava',
    date: activity.start_date,
  };
}
