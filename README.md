# New Media Tek

> The public website and content platform for a senior .NET Architect-led B2B software consultancy: a custom Astro marketing site, a from-scratch Supabase-backed Visual CMS, an AI chatbot with lead capture, and a security-hardened contact and email stack.
>
> **Live:** https://newmediatek.net/

Engineered by Kelly, who leads New Media Tek as Senior .NET Architect (15+ years Fortune 500 experience). This repository is the complete source for the New Media Tek web presence: marketing pages, a custom content management system for non-technical editors, an AI assistant that captures and qualifies inbound leads, and the security and email-deliverability infrastructure that ties it together.

## What Kelly built

- **Marketing site (Astro 5 + Tailwind 4 + React 19 islands).** A dark, glass-morphism B2B site with file-based routing: Home, Services, About, Portfolio, Process, Contact, Capabilities Statement, Contracts, Insights (blog), Privacy, Terms, Admin, and a Success/confirmation page. Interactive islands (CMS dashboard, chat widget, portfolio loader) are React; everything else ships as static HTML with near-zero JavaScript.
- **Custom Visual CMS (`src/components/VISUAL_CMS_Dashboard.jsx`, ~100 KB).** Instead of adopting a hosted headless CMS, Kelly built a visual, click-to-edit CMS on Supabase: page-by-page navigation, field-by-field inline editing, a live preview panel with real-time cursor tracking, resizable edit/preview panels, dynamic portfolio project management, and add/remove-page support. Auth-gated at `/admin`, backed by `netlify/functions/cms-api.js` and the SQL schema in `visual-cms-schema.sql`.
- **Graceful content layer (`src/utils/content.ts`).** Every page pulls copy through `getPageContent()` with hardcoded fallbacks, so the site renders correctly even if Supabase or the CMS is unreachable. No blank pages when the database is down.
- **AI chatbot with lead capture (`src/components/ChatWidget.jsx` + `netlify/functions/chat-api.js`).** An OpenAI/DeepSeek-backed assistant that logs conversations and captures qualified leads (name, email, company, summary) into Supabase, with lead-extraction (`lib/extractLead.js`) and lead-email (`lib/sendLeadEmail.js`) helpers.
- **Security hardening (audit-driven, layered).** A Playwright-driven audit took the site from 78 to 98 and the chatbot from 20 to 100. Defenses span client, server, and database: CSP and security headers (production via `netlify.toml`, dev parity via `src/middleware.ts`), XSS sanitization via DOM text-content encoding, server-side input validation with HTML-entity encoding, in-memory rate limiting (20 req/min/IP), message-history and length caps, environment-based logging that strips PII in production, and an admin auth gate. The latest pass, prompt-injection hardening (Layer A + B), lands on the `sec/chat-prompt-injection-hardening` branch. Full write-ups: `SECURITY-FIXES.md`, `CHATBOT-SECURITY.md`.
- **Secure contact form.** An Astro API route (`src/pages/api/contact.ts`) with server-side validation, sanitization, and email/phone format checks, paired with client-side validation in `src/scripts/contact-form.ts`.
- **Email deliverability as part of the build.** DKIM/MX setup scripts (`add-dkim.js`, `fix-mx.mjs`, `revert-mx.mjs`), Namecheap DNS configuration, SendGrid + Nodemailer integration, and the Netlify email plugin. Documented in `NAMECHEAP-EMAIL-SETUP.md` and `EMAIL-CONFIG-TEST-RESULTS.md`.
- **SEO and structured data.** `@astrojs/sitemap`, Organization / WebSite / AboutPage / BreadcrumbList schema.org JSON-LD, and a single source of truth for business info in `src/config/site.ts`.
- **Insights blog.** Dynamic `[slug].astro` routing backed by `src/data/posts.ts`.

## Architecture at a glance

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Astro 5 (islands) + Tailwind 4 | Content-driven site that ships mostly static HTML; React only where interactivity is needed |
| Interactivity | React 19 islands | CMS dashboard, chat widget, portfolio loader |
| CMS | Custom Visual CMS on Supabase (Postgres) | Visual click-to-edit UX for non-technical editors; no vendor lock-in, full control |
| Backend | Netlify Functions | Chat API, CMS API, contact handler, email helpers |
| Data | Supabase (Postgres + auth) | CMS content, chat logs, lead capture |
| AI | OpenAI / DeepSeek | Chatbot |
| Email | SendGrid + Nodemailer + Netlify email plugin | Transactional and lead notifications; DKIM/MX configured |
| Hosting | Netlify | `netlify.toml` drives build, headers, functions |
| Tooling | Bun, TypeScript | Fast installs, type safety |

