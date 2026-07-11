# Namecheap Private Email Configuration Guide

**Last Updated:** 2026-01-05  
**Status:** ✅ Fixed and Configured

---

## Overview

This project uses **Namecheap Private Email** (powered by mail.privateemail.com) for sending emails through:
1. **Contact Form** submissions (`/contact` page)
2. **Chat Widget** lead captures and conversation logs

Both email functions have been standardized to use the correct Namecheap SSL configuration.

---

## Configuration Settings

### Required Environment Variables

Set these in your **Netlify Environment Variables** dashboard:

```bash
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=contact@newmediatek.net
SMTP_PASS=your_email_password_here
ADMIN_EMAIL=contact@newmediatek.net
```

### SMTP Configuration (Nodemailer)

Both `chat-api.js` functions use this standardized configuration:

```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // mail.privateemail.com
  port: 465,                          // Namecheap SSL port
  secure: true,                       // SSL required for port 465
  auth: {
    user: process.env.SMTP_USER,      // contact@newmediatek.net
    pass: process.env.SMTP_PASS,      // Your password
  },
  tls: {
    rejectUnauthorized: false,        // Required for some SSL certificates
    servername: 'mail.privateemail.com' // Important for Namecheap
  }
});
```

---

## What Changed

### Before (Incorrect Configuration)

**Chat API Email** was using:
- Port: `587` (TLS/STARTTLS)
- Secure: `false`
- No special TLS configuration
- ❌ This caused authentication failures with Namecheap

### After (Fixed Configuration)

**Both Chat API and Contact Form** now use:
- Port: `465` (SSL)
- Secure: `true`
- TLS servername: `'mail.privateemail.com'`
- ✅ Standardized, working configuration

---

## Testing Your Configuration

### 1. Using the Debug Function

Access the debug endpoint to test your SMTP configuration:

```
https://newmediatek.net/.netlify/functions/debug-all
```

This will test:
- ✅ Environment variables are set
- ✅ SMTP server is reachable
- ✅ Authentication with current password
- ✅ Port 465 SSL configuration
- ✅ Namecheap-specific TLS settings

### 2. Test with Different Password

If your current password isn't working, test a new one:

```
https://newmediatek.net/.netlify/functions/debug-all?password=your_test_password
```

### 3. Contact Form Test

1. Go to: `https://newmediatek.net/contact`
2. Fill out the consultation form
3. Submit
4. Check `contact@newmediatek.net` inbox for the email

### 4. Chat Widget Test

1. Open the chat widget on any page
2. Have a conversation with the AI
3. Provide an email and company name (e.g., "test@example.com, Test Corp")
4. Check `contact@newmediatek.net` inbox for the lead capture email

---

## Troubleshooting

### Issue 1: "Authentication Failed"

**Symptoms:**
- Error: `Invalid login: 535 Incorrect authentication data`

**Solutions:**
1. **Check password:** Ensure `SMTP_PASS` is correct in Netlify
2. **Reset password:** Reset your email password in Namecheap cPanel
3. **Two-factor auth:** If enabled, you may need an app-specific password
4. **Case sensitivity:** Email passwords are case-sensitive

### Issue 2: "Connection Timeout"

**Symptoms:**
- Error: `ETIMEDOUT` or `ECONNREFUSED`

**Solutions:**
1. **Check SMTP_HOST:** Must be `mail.privateemail.com`
2. **Check port:** Must be `465` (not 587)
3. **Firewall:** Ensure Netlify can access port 465
4. **DNS:** Verify `mail.privateemail.com` resolves correctly

### Issue 3: "Self-signed Certificate"

**Symptoms:**
- Error: `self signed certificate in certificate chain`

**Solutions:**
- ✅ Already fixed: `rejectUnauthorized: false` in TLS config
- This is normal for some shared hosting SSL certificates

### Issue 4: "SMTP Configuration Missing"

**Symptoms:**
- Returns: `{ error: 'SMTP configuration missing' }`

**Solutions:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add all required variables (see Configuration Settings above)
3. Redeploy the site or wait for automatic deployment

---

## Namecheap-Specific Notes

### Why Port 465?

