# 🚀 Portfolio CMS Setup Guide

## 📋 Overview
This guide will help you set up the portfolio content management system so non-technical users can easily add/edit portfolio projects through the admin interface.

## 🗄️ Step 1: Set Up Supabase Database

1. **Open your Supabase project**
2. **Go to SQL Editor** (in the Supabase dashboard)
3. **Run the setup script** from `setup-portfolio-cms.sql`

### SQL Commands to Run:

```sql
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

-- 2. Get the portfolio type ID (note this number)
SELECT id FROM content_types WHERE name = 'portfolio';
```

4. **Note the ID** returned (e.g., `3`)
5. **Insert sample projects** (replace `TYPE_ID` with your actual ID):

```sql
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
  TYPE_ID  -- Replace with your actual ID
);
```

## 🔧 Step 2: Configure Environment Variables

Make sure your `.env` file has Supabase credentials:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Step 3: Test the CMS

1. **Go to**: `http://localhost:9195/admin`
2. **Login** with credentials:
   - Email: `admin@newmediatek.net`
   - Password: `admin123`
3. **Click "Content" tab**
4. **Click "New Content"**
5. **Select "portfolio" as Content Type**
6. **Fill in the fields**:
   - **Title**: Project name
   - **Slug**: URL-friendly name (e.g., `my-awesome-project`)
   - **Description**: Project details
   - **Industry**: Industry sector
   - **Client Type**: Fortune 500, Startup, etc.
   - **Technology Category**: ASP.NET MVC, REST API, etc.
   - **Icon**: Lucide icon name (e.g., `banknote`, `heart-pulse`)
   - **Metrics**: Key achievements (one per line)
   - **Technologies**: Tech stack (one per line)
   - **Gradient Colors**: CSS gradient (e.g., `from-blue-600/20 to-purple-600/20`)

## 🎨 Available Icons (Lucide)

Common icons for portfolio projects:
- `banknote` - Financial
- `heart-pulse` - Healthcare  
- `shopping-cart` - Retail/E-commerce
- `cpu` - Manufacturing/IoT
- `globe` - General/Global
- `briefcase` - Business
- `code` - Software/Development
- `cloud` - Cloud/Infrastructure
- `shield` - Security
- `database` - Data/Analytics

## 🌈 Gradient Color Options

Pre-defined gradients:
- `from-blue-600/20 to-purple-600/20` - Blue/Purple
- `from-cyan-600/20 to-teal-600/20` - Cyan/Teal  
- `from-indigo-600/20 to-blue-600/20` - Indigo/Blue
- `from-purple-600/20 to-pink-600/20` - Purple/Pink
- `from-green-600/20 to-emerald-600/20` - Green/Emerald
- `from-orange-600/20 to-red-600/20` - Orange/Red

## ✅ Step 4: Verify Portfolio Page

1. **Go to**: `http://localhost:9195/portfolio`
2. **Check that your projects appear**
3. **Test the responsive layout**

## 🎓 For Non-Technical Users

### Simple Workflow:
1. **Login to admin** (`/admin`)
2. **Click "New Content"**
3. **Choose "portfolio" type**
4. **Fill in the form** (all fields have helpful labels)
5. **Click "Save"**
6. **Project appears instantly** on portfolio page

### Field Explanations:
- **Title**: What the project is called
- **Slug**: Web address (auto-generated from title)
- **Description**: What you did and the impact
- **Industry**: What sector the client is in
- **Client Type**: Size/type of client
- **Technology Category**: Main technology used
- **Icon**: Visual symbol for the project
- **Metrics**: 3 key results/achievements
- **Technologies**: Technologies used
- **Gradient Colors**: Background colors for the card

## 🆘 Troubleshooting

**Projects not showing?**
- Check Supabase connection in `.env`
- Verify content type was created
- Check if projects are "published" status

**CMS not accessible?**
- Verify admin credentials
- Check if server is running
- Clear browser cache

**Layout issues?**
- Projects auto-adjust to grid layout
- Responsive design works automatically

## 🎉 Success!

Once set up, non-technical users can:
- ✅ Add new portfolio projects
- ✅ Edit existing projects  
- ✅ Publish/unpublish projects
- ✅ Delete projects
- ✅ See changes instantly on the live site

The CMS provides an intuitive interface that requires no coding knowledge!
