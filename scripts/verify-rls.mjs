#!/usr/bin/env node
/**
 * verify-rls.mjs — falsifiable security check for the CMS backend.
 *
 * Probes the InsForge data + auth APIs with the *anon* key and asserts the
 * security posture the site depends on:
 *
 *   PASS  anon can READ visual_content          (site renders CMS content)
 *   PASS  anon CANNOT write visual_content      (the Supabase hole, closed)
 *   PASS  anon CANNOT read cms_admins           (allowlist invisible)
 *   PASS  anon CAN insert chat_logs             (chat logging works)
 *   PASS  anon CANNOT read chat_logs            (PII: names/emails/transcripts)
 *   PASS  public signup is DISABLED             (no self-provisioned accounts)
 *
 * Usage:
 *   node scripts/verify-rls.mjs
 *   (reads PUBLIC_INSFORGE_URL / PUBLIC_INSFORGE_ANON_KEY from env or .env.local)
 *
 * Exit code 0 = all checks pass, 1 = any check failed.
 * The CMS write path for authenticated admins is NOT covered here — it needs a
 * real admin session, so verify it once by hand in the /admin dashboard.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env.local loader (no dotenv dependency)
for (const file of ['.env.local', '.env']) {
  const p = join(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const base = process.env.PUBLIC_INSFORGE_URL;
const key = process.env.PUBLIC_INSFORGE_ANON_KEY;

if (!base || !key) {
  console.error('Missing PUBLIC_INSFORGE_URL / PUBLIC_INSFORGE_ANON_KEY');
  process.exit(1);
}

const auth = { apikey: key, Authorization: `Bearer ${key}` };
const json = { ...auth, 'Content-Type': 'application/json' };

let failures = 0;
function report(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

async function req(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: body ? json : auth,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

const t = `rls-probe-${Date.now()}`;

// 1. anon CAN read visual_content
{
  const { status, data } = await req('GET', '/api/database/records/visual_content');
  report('anon reads visual_content', status === 200 && Array.isArray(data), `HTTP ${status}, ${Array.isArray(data) ? data.length + ' rows' : data}`);
}

// 2. anon CANNOT write visual_content
{
  const { status } = await req('POST', '/api/database/records/visual_content', { page: t, content: {} });
  report('anon write visual_content denied', status >= 400, `HTTP ${status}`);
}

// 3. anon CANNOT read cms_admins
{
  const { status, data } = await req('GET', '/api/database/records/cms_admins');
  report('anon read cms_admins returns nothing', status === 200 && Array.isArray(data) && data.length === 0, `HTTP ${status}, ${Array.isArray(data) ? data.length + ' rows' : 'not a list'}`);
}

// 4. anon CAN insert chat_logs
{
  const { status } = await req('POST', '/api/database/records/chat_logs', { lead_name: t, is_lead: false });
  report('anon insert chat_logs allowed', status === 200 || status === 201, `HTTP ${status}`);
}

// 5. anon CANNOT read chat_logs
{
  const { status, data } = await req('GET', '/api/database/records/chat_logs');
  report('anon read chat_logs returns nothing', status === 200 && Array.isArray(data) && data.length === 0, `HTTP ${status}, ${Array.isArray(data) ? data.length + ' rows' : 'not a list'}`);
}

// 6. public signup is disabled
{
  const { status } = await req('POST', '/api/auth/users', { email: `${t}@probe.invalid`, password: 'Probe123!x' });
  report('public signup disabled', status === 403 || status === 401, `HTTP ${status}`);
}

if (failures) {
  console.error(`\n${failures} check(s) FAILED — review RLS policies / auth config before shipping.`);
  process.exit(1);
}
console.log('\nAll checks passed.');
