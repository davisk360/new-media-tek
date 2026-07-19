import { createClient } from "@supabase/supabase-js";

// Shared Supabase client used by the CMS auth gate and the Visual CMS dashboard.
// A single instance is required so that a session established by
// supabase.auth.signInWithPassword in CMSAuth is visible to the save/publish
// calls in VISUAL_CMS_Dashboard (RLS then treats the caller as `authenticated`).
// Uses the publishable (anon) key only; the service_role key is never imported
// into client code.
const supabase =
  import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    ? createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      )
    : null;

export default supabase;
