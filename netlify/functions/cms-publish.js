// CMS publish endpoint: validates the caller's Supabase Auth JWT, then
// triggers a site rebuild. Supports two backends (env-gated):
//
//   1. GitHub repository_dispatch (primary, used now): POSTs an event to the
//      GitHub API, which triggers .github/workflows/cms-publish.yml to build
//      with Bun and `netlify deploy --prod`. Used while the Netlify site is
//      NOT git-linked (avoids the private-repo single-contributor limit on the
//      current plan). Requires GITHUB_DISPATCH_TOKEN + GITHUB_REPO.
//
//   2. Netlify build hook (fallback, used after Pro + git-link): POSTs to the
//      server-only NETLIFY_BUILD_HOOK to trigger Netlify's own git build.
//      Requires NETLIFY_BUILD_HOOK.
//
// The dispatch token / build-hook URL are never exposed to the client. To
// switch backends later, change env vars on the Netlify site (no code change):
//   - Now:     GITHUB_DISPATCH_TOKEN + GITHUB_REPO set  -> GitHub dispatch
//   - Pro:     unset GITHUB_DISPATCH_TOKEN, set NETLIFY_BUILD_HOOK -> build hook

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const anonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
  const githubToken = process.env.GITHUB_DISPATCH_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;

  if (!supabaseUrl || !anonKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase is not configured' }),
    };
  }
  if (!githubToken && !buildHookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'No publish backend configured (GITHUB_DISPATCH_TOKEN or NETLIFY_BUILD_HOOK)',
      }),
    };
  }

  // Require a Bearer JWT.
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // Validate the JWT by asking Supabase Auth for the user it belongs to.
  // A valid token returns the user object; an invalid/expired token returns
  // non-2xx, which we treat as unauthorized.
  try {
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // JWT is valid -> trigger the rebuild via the configured backend.
  // Prefer GitHub dispatch; fall back to the Netlify build hook.
  try {
    if (githubToken && githubRepo) {
      const res = await fetch(
        `https://api.github.com/repos/${githubRepo}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ event_type: 'cms-publish' }),
        }
      );
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        return {
          statusCode: 502,
          body: JSON.stringify({
            error: 'GitHub dispatch failed',
            status: res.status,
            detail,
          }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, backend: 'github_dispatch' }),
      };
    }

    // Fallback: Netlify build hook (used when the site is git-linked).
    const res = await fetch(buildHookUrl, { method: 'POST' });
    if (!res.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Build hook failed', status: res.status }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, backend: 'netlify_build_hook' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to trigger rebuild', details: err.message }),
    };
  }
};
