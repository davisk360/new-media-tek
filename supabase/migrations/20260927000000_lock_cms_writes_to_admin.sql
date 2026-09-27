-- Lock down CMS write policies to the admin account only.
--
-- Context: the "authenticated manage" policies grant INSERT/UPDATE/DELETE on
-- visual_content and visual_media to ANY authenticated session. Since public
-- email signup was enabled, anyone could self-register and gain full CMS write.
-- This migration scopes writes to the provisioned admin account(s) by email.
--
-- NOTE: replace the email below with the real CMS admin login email before
-- applying if it differs.

CREATE OR REPLACE FUNCTION public.is_cms_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() ->> 'email') = 'ADMIN_EMAIL_HERE';
$$;

DROP POLICY IF EXISTS "authenticated manage visual_content" ON public.visual_content;
DROP POLICY IF EXISTS "authenticated manage visual_media"  ON public.visual_media;

CREATE POLICY "admin manage visual_content" ON public.visual_content
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

CREATE POLICY "admin manage visual_media" ON public.visual_media
  TO authenticated
  USING (public.is_cms_admin())
  WITH CHECK (public.is_cms_admin());

-- anon and authenticated SELECT policies stay as-is (public read is intended).

-- Cleanup: remove the unauthorized self-registered probe account created during
-- the security audit (confirmations were disabled, so it could sign in).
-- ON DELETE CASCADE on auth.identities/auth.sessions removes related rows.
DELETE FROM auth.users WHERE email = 'rls-signup-probe-delete-me@newmediatek.net';
