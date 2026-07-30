const { OpenAI } = require("openai");
const { createClient } = require("@supabase/supabase-js");
const { extractLead, cleanReply } = require("./lib/extractLead");
const { sendLeadEmail } = require("./lib/sendLeadEmail");
const { checkRateLimit } = require("./lib/rateLimit");
const { connectLambda, getStore } = require("@netlify/blobs");

// Sanitize text to prevent XSS in stored data
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .substring(0, 2000); // Max length limit
}

// Escape HTML for safe interpolation into email HTML bodies
function escapeHtml(input) {
  if (input == null) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Strip CR/LF to prevent email header injection in subject/reply-to fields
function stripNewlines(input) {
  if (input == null) return '';
  return String(input).replace(/[\r\n]+/g, ' ').trim();
}

// Validate email format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate and sanitize messages array
function validateMessages(messages) {
  if (!Array.isArray(messages)) return [];
  
  return messages
    .slice(-20) // Only keep last 20 messages to prevent abuse
    .filter(m => m && typeof m === 'object' && m.role && m.content)
    .map(m => ({
      role: ['user', 'assistant'].includes(m.role) ? m.role : 'user',
      content: sanitizeText(m.content)
    }));
}

// Netlify Blobs prompt cache (Lambda containers may be reused across invocations).
// In Lambda compatibility mode, the Blobs context is NOT auto-configured, so
// connectLambda(event) must be called before getStore on first use.
// TTL ensures prompt updates propagate to warm containers within 5 minutes.
let cachedChatPrompts = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function loadChatPrompts(event) {
  if (cachedChatPrompts && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedChatPrompts;
  }
  connectLambda(event);
  const store = getStore("chat-prompts");
  const [systemPrompt, guardPrompt] = await Promise.all([
    store.get("system_prompt"),
    store.get("guard_prompt"),
  ]);
  cachedChatPrompts = {
    systemPrompt: systemPrompt || undefined,
    guardPrompt: guardPrompt || undefined,
  };
  cacheTimestamp = Date.now();
  return cachedChatPrompts;
}

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Environment-based logging
  const isDev = process.env.CONTEXT !== 'production';
  const log = isDev ? console.log.bind(console) : () => {};

  // Rate limiting
  const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  const rateLimit = checkRateLimit(clientIP);
  
  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers: {
        'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimit.resetAt.toString()
      },
      body: JSON.stringify({ 
        error: 'Too many requests. Please wait a moment before trying again.',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      })
    };
  }

  try {
    log("[DEBUG] Received request");
    const data = JSON.parse(event.body);

    // Handle contact form submissions
    if (data.type === "contact_form") {
      return await handleContactForm(data);
    }

    let { messages } = data;
    
    // Validate and sanitize messages
    messages = validateMessages(messages);
    
    if (messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid messages format' })
      };
    }
    
    log("[DEBUG] Messages count:", messages?.length);

    // Configuration for AI Provider
    const apiKey =
      process.env.DEEPSEEK_API_KEY ||
      process.env.KIMI_API_KEY ||
      process.env.OPENAI_API_KEY;

    log("[DEBUG] API Key exists:", !!apiKey);

    if (!apiKey) {
      console.error("[ERROR] No API key found!");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No AI API key configured" }),
      };
    }

    let baseURL, model;
    if (process.env.DEEPSEEK_API_KEY) {
      baseURL = "https://api.deepseek.com/v1";
      model = "deepseek-chat";
    } else if (process.env.KIMI_API_KEY) {
      baseURL = "https://api.moonshot.cn/v1";
      model = "moonshot-v1-8k";
    } else {
      baseURL = undefined;
      model = "gpt-4o-mini";
    }

    log("[DEBUG] Using model:", model);

    const openai = new OpenAI({ apiKey, baseURL });

    // Layer A: Load system + guard prompts from Netlify Blobs (kept out of source
    // control AND out of env vars, to stay under the AWS Lambda 4KB env limit in
    // Lambda compatibility mode). Store: "chat-prompts" / keys: system_prompt,
    // guard_prompt. Populated via `netlify blobs:set` (see CHATBOT-SECURITY.md).
    let systemPrompt, guardPrompt;
    try {
      const prompts = await loadChatPrompts(event);
      systemPrompt = prompts.systemPrompt;
      guardPrompt = prompts.guardPrompt;
    } catch (blobErr) {
      console.error("[ERROR] Failed to load chat prompts from Netlify Blobs:", blobErr.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Chat service not configured" }),
      };
    }

    if (!systemPrompt) {
      console.error("[ERROR] system_prompt not found in Netlify Blobs store 'chat-prompts'");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Chat service not configured" }),
      };
    }

    // Layer B: Spotlighting - wrap user messages in <user_input> delimiters so the
    // model treats them as untrusted data, not instructions (Microsoft research defense).
    const spotlightedMessages = messages.map((m) => ({
      role: m.role,
      content: m.role === "user"
        ? `<user_input>\n${m.content}\n</user_input>`
        : m.content,
    }));

    const apiMessages = guardPrompt
      ? [{ role: "system", content: systemPrompt }, ...spotlightedMessages, { role: "system", content: guardPrompt }]
      : [{ role: "system", content: systemPrompt }, ...spotlightedMessages];

    log("[DEBUG] Making API call to:", model);
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: model,
        messages: apiMessages,
        temperature: 0.3,
      });
      log("[DEBUG] API call successful");
    } catch (apiError) {
      console.error("[ERROR] API call failed:", apiError.message);
      if (isDev) {
        console.error("[ERROR] Full API error:", JSON.stringify(apiError, null, 2));
      }
      throw apiError;
    }

    const rawReply = completion.choices[0].message.content;
    log("[DEBUG] Got reply:", rawReply?.substring(0, 100));
    
    // Clean reply for user (remove JSON markers)
    const reply = cleanReply(rawReply);
    
    // Combine all user messages for regex fallback (lead info may span multiple turns)
    const lastUserMessage = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    
    // Extract lead using 2-check approach: AI JSON first, then regex fallback
    const leadData = extractLead(rawReply, lastUserMessage);
    log("[DEBUG] Lead extraction result:", leadData ? 'Lead captured' : 'No lead');

    // Layer B: Output validation - reject fabricated leads. The captured email must
    // actually appear in the user's message content (not model-fabricated).
    let validatedLead = leadData;
    if (leadData && leadData.email) {
      const allUserContent = messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" ")
        .toLowerCase();
      if (!allUserContent.includes(leadData.email.toLowerCase())) {
        log("[DEBUG] Rejected lead: email not present in user messages");
        validatedLead = null;
      }
    }

    // Construct Transcript (needed for both email and Supabase)
    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    // Supabase client (used for dedup check + logging)
    const supabase = (process.env.PUBLIC_SUPABASE_URL && process.env.PUBLIC_SUPABASE_ANON_KEY)
      ? createClient(process.env.PUBLIC_SUPABASE_URL, process.env.PUBLIC_SUPABASE_ANON_KEY)
      : null;

    // Send Email via shared utility (Lead Alerts) with 24h deduplication
    let leadCaptured = false;
    if (validatedLead && isValidEmail(validatedLead.email)) {
      // Check for duplicate lead in the last 24 hours
      let isDuplicate = false;
      if (supabase) {
        try {
          const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const { data: existing } = await supabase
            .from("chat_logs")
            .select("id")
            .eq("lead_email", validatedLead.email.toLowerCase())
            .eq("is_lead", true)
            .gte("created_at", since)
            .limit(1);
          isDuplicate = existing && existing.length > 0;
        } catch (dedupErr) {
          console.error("[WARN] Dedup check failed, sending anyway:", dedupErr.message);
        }
      }

      if (!isDuplicate) {
        validatedLead.transcript = transcript;
        const emailSent = await sendLeadEmail('chatbot', validatedLead);
        log("[DEBUG] Lead email result:", emailSent ? 'SUCCESS' : 'FAILED');
        leadCaptured = true;
      } else {
        log("[DEBUG] Duplicate lead skipped:", validatedLead.email);
        leadCaptured = true; // Still show confirmation to user
      }
    }

    // Supabase Logging (Database Backup)
    if (supabase) {
      try {
        await supabase.from("chat_logs").insert([
          {
            lead_name: validatedLead ? sanitizeText(validatedLead.name) : null,
            lead_email: validatedLead ? sanitizeText(validatedLead.email) : null,
            lead_company: validatedLead ? sanitizeText(validatedLead.company) : null,
            lead_summary: validatedLead ? sanitizeText(validatedLead.summary) : null,
            transcript: sanitizeText(transcript),
            last_reply: sanitizeText(reply),
            is_lead: !!validatedLead,
          },
        ]);
      } catch (dbError) {
        console.error("Supabase logging failed:", dbError);
        // Don't fail the request if logging fails
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply, leadCaptured }),
    };
  } catch (error) {
    console.error("[ERROR] Main catch block:", error.message);
    console.error("[ERROR] Stack:", error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
};

// Handle contact form submissions
async function handleContactForm(data) {
  console.log("Processing contact form submission:", data);

  try {
    // Sanitize all inputs: strip newlines (header-injection prevention) and cap length
    const firstName = stripNewlines(data.firstName).substring(0, 100);
    const lastName = stripNewlines(data.lastName).substring(0, 100);
    const email = stripNewlines(data.email).substring(0, 254);
    const phone = stripNewlines(data.phone || "").substring(0, 30);
    const company = stripNewlines(data.company).substring(0, 100);
    const projectType = stripNewlines(data.projectType).substring(0, 100);
    const timeline = stripNewlines(data.timeline || "").substring(0, 50);
    const message = stripNewlines(data.message).substring(0, 2000);
    const newsletter = !!data.newsletter;

    // Validate email format before sending
    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email address" }),
      };
    }

    // Prepare email content (plain text - no HTML, newlines stripped)
    const emailContent = `
New Consultation Request from New Media Tek Website

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone || "Not provided"}
- Company: ${company}

Project Details:
- Project Type: ${projectType}
- Timeline: ${timeline}
- Message: ${message}
- Newsletter: ${newsletter ? "Yes" : "No"}

Submitted: ${new Date().toLocaleString()}
`;

    // Send email via SendGrid
    const sgApiKey = process.env.SENDGRID_API_KEY || process.env.NETLIFY_EMAILS_PROVIDER_API_KEY;
    if (!sgApiKey) {
      throw new Error("No SendGrid API key configured");
    }
    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(sgApiKey);
    
    const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || "contact@newmediatek.net";
    
    await sgMail.send({
      to: "admin@newmediatek.net",
      from: verifiedSender,
      replyTo: email,
      subject: `📋 New Consultation Request: ${company}`,
      text: emailContent,
      html: `<h2>📋 New Consultation Request</h2>
<h3>Contact Information:</h3>
<ul>
<li><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</li>
<li><strong>Email:</strong> ${escapeHtml(email)}</li>
<li><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</li>
<li><strong>Company:</strong> ${escapeHtml(company)}</li>
</ul>
<h3>Project Details:</h3>
<ul>
<li><strong>Project Type:</strong> ${escapeHtml(projectType)}</li>
<li><strong>Timeline:</strong> ${escapeHtml(timeline)}</li>
<li><strong>Message:</strong> ${escapeHtml(message)}</li>
<li><strong>Newsletter:</strong> ${newsletter ? "Yes" : "No"}</li>
</ul>
<p><em>Submitted: ${new Date().toLocaleString()}</em></p>`
    });
    
    console.log("Contact form email sent successfully via SendGrid");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending contact form email:", error.message);
    console.error("Full error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
}