Namecheap Private Email supports:
- **Port 465** (SSL) - ✅ **Recommended**
- Port 587 (TLS/STARTTLS) - ⚠️ May have authentication issues
- Port 25 (Plain/TLS) - ❌ Often blocked by ISPs and cloud providers

### Why `servername: 'mail.privateemail.com'`?

This TLS option ensures the SSL certificate hostname matches correctly. Without it, you may get SNI (Server Name Indication) errors.

### Private Email vs. Namecheap Email

- **Private Email** (our service): `mail.privateemail.com`
- **Basic Namecheap Email**: Different SMTP server
- Make sure you're using Private Email SMTP settings

---

## Email Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  User Interaction                                        │
│  ├─ Contact Form Submission                             │
│  └─ Chat Widget Lead Capture                            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Netlify Functions                                       │
│  ├─ chat-api.js (handleContactForm)                     │
│  └─ chat-api.js (main handler with email)               │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Nodemailer Transport                                    │
│  ├─ Host: mail.privateemail.com                         │
│  ├─ Port: 465 (SSL)                                     │
│  ├─ Auth: contact@newmediatek.net                       │
│  └─ TLS: servername configured                          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Namecheap Private Email Server                         │
│  └─ Delivers to: contact@newmediatek.net                │
└─────────────────────────────────────────────────────────┘
```

---

## Security Best Practices

### 1. Never Commit Passwords

❌ **DON'T:**
```javascript
pass: 'mypassword123'  // Never hardcode!
```

✅ **DO:**
```javascript
pass: process.env.SMTP_PASS  // Always use environment variables
```

### 2. Use Strong Passwords

- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Use a password manager

### 3. Rotate Passwords Regularly

- Change SMTP password every 90 days
- Update `SMTP_PASS` in Netlify after changing

### 4. Monitor Email Logs

- Check Netlify function logs for failed attempts
- Review Namecheap email logs for suspicious activity

---

## Alternative SMTP Providers

If Namecheap email continues to have issues, consider:

1. **SendGrid** (Free: 100 emails/day)
   - More reliable for transactional emails
   - Better deliverability
   - Detailed analytics

2. **Mailgun** (Free: 5,000 emails/month)
   - Developer-friendly
   - Excellent documentation
   - Webhooks for tracking

3. **AWS SES** (Pay-as-you-go, $0.10/1000 emails)
   - Enterprise-grade
   - High deliverability
   - Integrates with AWS ecosystem

---

## Related Files

- `netlify/functions/chat-api.js` - Main email handler
- `netlify/functions/debug-all.js` - SMTP testing utility
- `netlify/functions/test-password.js` - Password validation
- `src/components/ChatWidget.jsx` - Chat UI with lead capture
- `src/pages/contact.astro` - Contact form

---

## Support

### Namecheap Support
- **Live Chat:** Available 24/7
- **Ticket:** Support Portal
- **Email:** support@namecheap.com
- **Documentation:** https://www.namecheap.com/support/knowledgebase/category/28/private-email/

### Project Support
- Check `CIPHER_SESSION_LOG.md` for recent changes
- Review Netlify function logs for errors
- Test with `debug-all.js` function first

---

## Checklist

Before deploying:

- [ ] Environment variables set in Netlify
- [ ] SMTP_PASS is correct and recent
- [ ] Port is `465` (not 587)
- [ ] `servername: 'mail.privateemail.com'` is set
- [ ] Tested with `/debug-all` endpoint
- [ ] Tested contact form submission
- [ ] Tested chat widget lead capture
- [ ] Email received in `contact@newmediatek.net`

---

## Changelog

### 2026-01-05 - Email Configuration Standardized
- ✅ Fixed chat API email to use port 465 SSL
- ✅ Added Namecheap TLS servername configuration
- ✅ Standardized both contact form and chat API configs
- ✅ Created this documentation

### Previous Issues (Before 2026-01-05)
- ❌ Chat API used port 587 without proper TLS config
- ❌ Inconsistent configuration between contact form and chat
- ❌ Authentication failures with Namecheap

---

**Status:** All email functions now use the correct Namecheap Private Email configuration. Test thoroughly before production deployment.