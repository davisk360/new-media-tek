import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Get published content by slug
export async function getContent(slug) {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*, content_types(name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

// Get all content by type
export async function getContentByType(typeName) {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*, content_types(name)')
      .eq('content_types.name', typeName)
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching content by type:', error);
    return [];
  }
}

// Get all published content
export async function getAllContent() {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*, content_types(name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all content:', error);
    return [];
  }
}

// Get media items
export async function getMedia(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
}

// Get content for navigation/menu
export async function getMenuContent() {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('slug, title, content_types(name)')
      .eq('status', 'published')
      .in('content_types.name', ['page', 'service'])
      .order('title');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching menu content:', error);
    return [];
  }
}

// Search content
export async function searchContent(query) {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*, content_types(name)')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content->>excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}
