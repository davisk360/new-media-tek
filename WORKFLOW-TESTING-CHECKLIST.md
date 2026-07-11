# Visual CMS Workflow Testing Checklist

## 🧪 Step-by-Step Testing Guide

### 1. **Environment Setup Test**
- [ ] Check `.env` file has Supabase credentials
- [ ] Verify `PUBLIC_SUPABASE_URL` is set
- [ ] Verify `PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Check development server is running (`bun run dev`)

### 2. **Database Connection Test**
- [ ] Run the visual-cms-schema.sql in Supabase SQL Editor
- [ ] Verify `visual_content` table exists
- [ ] Check table has columns: id, page, content, created_at, updated_at
- [ ] Verify default pages are inserted (home, about, services, portfolio, contact)

### 3. **Component Loading Test**
- [ ] Navigate to `http://localhost:9195/admin`
- [ ] Check if Visual CMS Dashboard loads without errors
- [ ] Verify sidebar shows all pages (Home, About, Services, Portfolio, Contact)
- [ ] Check for any console errors in browser dev tools

### 4. **Page Navigation Test**
- [ ] Click each page in sidebar
- [ ] Verify page header updates correctly
- [ ] Check section count displays
- [ ] Verify URL preview shows correct path

### 5. **Content Editing Test**
- [ ] Click any field (e.g., Hero Title)
- [ ] Verify edit popup appears
- [ ] Type new content and click Save (✓)
- [ ] Check if content updates immediately
- [ ] Test Cancel (X) functionality

### 6. **Preview Mode Test**
- [ ] Click the Eye icon to toggle preview mode
- [ ] Verify preview shows page structure
- [ ] Check content appears correctly in preview
- [ ] Toggle back to edit mode

### 7. **Add New Page Test**
- [ ] Click the ➕ button next to "Website Pages"
- [ ] Fill in page title (e.g., "Test Page")
- [ ] Verify page ID auto-generates
- [ ] Click "Create Page"
- [ ] Check if new page appears in sidebar
- [ ] Navigate to new page and verify it works

### 8. **Portfolio Project Management Test**
- [ ] Navigate to Portfolio page
- [ ] Click "Add Project" button
- [ ] Fill in project details:
  - Title: "Test Project"
  - Description: "This is a test project"
  - Industry: "Technology"
  - Technologies: ".NET, React"
- [ ] Click "Add Project"
- [ ] Verify project appears in list
- [ ] Test inline editing (change title/description)
- [ ] Test removing project (click trash icon)
- [ ] Verify confirmation dialog works

### 9. **Save Functionality Test**
- [ ] Make changes to multiple pages
- [ ] Click "Save All" button
- [ ] Verify success message appears
- [ ] Refresh page and check if changes persist

### 10. **Error Handling Test**
- [ ] Test with missing environment variables
- [ ] Test database connection failure
- [ ] Test invalid form submissions
- [ ] Check if appropriate error messages appear

## 🔧 Common Issues & Solutions

### Issue: "Supabase client not available"
**Solution**: Check environment variables in `.env` file

### Issue: "visual_content table doesn't exist"
**Solution**: Run the visual-cms-schema.sql in Supabase SQL Editor

### Issue: "Projects not saving"
**Solution**: Check if projects array is properly stored in content.projects

### Issue: "Add Page not working"
**Solution**: Verify getAllPages() function returns merged page structure

### Issue: "Preview mode shows empty"
**Solution**: Check if content state is properly loaded for active section

## 📊 Expected Results

✅ **All tests pass** = Visual CMS is working correctly
⚠️ **Some tests fail** = Check specific issue in troubleshooting section
❌ **Most tests fail** = Check environment setup and database connection

## 🚀 Ready for Production Checklist

- [ ] All workflow tests pass
- [ ] No console errors in browser
- [ ] Database operations work correctly
- [ ] UI is responsive and functional
- [ ] Authentication works (if implemented)
- [ ] Content persists after page refresh

## 📞 If Issues Persist

1. Check browser console for JavaScript errors
2. Verify Supabase connection in Network tab
3. Check if database schema matches expectations
4. Test with a fresh browser session
5. Clear cache and cookies
