# Cipher Session Log - New Media Tek AI Chatbot

**Date:** 2026-01-01  
**Project:** New Media Tek  
**Component:** AI Chatbot (ChatWidget + chat-api)

---

## Session 4 - Namecheap Email Configuration Fix

**Date:** 2026-01-05  
**Topic:** Email SMTP Configuration Standardization

### Summary

Fixed inconsistent email configuration between chat API and contact form. Both now use proper Namecheap Private Email settings with SSL on port 465.

---

## Issues Identified

1. **Inconsistent SMTP Configuration** - Chat API used different settings than contact form
2. **Wrong Port for Chat API** - Used port 587 (TLS) instead of 465 (SSL)
3. **Missing Namecheap TLS Config** - Chat API lacked `servername: 'mail.privateemail.com'`
4. **Authentication Failures** - Port 587 with `secure: false` caused auth issues with Namecheap
5. **No Documentation** - No guide for troubleshooting email problems

---

## Solutions Implemented

### Email Configuration Updates (`netlify/functions/chat-api.js`)

**Chat API Email Handler (Lines 145-157)**
- Changed port from `587` to `465`
- Changed secure from `false` to `true`
- Added TLS configuration:
  ```javascript
  tls: {
    rejectUnauthorized: false,
    servername: 'mail.privateemail.com'
  }
  ```

**Contact Form Handler (Already Correct)**
- Already used port 465 with SSL
- Already had Namecheap TLS config
- No changes needed

### Documentation Created

**New File: `NAMECHEAP-EMAIL-SETUP.md`**
- Complete SMTP configuration guide
- Environment variable requirements
- Testing procedures (debug-all endpoint)
- Troubleshooting common issues
- Security best practices
- Email flow diagram
- Pre-deployment checklist

---

## Files Modified

1. `New_Media_Tek/netlify/functions/chat-api.js` - Standardized email config
2. `New_Media_Tek/NAMECHEAP-EMAIL-SETUP.md` - New documentation file
3. `New_Media_Tek/CIPHER_SESSION_LOG.md` - This session log

---

## Configuration Details

### Required Environment Variables
```bash
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=contact@newmediatek.net
SMTP_PASS=your_email_password
ADMIN_EMAIL=contact@newmediatek.net
```

### Standard Nodemailer Config (Both Functions)
```javascript
{
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: { user, pass },
  tls: {
    rejectUnauthorized: false,
    servername: 'mail.privateemail.com'
  }
}
```

---

## Testing Checklist

- [ ] Test with `/debug-all` endpoint
- [ ] Test contact form submission
- [ ] Test chat widget lead capture
- [ ] Verify emails arrive at `contact@newmediatek.net`
- [ ] Check Netlify function logs for errors

---

## Key Decisions

| Issue | Decision | Rationale |
|-------|----------|-----------|
| Port selection | Use 465 (SSL) | More reliable with Namecheap than 587 (TLS) |
| TLS servername | Add 'mail.privateemail.com' | Fixes SNI and SSL certificate matching |
| Standardization | Same config for both | Reduces confusion, easier maintenance |
| Documentation | Create dedicated guide | Enables troubleshooting without code review |

---

## Related Sessions

- **Session 4:** Namecheap Email Configuration Fix (current)
- **Session 3:** Cloud Expertise Categories Added
- **Session 2:** Lead Qualification & Chatbot Optimization
- **Session 1:** Initial prompt optimization

---

## Session 3 - Cloud Expertise Categories Added

**Date:** 2026-01-01  
**Topic:** Technology Expertise Expansion

### Summary

Added missing Cloud Data Migration and Cloud Platform Integrations categories to the services page based on user requirements analysis.

---

## Issues Identified

1. **Missing Cloud Data Migration** - No explicit category for migrating from on-premises/in-house to cloud
2. **Missing AWS Integrations** - Only generic "Azure & AWS Cloud Architecture" mention
3. **Missing Azure Integrations** - Same as AWS, too vague
4. **Missing Cloud Migration Strategy** - No dedicated migration path services
5. **Missing Serverless Architecture** - No Lambda/Azure Functions mentions
6. **Missing Multi-Cloud Strategy** - No cross-cloud integration

---

## Solutions Implemented

### Services Page Updates (`src/pages/services.astro`)

**New Category 1: Cloud Data Migration**
- On-Premises to Cloud Migration
- AWS Database Migration Service (DMS)
- Azure Data Migration Service
- Data Lake & Warehouse Migration

**New Category 2: Cloud Platform Integrations**
- AWS Services: EC2, S3, RDS, Lambda, EKS
- Azure Services: App Service, Azure SQL, Functions, AKS
- Serverless Architecture (Lambda/Azure Functions)
- Multi-Cloud Strategy & Management

