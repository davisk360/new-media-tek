// Netlify Function to trigger site rebuild
// Called from CMS when publishing content

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;
  
  if (!buildHookUrl) {
    return new Response(JSON.stringify({ 
      error: 'Build hook not configured',
      message: 'Add NETLIFY_BUILD_HOOK environment variable in Netlify dashboard'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(buildHookUrl, { method: 'POST' });
    
    if (response.ok) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Site rebuild triggered successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error(`Build hook returned ${response.status}`);
    }
  } catch (error) {
    console.error('Error triggering rebuild:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to trigger rebuild',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/trigger-rebuild"
};
