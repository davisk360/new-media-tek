/**
 * E2E Email Test — SendGrid Integration
 * Tests both email flows: contact form + chatbot lead capture.
 * Run: node test-email-e2e.mjs
 *
 * Sends real emails to contact@newmediatek.net with [E2E TEST] prefix.
 * Safe to delete after verification.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sgMail from '@sendgrid/mail';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env ───────────────────────────────────────────────────────────────
function loadEnv() {
  const raw = readFileSync(join(__dirname, '.env'), 'utf-8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx);
    const val = trimmed.slice(eqIdx + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

// ─── Config ──────────────────────────────────────────────────────────────────
const apiKey = process.env.SENDGRID_API_KEY;
const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'contact@newmediatek.net';
const recipient = 'contact@newmediatek.net';

if (!apiKey) {
  console.error('❌ No SENDGRID_API_KEY found in .env');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

// ─── Test Helpers ────────────────────────────────────────────────────────────
const results = [];

function report(name, success, detail) {
  const icon = success ? '✅' : '❌';
  console.log(`${icon} ${name}: ${detail}`);
  results.push({ name, success, detail });
}

// ─── Test 1: Contact Form Email ──────────────────────────────────────────────
console.log('\n━━━ E2E Email Test ━━━\n');
console.log('Test 1: Contact form notification...');

try {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' });
  const msg = {
    to: recipient,
    from: verifiedSender,
    subject: `📋 [E2E TEST] Contact Form: Test Corp - ${timestamp}`,
    text: `[E2E TEST] New consultation request from E2E Test User at Test Corp.

Email: e2e-test@example.com
Phone: (808) 555-0199
Project: E2E Verification
Timeline: Immediate

Message:
This is an automated test of the contact form email flow. Safe to delete.

Submitted: ${timestamp} (Hawaii)`,
    html: `<h2>📋 [E2E TEST] New Consultation Request</h2>
<p><strong>From:</strong> E2E Test User</p>
<p><strong>Company:</strong> Test Corp</p>
<p><strong>Email:</strong> e2e-test@example.com</p>
<p><strong>Phone:</strong> (808) 555-0199</p>
<p><strong>Project Type:</strong> E2E Verification</p>
<p><strong>Timeline:</strong> Immediate</p>
<p><strong>Message:</strong> This is an automated test of the contact form email flow. Safe to delete.</p>
<p><em>Submitted: ${timestamp} (Hawaii)</em></p>`
  };

  const [response] = await sgMail.send(msg);
  const ok = response.statusCode >= 200 && response.statusCode < 300;
  report('Contact Form Email', ok, `HTTP ${response.statusCode} → ${recipient}`);
} catch (err) {
  report('Contact Form Email', false, err.message);
}

// ─── Test 2: Chatbot Lead Capture Email ──────────────────────────────────────
console.log('\nTest 2: Chatbot lead capture alert...');

try {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' });
  const transcript = 'USER: I need help with a .NET migration\nASSISTANT: Happy to help!\nUSER: My email is e2e-lead@example.com from Lead Industries';

  const msg = {
    to: recipient,
    from: verifiedSender,
    subject: `🔥 [E2E TEST] Chatbot Lead: Lead Industries - ${timestamp}`,
    text: `[E2E TEST] QUALIFIED LEAD CAPTURED!

Lead Details:
Name: E2E Bot Lead
Email: e2e-lead@example.com
Company: Lead Industries
Summary: .NET migration + Power BI — Q3 timeline

Full Transcript:
${transcript}

Captured: ${timestamp} (Hawaii)`,
    html: `<h2>🔥 [E2E TEST] Qualified Lead Captured!</h2>
<h3>Lead Details:</h3>
<ul>
<li><strong>Name:</strong> E2E Bot Lead</li>
<li><strong>Email:</strong> e2e-lead@example.com</li>
<li><strong>Company:</strong> Lead Industries</li>
<li><strong>Summary:</strong> .NET migration + Power BI — Q3 timeline</li>
</ul>
<h3>Transcript:</h3>
<pre>${transcript}</pre>
<p><em>Captured: ${timestamp} (Hawaii)</em></p>`
  };

  const [response] = await sgMail.send(msg);
  const ok = response.statusCode >= 200 && response.statusCode < 300;
  report('Chatbot Lead Email', ok, `HTTP ${response.statusCode} → ${recipient}`);
} catch (err) {
  report('Chatbot Lead Email', false, err.message);
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n━━━ Summary ━━━');
const passed = results.filter(r => r.success).length;
const total = results.length;
console.log(`${passed}/${total} tests passed`);

if (passed === total) {
  console.log(`\n🎉 All email flows working. Check ${recipient} for 2 test emails.\n`);
} else {
  console.log('\n⚠️  Some flows failed. See details above.\n');
  process.exit(1);
}
