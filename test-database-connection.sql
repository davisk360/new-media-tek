-- Test Visual CMS Database Connection
-- Run this in Supabase SQL Editor to test the setup

-- Test 1: Check if visual_content table exists
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'visual_content' 
AND table_schema = 'public';

-- Test 2: Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'visual_content' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 3: Try to insert a test record
INSERT INTO visual_content (page, content, updated_at) 
VALUES ('test', '{"title": "Test Page", "content": "Test content"}', NOW())
ON CONFLICT (page) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- Test 4: Query the test record
SELECT * FROM visual_content WHERE page = 'test';

-- Test 5: Clean up test record
DELETE FROM visual_content WHERE page = 'test';

-- Test 6: Check if default pages exist
SELECT page, created_at, updated_at 
FROM visual_content 
WHERE page IN ('home', 'about', 'services', 'portfolio', 'contact')
ORDER BY page;

-- If all tests pass, you should see:
-- ✅ Table exists
-- ✅ Correct column structure (id, page, content, created_at, updated_at, last_edited_by, version)
-- ✅ Insert/Update works
-- ✅ Query works
-- ✅ Delete works
-- ✅ Default pages exist