## Key decisions

1. **Astro + islands over a SPA framework.** A marketing site is mostly static content. Astro ships HTML with minimal JS and mounts React only for the CMS dashboard, chat widget, and portfolio loader, giving faster first paint, better SEO, and a smaller payload than a Next/Remix SPA would for this use case.
2. **A custom Visual CMS over a hosted headless CMS.** Sanity or Contentful would have been faster to stand up but impose per-seat pricing, vendor lock-in, and a generic editor UX. Kelly built a visual, click-to-edit CMS on Supabase so non-technical editors see exactly where content lands before they type, at the cost of maintaining the dashboard code.
3. **Graceful degradation via CMS fallbacks.** Pages read content through `getPageContent()` with inline fallbacks, so a Supabase outage degrades to the last hardcoded copy instead of a broken page. Uptime over freshness.
4. **No public careers section (a deliberate brand decision).** Documented in `career-assessment-formatted.txt`: a careers page would attract job-seekers and dilute the premium, senior-led, Fortune 500 positioning. Kelly recommended a private talent network instead. A product and brand call, not just a technical one.
5. **Security as a first-class deliverable, not an afterthought.** A Playwright-driven audit, before/after scoring, and layered defenses (client + server + database) rather than a single control. Findings and fixes are documented in `SECURITY-FIXES.md` and `CHATBOT-SECURITY.md`.
6. **In-memory rate limiting, with the scale path noted.** `lib/rateLimit.js` uses an in-process store (fine for current traffic on Netlify Functions); the docs explicitly flag Redis as the path to distributed rate limiting at scale. The limitation is acknowledged, not hidden.
7. **Dev/prod security-header parity.** Production headers live in `netlify.toml`; `src/middleware.ts` mirrors them in local dev so the security posture is the same in both environments.
8. **Email deliverability built in, not bolted on.** DKIM/MX/SPF setup, SendGrid + Nodemailer, and a Netlify email plugin live in the repo, so contact and lead emails actually land in inboxes.

## Tech stack

Astro 5.16 · Tailwind CSS 4.1 · React 19 · TypeScript · Supabase (Postgres + auth) · Netlify Functions · OpenAI / DeepSeek · SendGrid + Nodemailer · Lucide icons · `@astrojs/sitemap` · Bun

## Project structure

```
src/
├── components/        # Header, Footer, MobileMenu (Astro) + ChatWidget, CMSAuth, CMSDashboard, VISUAL_CMS_Dashboard, PortfolioProjects (React)
├── config/site.ts     # Single source of truth for business/contact info
├── data/posts.ts      # Insights blog posts
├── layouts/           # BaseLayout (head, header, footer, SEO)
├── pages/             # File-based routing + api/contact.ts + insights/[slug].astro
├── scripts/           # contact-form.ts (client validation)
├── utils/             # content.ts (CMS fetch + fallbacks), cms.js
└── middleware.ts      # Dev security headers
netlify/functions/     # chat-api.js, cms-api.js, contact-form.js, lib/ (rateLimit, extractLead, sendLeadEmail)
netlify.toml           # Build, security headers, functions, email plugin
visual-cms-schema.sql  # Supabase schema for the Visual CMS
```

## Development

Requires [Bun](https://bun.sh/) and Node 18+. Environment variables are documented in `.env.example` (Supabase URL/keys, AI provider key, SendGrid key, etc.).

```bash
bun install
bun run dev        # http://127.0.0.1:9195
bun run build
bun run preview
bun run check      # astro check (types)
bun run lint       # astro lint
```

## Live

**https://newmediatek.net/** (deployed via Netlify)

## License

Proprietary. (c) 2026 New Media Tek. All rights reserved. No part of this repository may be copied, modified, merged, published, distributed, or sublicensed without prior written permission. See [LICENSE](./LICENSE).
