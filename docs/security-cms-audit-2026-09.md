# CMS / Supabase Security Audit — 2026-09-27

Scope: Supabase backend (`wjnjmnisapvcwyowmtvo`) behind the visual CMS at `/admin`.
Verified via `supabase db dump` + live GoTrue/PostgREST probes.

## Findings

### F1 — Public signup enabled + broad write policies = full CMS write for anyone (ACTIVE)

- `POST /auth/v1/signup` with the public anon key **succeeded** — a live
  `authenticated` account was created during this audit (probe user, since deleted).
- RLS policies `authenticated manage visual_content` / `authenticated manage
  visual_media` grant INSERT/UPDATE/DELETE to **any** authenticated session.
- `netlify/functions/cms-publish.js` gates publishing on a valid JWT only
  (`auth.getUser`), not on a specific user — so a self-registered attacker can
  also trigger a site publish.
- **Impact**: modify CMS content + trigger rebuild = live site defacement.
- Compounding issue: **no admin user existed at all** (`auth.users` was empty;
  CMS login could never have worked). Signup must be disabled AND an admin
  provisioned.

### F2 — `cli_login_postgres` role broken (Management API)

`supabase db query` / `db push` / `--data-only` dumps fail with
`permission denied to alter role` (role lacks CREATEROLE). `db dump` (schema)
works via pooler. Workaround: dashboard SQL editor or `db push --db-url` with
the DB password.

## What was done

- Probe user `rls-signup-probe-delete-me@newmediatek.net` deleted via GoTrue
  admin API (service key read from Netlify env). `auth.users` now empty.
- `supabase/config.toml`: `enable_signup = false` at `[auth]` and `[auth.email]`
  (documents intent; local-dev only — remote toggle still required).
- `visual-cms-schema.sql` synced to live policies (was stale `FOR ALL USING
  (true)` — re-running it would have reopened the hole).
- Migration written: `supabase/migrations/20260927000000_lock_cms_writes_to_admin.sql`
  — replaces broad `authenticated manage` policies with `is_cms_admin()`
  (email match) + deletes the probe user. Not yet applied.

## Remaining actions (operator)

1. Dashboard → Authentication → Sign In / Providers → disable "Allow new users
   to sign up"  (blocks new account creation)
2. Run the migration in Dashboard → SQL Editor after filling `ADMIN_EMAIL_HERE`
   (scopes writes to the admin even if signup is ever re-enabled)
3. Create the CMS admin user (dashboard, or GoTrue admin API)
4. Optional hardening: `cms-publish.js` could additionally check the caller's
   email/UID server-side, not just JWT validity.

## Live RLS state (verified 2026-09-27)

- `visual_content`: anon SELECT; authenticated all-ops (to be admin-scoped)
- `visual_media`: same
- `chat_logs`: anon INSERT only (chatbot lead capture — intended)
- RLS enabled on all three tables
