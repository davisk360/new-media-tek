# Visual CMS Setup Guide - New Media Tek

## 🎯 Ultra-Intuitive Content Management

Your new Visual CMS is designed to be **completely user-friendly** - you'll see exactly where content goes before you edit it!

## 🚀 Key Features

### ✨ **Visual Page Structure**
- **Homepage** → See Hero, Services, Team sections
- **About Page** → See About Hero, Team Members sections  
- **Services Page** → See Services Hero, Service Offerings sections
- **Portfolio Page** → See Portfolio Hero, Featured Projects sections
- **Contact Page** → See Contact Hero, Contact Information sections

### 🎨 **Field-by-Field Editing**
- **Click any field** to edit it
- **See exactly where it appears** on the page
- **Live preview mode** to see your changes
- **Auto-save** functionality

### 📱 **Intuitive Interface**
- **Page navigation** on the left sidebar
- **Visual icons** for each section (Layout, Users, Briefcase, etc.)
- **Preview/Edit toggle** to see your changes
- **Color-coded sections** for easy identification

## 🛠️ Setup Instructions

### 1. Database Setup
```sql
-- Run this in your Supabase SQL Editor
-- (Copy contents of visual-cms-schema.sql)
```

### 2. Environment Variables
Add to your `.env` file:
```bash
# Existing Supabase config (keep your values)
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Access the Visual CMS
- **URL**: `https://new-media-tek.netlify.app/admin`
- **Login**: Use your existing CMS credentials
- **Interface**: Completely visual, no technical knowledge needed

## 📋 How to Use

### Step 1: Choose a Page
1. **Left sidebar** shows all website pages
2. **Click any page** (Home, About, Services, etc.)
3. **See the page URL** and section count
4. **➕ Add New Page button** to create custom pages

### Step 1a: Add New Page (NEW!)
1. **Click the ➕ button** next to "Website Pages"
2. **Fill in the form**:
   - **Page Title** (required): e.g., "Blog", "Careers", "FAQ"
   - **Page ID/URL**: Auto-generated from title (e.g., "blog" → "/blog")
   - **Description**: Brief page description
3. **Click "Create Page"** to add it to the sidebar
4. **New page appears** immediately in the navigation

### Step 2: Edit Content
1. **Click any field** in the main area
2. **Type your changes** in the popup editor
3. **Click Save** (✓) or Cancel (X)
4. **See your changes** immediately

### Step 2a: Manage Portfolio Projects (NEW!)
1. **Go to Portfolio page** in the sidebar
2. **Click "Add Project"** to create new projects
3. **Fill project details**:
   - **Project Title** (required): e.g., "E-commerce Platform"
   - **Description** (required): Project details and challenges
   - **Industry**: e.g., "Financial", "Healthcare"
   - **Technologies**: e.g., ".NET, React, Azure"
4. **Edit existing projects** inline:
   - **Change title/description** directly in the project cards
   - **Update industry/technologies** as needed
   - **Remove projects** with the trash icon (🗑️)
5. **Projects auto-number** (Project 1, Project 2, etc.)

### Step 3: Preview Your Work
1. **Toggle Preview Mode** (eye icon in header)
2. **See exactly how content appears** on the live page
3. **Switch back to Edit Mode** to make more changes
3. **Switch back to Edit Mode** to make more changes

### Step 4: Save Everything
1. **Click "Save All"** in the header
2. **Content is saved** to the database
3. **Changes appear immediately** on your website

## 🎯 Content Mapping

### Homepage Fields:
- **Hero Title** → Main headline on homepage
- **Hero Subtitle** → Text below main headline  
- **Hero CTA Text** → Button text for main action
- **Services Title** → Services section heading
- **Team Title** → Team section heading

### About Page Fields:
- **About Title** → Page main heading
- **About Description** → Page introduction text
- **Architect Bio** → Senior architect biography
- **Team Structure** → Team composition description

### Services Page Fields:
- **Services Title** → Page main heading
- **Services Subtitle** → Page subtitle
- **Custom Apps Description** → Custom applications service description
- **API Description** → API services description
- **Modernization Description** → Legacy modernization description

### Portfolio Page Fields:
- **Portfolio Title** → Page main heading
- **Portfolio Subtitle** → Page subtitle
- **Dynamic Projects** → Add/remove unlimited projects:
  - **Add Project** button to create new projects
  - **Edit projects** inline (title, description, industry, technologies)
  - **Remove projects** with trash icon
  - **Auto-numbering** (Project 1, Project 2, etc.)

### Contact Page Fields:
- **Contact Title** → Page main heading
- **Contact Subtitle** → Page subtitle
- **Contact Email** → Contact email address
- **Contact Phone** → Phone number

## 🔧 Advanced Features

### Media Management
- **Image uploads** coming soon
- **File organization** by section
- **Alt text** for SEO

### Version Control
- **Track changes** with timestamps
- **Version history** for rollbacks
- **User tracking** for accountability

### SEO Optimization
- **Meta descriptions** per page
- **Structured data** automatically generated
- **URL slugs** automatically managed

## 🚨 Important Notes

### Security
- **Admin access only** at `/admin`
- **Authentication required** via existing system
- **Environment variables** keep credentials safe

### Performance
- **Real-time updates** - changes appear instantly
- **Optimized queries** for fast loading
- **Caching** for better performance

### Backup
- **Automatic backups** via Supabase
- **Export functionality** coming soon
- **Version history** for safety

## 🎉 Benefits Over Old CMS

### Before (Technical CMS):
- ❌ Generic forms with "content", "slug", "type_id"
- ❌ No visual context
- ❌ Complex content structure
- ❌ Technical field names

### After (Visual CMS):
- ✅ **Visual page structure** - see exactly where content goes
- ✅ **Intuitive field names** - "Hero Title", "About Description"
- ✅ **Live preview** - see changes before publishing
- ✅ **Click-to-edit** - no technical knowledge needed
- ✅ **Page-by-page organization** - logical content grouping
- ✅ **Visual icons** - instant recognition of sections

## 📞 Support

If you need help:
1. **Check the preview mode** - it shows exactly where content appears
2. **Use the visual sidebar** - navigate pages easily
3. **Save frequently** - protect your work
4. **Contact support** for technical issues

Your new Visual CMS makes content management **intuitive and visual** - you'll know exactly where your content goes before you even type!
