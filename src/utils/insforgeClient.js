import { createClient } from '@insforge/sdk';

// Shared InsForge client used by the CMS auth gate and the Visual CMS dashboard.
// A single instance is required so that a session established by
// insforge.auth.signInWithPassword in CMSAuth is visible to the save/publish
// calls in VISUAL_CMS_Dashboard (RLS then treats the caller as `authenticated`,
// and the is_cms_admin() allowlist gates writes to admin@newmediatek.net).
// Uses the publishable (anon) key only; the admin API key is never imported
// into client code.
const insforge =
  import.meta.env.PUBLIC_INSFORGE_URL && import.meta.env.PUBLIC_INSFORGE_ANON_KEY
    ? createClient({
        baseUrl: import.meta.env.PUBLIC_INSFORGE_URL,
        anonKey: import.meta.env.PUBLIC_INSFORGE_ANON_KEY,
      })
    : null;

export default insforge;
