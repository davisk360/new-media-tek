// CMS publish endpoint: validates the caller's Supabase Auth JWT, then triggers
// a Netlify rebuild via the server-only NETLIFY_BUILD_HOOK env var. The build
// hook URL is never exposed to the client (it was previously hardcoded in the
// dashboard, which let anyone trigger a rebuild).

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const anonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;

  if (!supabaseUrl || !anonKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase is not configured' }),
    };
  }
  if (!buildHookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'NETLIFY_BUILD_HOOK is not configured' }),
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

  // JWT is valid → trigger the Netlify rebuild.
  try {
    const res = await fetch(buildHookUrl, { method: 'POST' });
    if (!res.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Build hook failed', status: res.status }),
      };
    }
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to trigger rebuild', details: err.message }),
    };
  }
};
