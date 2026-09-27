# InsForge Migration — Supabase → InsForge

Status: **complete on the `insforge-migration` branch**. Production stays on
Supabase (`master`) until this branch merges — see Cutover below.

## What changed

| Layer | Before (Supabase) | Now (InsForge) |
|-------|-------------------|----------------|
| Backend | `wjnjmnisapvcwyowmtvo.supabase.co` | `shneyhp8.us-west.insforge.app` (project `new-media-tek`) |
| Client | `@supabase/supabase-js` | `@insforge/sdk` |
| Shared client | `src/utils/supabaseClient.js` | `src/utils/insforgeClient.js` |
| Content fetch | `content.ts` via `supabase.from()` | `content.ts` via `insforge.database.from()` |
| CMS auth | `CMSAuth.jsx` → `supabase.auth` | `insforge.auth` (signInWithPassword / getCurrentUser / onAuthStateChange / refreshSession) |
| CMS writes | `VISUAL_CMS_Dashboard.jsx` upsert/insert | same, via `insforge.database` (update-then-insert replaces `.upsert()`) |
| Chat logging | `chat-api.js` → anon Supabase client | `createAdminClient` (project_admin) — required because `chat_logs` has no SELECT policy |
| Publish gate | `cms-publish.js` → `/auth/v1/user` | `/api/auth/sessions/current` + `cms_admins` allowlist check |
| CSP | `connect-src …supabase.co` | `connect-src …shneyhp8.us-west.insforge.app` (`netlify.toml`, `middleware.ts`) |

## Security posture (the reason for the migration)

- **Public signup disabled** — `insforge.toml` → `auth.disable_signup = true`
  (applied via `npx -y @insforge/cli config apply`). The only account is the
  dashboard-created admin.
- **Admin allowlist** — `public.cms_admins` table + `is_cms_admin()`
  `SECURITY DEFINER` function. CMS write policies (`INSERT`/`UPDATE`/`DELETE`
  on `visual_content`, `visual_media`) require `is_cms_admin()` — not merely
  `authenticated`. An authenticated non-admin can read but not write.
- **`cms_admins` itself has no policies** — invisible to all API callers; only
  reachable via SQL / project_admin / the definer function.
- **`chat_logs` is write-only over the API** — anon/authenticated can `INSERT`
  (chat logging) but cannot `SELECT` (transcripts contain PII). Server-side
  reads go through `INSFORGE_API_KEY` (project_admin) inside Netlify functions.
- **Publish endpoint hardened** — `cms-publish.js` now verifies the caller is
  in `cms_admins`, not just "has a valid token".

Schema lives in `migrations/20260927090143_create-cms-schema.sql`
(applied via `npx -y @insforge/cli db migrations up --all`).

## Verification

`node scripts/verify-rls.mjs` — re-runnable probe asserting:

```
PASS  anon reads visual_content        PASS  anon write denied (401)
PASS  cms_admins invisible to anon     PASS  chat_logs insert-only for anon
PASS  public signup disabled (403)
```

Run it after any RLS/config change. The one path it can't cover is an
authenticated admin write — verify once by hand in `/admin`.

## Data migrated

- `visual_content`: 6 rows (home, about, services, portfolio, contact, process)
- `chat_logs`: 39 rows (lead history)
- `visual_media`: empty on Supabase, nothing to move

## Env vars

Local (`.env.local`, gitignored) and Netlify (already set, all contexts):

```
PUBLIC_INSFORGE_URL=https://shneyhp8.us-west.insforge.app
PUBLIC_INSFORGE_ANON_KEY=anon_…          # anon role, public-safe
INSFORGE_URL=https://shneyhp8.us-west.insforge.app   # server functions
INSFORGE_API_KEY=ik_…                    # project_admin — server only
```

Retrieve keys any time: `npx -y @insforge/cli secrets get ANON_KEY|API_KEY`.
Old `PUBLIC_SUPABASE_*` vars remain on Netlify — harmless until removed after
cutover.

## Cutover checklist (merge to master)

1. Push `insforge-migration`; confirm the Netlify deploy preview builds and
   renders CMS content (all 6 pages already have data in InsForge).
2. Sign in to `…/admin` on the preview with `admin@newmediatek.net`, make a
   test edit, click **Save & Publish** — verifies auth + write RLS + the
   publish allowlist end-to-end.
3. Merge to `master`, trigger a production rebuild.
4. Remove `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` /
   `SUPABASE_SERVICE_ROLE_KEY` from Netlify env (Supabase becomes your
   practice/staging sandbox — the open-signup hole there no longer affects
   prod, but still close it for hygiene).
5. Re-run `node scripts/verify-rls.mjs` and update
   `docs/security-cms-audit-2026-09.md` (F1/F2 resolved by cutover).

## Rollback

Reverting the merge restores Supabase — no data was deleted there; both
backends held the same rows during transition.
