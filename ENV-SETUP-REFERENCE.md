# Environment Variables Reference

Quick reference for setting up environment variables in Netlify.

## Required Variables for Email (Namecheap Private Email)

```bash
# Namecheap Private Email SMTP Settings
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=contact@newmediatek.net
SMTP_PASS=your_secure_password_here

# Email recipient(s) - comma-separated for multiple
ADMIN_EMAIL=contact@newmediatek.net
```

## Required Variables for AI Chat

```bash
# AI Provider API Keys (use ONE of these)
DEEPSEEK_API_KEY=sk-xxxxx     # Recommended - DeepSeek API
KIMI_API_KEY=sk-xxxxx          # Alternative - Moonshot Kimi
OPENAI_API_KEY=sk-xxxxx        # Fallback - OpenAI GPT-4o-mini
```

## Optional Variables for Database

```bash
# Supabase (for chat logs and CMS)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

## Optional Variables for CMS

```bash
# CMS Authentication
PUBLIC_CMS_ADMIN_EMAIL=admin@newmediatek.net
```

---

## How to Set in Netlify

1. Go to: **Site Settings** → **Environment Variables**
2. Click **Add a variable**
3. Enter **Key** and **Value**
4. Click **Save**
5. **Redeploy** the site

---

## Testing Your Configuration

### Test Email Setup
```
https://newmediatek.net/.netlify/functions/debug-all
```

### Test with Different Password
```
https://newmediatek.net/.netlify/functions/debug-all?password=your_test_password
```

---

## Security Notes

⚠️ **NEVER commit these values to Git**

✅ **DO:**
- Store in Netlify environment variables
- Use strong, unique passwords
- Rotate credentials every 90 days

❌ **DON'T:**
- Hardcode in source files
- Share in public repositories
- Use weak passwords

---

## Troubleshooting

### Email Not Working?
1. Verify `SMTP_HOST` is `mail.privateemail.com`
2. Confirm `SMTP_PORT` is `465`
3. Check password is correct (case-sensitive)
4. Run debug function to test

### Chat Not Working?
1. Ensure at least ONE AI API key is set
2. Check API key format starts with `sk-`
3. Verify API key has available credits

### CMS Not Loading?
1. Check both Supabase variables are set
2. Verify URLs don't have trailing slashes
3. Confirm API keys are valid

---

## Need More Help?

See detailed documentation:
- **Email:** `NAMECHEAP-EMAIL-SETUP.md`
- **CMS:** `CMS-SETUP.md`
- **Changes:** `CIPHER_SESSION_LOG.md`
