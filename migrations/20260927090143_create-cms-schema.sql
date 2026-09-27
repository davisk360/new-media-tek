-- Visual CMS schema + locked-down RLS for InsForge.
-- Mirrors the Supabase schema (visual-cms-schema.sql) but the write path is
-- admin-allowlist from day one: cms_admins holds authorized emails and
-- is_cms_admin() is a SECURITY DEFINER check, so the Supabase hole
-- (public signup + FOR ALL USING(true)) cannot be reproduced here.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.visual_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(50) NOT NULL UNIQUE,            -- 'home', 'about', 'services', 'portfolio', 'contact', 'process'
  content JSONB NOT NULL DEFAULT '{}',         -- structured content for each page
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_edited_by TEXT,                         -- who edited last
  version INTEGER DEFAULT 1                    -- content version counter
);

CREATE TABLE IF NOT EXISTS public.visual_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,              -- 'image', 'document', 'video'
  file_size INTEGER NOT NULL,
  alt_text TEXT,
  usage_context JSONB DEFAULT '{}',            -- where this media is used
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat/lead capture written by netlify/functions/chat-api.js
CREATE TABLE IF NOT EXISTS public.chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_name TEXT,
  lead_email TEXT,
  lead_company TEXT,
  lead_summary TEXT,
  transcript TEXT,
  last_reply TEXT,
  is_lead BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin allowlist: emails that may write CMS tables. Manage via SQL only —
-- no RLS policies on this table means nobody can read or modify it via the API.
CREATE TABLE IF NOT EXISTS public.cms_admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.cms_admins (email)
VALUES ('admin@newmediatek.net')
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Keep updated_at honest even when callers forget to set it.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- SECURITY DEFINER so anon/authenticated can evaluate it without any grant on
-- cms_admins itself. auth.uid() is NULL for anon callers -> EXISTS = false.
CREATE OR REPLACE FUNCTION public.is_cms_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cms_admins a
    WHERE lower(a.email) = lower(
      (SELECT u.email FROM auth.users u WHERE u.id = auth.uid())
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_visual_content_page ON public.visual_content (page);
CREATE INDEX IF NOT EXISTS idx_visual_media_file_type ON public.visual_media (file_type);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON public.chat_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_chat_logs_lead_email ON public.chat_logs (lead_email) WHERE is_lead;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_visual_content_updated_at ON public.visual_content;
CREATE TRIGGER trg_visual_content_updated_at
  BEFORE UPDATE ON public.visual_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_visual_media_updated_at ON public.visual_media;
CREATE TRIGGER trg_visual_media_updated_at
  BEFORE UPDATE ON public.visual_media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Privileges (RLS is the real gate; grants only expose the verbs)
-- ---------------------------------------------------------------------------

GRANT SELECT ON public.visual_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.visual_content TO authenticated;

GRANT SELECT ON public.visual_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.visual_media TO authenticated;

-- chat-api writes with the anon key; nobody reads via the API (PII: names,
-- emails, transcripts). Server-side dedup reads use the admin API key.
GRANT INSERT ON public.chat_logs TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.visual_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visual_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_admins ENABLE ROW LEVEL SECURITY;

-- visual_content: public read, admin-only write
CREATE POLICY visual_content_public_read ON public.visual_content
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY visual_content_admin_insert ON public.visual_content
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_cms_admin()));

CREATE POLICY visual_content_admin_update ON public.visual_content
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_cms_admin()))
  WITH CHECK ((SELECT public.is_cms_admin()));

CREATE POLICY visual_content_admin_delete ON public.visual_content
  FOR DELETE TO authenticated
  USING ((SELECT public.is_cms_admin()));

-- visual_media: public read, admin-only write
CREATE POLICY visual_media_public_read ON public.visual_media
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY visual_media_admin_insert ON public.visual_media
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_cms_admin()));

CREATE POLICY visual_media_admin_update ON public.visual_media
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_cms_admin()))
  WITH CHECK ((SELECT public.is_cms_admin()));

CREATE POLICY visual_media_admin_delete ON public.visual_media
  FOR DELETE TO authenticated
  USING ((SELECT public.is_cms_admin()));

-- chat_logs: anyone can insert (chat logging), nobody can read via the API.
CREATE POLICY chat_logs_public_insert ON public.chat_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- cms_admins: no policies on purpose — the table is only reachable as
-- project_admin (SQL/dashboard) or through the SECURITY DEFINER helper.
