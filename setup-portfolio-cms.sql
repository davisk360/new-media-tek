-- Setup Portfolio Content Type for CMS
-- Run this in your Supabase SQL editor

-- 1. Create portfolio content type
INSERT INTO content_types (name, description, fields) 
VALUES (
  'portfolio',
  'Portfolio projects and case studies',
  '[
    {
      "name": "title",
      "type": "text",
      "required": true
    },
    {
      "name": "slug",
      "type": "text", 
      "required": true
    },
    {
      "name": "description",
      "type": "rich_text",
      "required": true
    },
    {
      "name": "industry",
      "type": "text",
      "required": true
    },
    {
      "name": "client_type",
      "type": "text",
      "required": true
    },
    {
      "name": "technology_category",
      "type": "text",
      "required": true
    },
    {
      "name": "icon",
      "type": "text",
      "required": true
    },
    {
      "name": "metrics",
      "type": "array",
      "required": false
    },
    {
      "name": "technologies",
      "type": "array",
      "required": false
    },
    {
      "name": "gradient_colors",
      "type": "text",
      "required": false
    }
  ]'
);

-- Get the portfolio type ID (run this first)
SELECT id FROM content_types WHERE name = 'portfolio';

-- 2. Insert sample portfolio projects (replace TYPE_ID with the actual ID from above)
INSERT INTO content (title, slug, content, status, type_id) VALUES
(
  'Enterprise Trading Platform',
  'enterprise-trading-platform',
  '{
    "title": "Enterprise Trading Platform",
    "description": "High-frequency trading application with real-time data processing. Built with ASP.NET MVC, Entity Framework optimization, and Redis caching for sub-second response times.",
    "industry": "Financial Services",
    "client_type": "Fortune 500",
    "technology_category": "ASP.NET MVC",
    "icon": "banknote",
    "metrics": [
      "10,000+ concurrent users",
      "Sub-second transaction processing", 
      "99.9% uptime achieved"
    ],
    "technologies": [
      "ASP.NET MVC",
      "Entity Framework",
      "Redis",
      "SQL Server"
    ],
    "gradient_colors": "from-blue-600/20 to-purple-600/20"
  }',
  'published',
  TYPE_ID
);
