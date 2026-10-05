import { REQUEST_TIMEOUT_MS, type ActivityEnv, type ActivityItem } from '.';

const MAX_LENGTH = 200;

export async function loadX(env: ActivityEnv): Promise<ActivityItem | null> {
  if (!env.X_BEARER_TOKEN || !env.X_USER_ID) return null;

  const params = new URLSearchParams({
    max_results: '5',
    exclude: 'replies,retweets',
    'tweet.fields': 'created_at',
  });
  const response = await fetch(`https://api.x.com/2/users/${env.X_USER_ID}/tweets?${params}`, {
    headers: { Authorization: `Bearer ${env.X_BEARER_TOKEN}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`X posts returned ${response.status}`);

  const { data } = await response.json() as { data?: { id: string; text: string; created_at: string }[] };
  const post = data?.[0];
  if (!post) return null;

  return {
    source: 'x',
    label: 'Latest post',
    title: post.text.length > MAX_LENGTH ? `${post.text.slice(0, MAX_LENGTH).trimEnd()}…` : post.text,
    url: `https://x.com/i/web/status/${post.id}`,
    linkText: 'View on X',
    date: post.created_at,
  };
}
