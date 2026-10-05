import { REQUEST_TIMEOUT_MS, type ActivityEnv, type ActivityItem, type ContributionCalendar } from '.';

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    ref?: string | null;
    ref_type?: string;
    size?: number;
    pull_request?: { number: number; title?: string; html_url?: string };
    issue?: { number: number; title?: string; html_url?: string };
    release?: { name?: string; tag_name?: string; html_url?: string };
  };
}

/** Turn a public event into a sentence, or null for events not worth a card (e.g. deletes) */
function describe(event: GitHubEvent): Pick<ActivityItem, 'title' | 'url'> | null {
  const repo = event.repo.name;
  const repoUrl = `https://github.com/${repo}`;
  const { payload } = event;

  switch (event.type) {
    case 'PushEvent': {
      const branch = payload.ref?.replace('refs/heads/', '');
      // GitHub has trimmed push payloads before, so the commit count is optional
      const commits = payload.size ? `${payload.size} commit${payload.size === 1 ? '' : 's'} ` : '';
      return { title: `Pushed ${commits}to ${repo}${branch ? ` (${branch})` : ''}`, url: repoUrl };
    }
    case 'PullRequestEvent':
      if (!payload.pull_request) return null;
      return {
        title: `${payload.action === 'closed' ? 'Closed' : 'Opened'} pull request #${payload.pull_request.number} in ${repo}${payload.pull_request.title ? `: ${payload.pull_request.title}` : ''}`,
        url: payload.pull_request.html_url ?? `${repoUrl}/pull/${payload.pull_request.number}`,
      };
    case 'IssuesEvent':
      if (!payload.issue) return null;
      return {
        title: `${payload.action === 'closed' ? 'Closed' : 'Opened'} issue #${payload.issue.number} in ${repo}${payload.issue.title ? `: ${payload.issue.title}` : ''}`,
        url: payload.issue.html_url ?? `${repoUrl}/issues/${payload.issue.number}`,
      };
    case 'ReleaseEvent':
      return {
        title: `Released ${payload.release?.name || payload.release?.tag_name || 'a new version'} of ${repo}`,
        url: payload.release?.html_url ?? `${repoUrl}/releases`,
      };
    case 'CreateEvent':
      if (payload.ref_type === 'repository') return { title: `Created ${repo}`, url: repoUrl };
      if (payload.ref_type === 'tag') return { title: `Tagged ${payload.ref} in ${repo}`, url: repoUrl };
      return null;
    case 'WatchEvent':
      return { title: `Starred ${repo}`, url: repoUrl };
    case 'ForkEvent':
      return { title: `Forked ${repo}`, url: repoUrl };
    default:
      return null;
  }
}

const GITHUB_HEADERS = {
  // GitHub rejects API requests without a User-Agent
  'User-Agent': 'rickbutterfield.dev',
  Accept: 'application/vnd.github+json',
};

const LEVELS: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function loadLatestEvent(env: ActivityEnv & { GITHUB_USERNAME: string }): Promise<GitHubEvent | null> {
  const response = await fetch(`https://api.github.com/users/${env.GITHUB_USERNAME}/events/public?per_page=30`, {
    headers: {
      ...GITHUB_HEADERS,
      // Optional here: unauthenticated requests share a 60/hour limit per egress IP
      ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`GitHub events returned ${response.status}`);

  const events = await response.json() as GitHubEvent[];
  return events.find((event) => describe(event)) ?? null;
}

/** The contribution graph is only exposed by the GraphQL API, which always needs a token */
async function loadCalendar(env: ActivityEnv & { GITHUB_USERNAME: string }): Promise<ContributionCalendar | null> {
  if (!env.GITHUB_TOKEN) return null;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...GITHUB_HEADERS, Authorization: `Bearer ${env.GITHUB_TOKEN}` },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { date contributionCount contributionLevel } }
            }
          }
        }
      }`,
      variables: { login: env.GITHUB_USERNAME },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`GitHub GraphQL returned ${response.status}`);

  const { data, errors } = await response.json() as {
    data?: { user?: { contributionsCollection: { contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
    } } } };
    errors?: { message: string }[];
  };
  if (errors?.length) throw new Error(`GitHub GraphQL: ${errors[0].message}`);

  const calendar = data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) return null;
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) => week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVELS[day.contributionLevel] ?? 0,
    }))),
  };
}

export async function loadGitHub(env: ActivityEnv): Promise<ActivityItem | null> {
  if (!env.GITHUB_USERNAME) return null;
  const githubEnv = env as ActivityEnv & { GITHUB_USERNAME: string };

  // Either half is enough for a card, so one failing doesn't hide the other
  const [event, calendar] = await Promise.allSettled([loadLatestEvent(githubEnv), loadCalendar(githubEnv)]);
  if (event.status === 'rejected') console.error('GitHub events failed', event.reason);
  if (calendar.status === 'rejected') console.error('GitHub contribution graph failed', calendar.reason);

  const latest = event.status === 'fulfilled' ? event.value : null;
  const graph = calendar.status === 'fulfilled' ? calendar.value ?? undefined : undefined;
  const described = latest && describe(latest);
  if (!described && !graph) return null;

  return {
    source: 'github',
    label: 'On GitHub',
    title: described?.title ?? `${graph!.total.toLocaleString('en-gb')} contributions in the last year`,
    url: described?.url ?? `https://github.com/${env.GITHUB_USERNAME}`,
    linkText: 'View on GitHub',
    date: latest?.created_at,
    calendar: graph,
  };
}