**Expanded: Cloud Infrastructure & DevOps**
- Added specific AWS services: EC2, S3, RDS, EKS, Lambda
- Added specific Azure services: App Service, Azure SQL, AKS

**Schema Updates**
- Added Cloud Data Migration to OfferCatalog
- Added Cloud Platform Integrations to OfferCatalog

**Page Description**
- Updated to include new services: "Custom .NET Development, Cloud Data Migration, Cloud Platform Integrations, DevOps..."

---

## Files Modified

1. `New_Media_Tek/src/pages/services.astro`

---

## Complete Technology Expertise Categories

| # | Category | Status |
|---|----------|--------|
| 1 | Custom .NET Applications | Existing |
| 2 | REST APIs & Microservices | Existing |
| 3 | Legacy Modernization | Existing |
| 4 | Enterprise Architecture | Existing |
| 5 | UX/UI Design & Frontend | Existing |
| 6 | Cloud Infrastructure & DevOps | **Expanded** |
| 7 | Cloud Data Migration | **Added** |
| 8 | Cloud Platform Integrations | **Added** |

---

## Session 2 - Lead Qualification & Chatbot Optimization

**Date:** 2026-01-01  
**Topic:** AI Chatbot System Prompt & UX

---

## Session Summary

Optimized the AI chatbot system prompt and UX for lead qualification.

---

## Issues Identified

1. **Verbosity** - Chatbot gave too much information, ignored 50-word limit
2. **Hallucination** - Chatbot invented facts (claimed 8 team members when site shows 4 roles)
3. **No closure UX** - Chat froze after lead capture with no acknowledgment
4. **Missing data capture** - Only asked for email, not company name

---

## Solutions Implemented

### System Prompt Updates (`netlify/functions/chat-api.js`)

- Added **MAX 2 sentences** response rule
- Added **FORBIDDEN** section (no preamble, no bullet lists, no multiple questions)
- Added **STRICT CONSTRAINTS** - "Do NOT invent company facts"
- Added deflection phrase: "I'd need to confirm that with our team"
- Added **7 few-shot examples** showing exact tone and brevity
- Updated goal to capture **email AND company name**
- JSON format now includes `company` field

### ChatWidget UX Updates (`src/components/ChatWidget.jsx`)

- Added `leadCaptured` state
- Added email detection regex
- Added confirmation phrase detection
- Shows **"Thank You" screen** with checkmark after lead captured
- Added **"Start New Conversation"** button to reset chat
- Input area replaced with closure UI when lead captured

---

## Files Modified

1. `New_Media_Tek/src/components/ChatWidget.jsx`
2. `New_Media_Tek/netlify/functions/chat-api.js`

---

## Decisions Made

| Topic | Decision | Rationale |
|-------|----------|-----------|
| RAG for .NET | Not needed | DeepSeek's built-in knowledge sufficient for lead qualification |
| Company name | Ask for it | B2B enterprise work benefits from knowing company before call |
| Chat closure | Show thank-you UI | Clear UX closure, prevents confusion |
| Team size in prompt | Omit, use deflection | Avoid hardcoding, let AI deflect gracefully |

---

## Pending Items

- [ ] **Team page update** - Site shows 4 abstract roles but doesn't convey real team members exist. Awaiting senior lead approval to add names/bios.
- [ ] **Supabase schema** - Add `lead_company` column to `chat_logs` table

---

## System Prompt Location

Final system prompt is embedded in:
- `netlify/functions/chat-api.js` (deployed version)
- Also pasted into Windsurf for reference

---

## Key Prompt Rules

```
RESPONSE RULES:
- MAX 2 sentences
- NO preamble ("Great question!", "I'd be happy to...")
- NO bullet lists or multiple options
- ONE question per response
- Ask for email and company name only after understanding their need

STRICT CONSTRAINTS:
- Do NOT invent company facts (team size, pricing, timelines, past clients)
- If unsure about company details, say "I'd need to confirm that with our team"
- Never guess—deflect to consultation
```

---

## Lead Capture JSON Format

```json
{
  "LEAD_CAPTURED": true,
  "name": "[if stated, else null]",
  "email": "[exact email]",
  "company": "[company name]",
  "summary": "[tech + timeline]"
}
```

---

## Related Sessions

- **Session 3:** Cloud Expertise Categories Added (Cloud Data Migration, Cloud Platform Integrations)
- **Session 2:** Company name capture + chat closure UX
- **Session 1:** Initial prompt optimization (verbosity, hallucination fixes)