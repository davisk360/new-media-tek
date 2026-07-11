const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;
  const pathParts = path.replace('/.netlify/functions/cms-api', '').split('/').filter(Boolean);
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Authentication check (you can implement proper JWT validation here)
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const resource = pathParts[0];
    const id = pathParts[1];

    switch (resource) {
      case 'content':
        return await handleContent(httpMethod, id, body, corsHeaders);
      case 'media':
        return await handleMedia(httpMethod, id, body, corsHeaders);
      case 'content-types':
        return await handleContentTypes(httpMethod, id, body, corsHeaders);
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Resource not found' })
        };
    }
  } catch (error) {
    console.error('CMS API Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function handleContent(method, id, body, headers) {
  switch (method) {
    case 'GET':
      if (id) {
        const { data, error } = await supabase
          .from('content')
          .select('*, content_types(name)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data)
        };
      } else {
        const { data, error } = await supabase
          .from('content')
          .select('*, content_types(name)')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data)
        };
      }

    case 'POST':
      const { data: newContent, error: createError } = await supabase
        .from('content')
        .insert(JSON.parse(body))
        .select()
        .single();
      
      if (createError) throw createError;
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newContent)
      };

    case 'PUT':
      const { data: updatedContent, error: updateError } = await supabase
        .from('content')
        .update(JSON.parse(body))
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedContent)
      };

    case 'DELETE':
      const { error: deleteError } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      return {
        statusCode: 204,
        headers,
        body: ''
      };

    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
  }
}

async function handleMedia(method, id, body, headers) {
  switch (method) {
    case 'GET':
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };

    case 'POST':
      // Handle file upload logic here
      // For now, just return the metadata
      const { data: newMedia, error: createError } = await supabase
        .from('media')
        .insert(JSON.parse(body))
        .select()
        .single();
      
      if (createError) throw createError;
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newMedia)
      };

    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
  }
}

async function handleContentTypes(method, id, body, headers) {
  switch (method) {
    case 'GET':
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };

    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
  }
}
