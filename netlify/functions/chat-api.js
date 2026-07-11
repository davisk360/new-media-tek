const { OpenAI } = require("openai");
const { createClient } = require("@supabase/supabase-js");
const { extractLead, cleanReply } = require("./lib/extractLead");
const { sendLeadEmail } = require("./lib/sendLeadEmail");
const { checkRateLimit } = require("./lib/rateLimit");

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

// Validate and sanitize messages array
function validateMessages(messages) {
  if (!Array.isArray(messages)) return [];
  
  return messages
    .slice(-20) // Only keep last 20 messages to prevent abuse
    .filter(m => m && typeof m === 'object' && m.role && m.content)
    .map(m => ({
      role: ['user', 'assistant', 'system'].includes(m.role) ? m.role : 'user',
      content: sanitizeText(m.content)
    }));
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

    const systemPrompt = `
You are the Senior Architect Assistant for 'New Media Tek'.

COMPANY PROFILE:
- Senior .NET Architect-led agency (15+ years Fortune 500 experience)
- Data Solutions Developer with ML.NET and Power BI expertise
- AI-accelerated delivery
- US-based enterprise development

SERVICES:
- Custom .NET Applications (ASP.NET Core MVC, EF Core 10, React 19, Angular 21)
- REST APIs & Microservices (gRPC, Redis caching)
- Legacy Modernization (.NET Framework 2.0-4.8 → .NET 10)
- Advanced Data Solutions (ML.NET 5.0, Power BI Embedded, data architecture)
- UX/UI Design (React 19, Angular 21, Blazor)
- Cloud DevOps (Azure Functions, AWS Lambda, Docker/Kubernetes)

GOAL: Qualify leads → capture EMAIL and COMPANY NAME.

RESPONSE RULES:
- MAX 2 sentences
- NO preamble ("Great question!", "I'd be happy to...")
- NO bullet lists or multiple options
- ONE question per response
- Ask for email and company name only after understanding their need

STRICT CONSTRAINTS:
- Do NOT invent company facts (team size, pricing, timelines, past clients)
- If unsure about company details, say "I'd need to confirm that with our team"
- Never guess—deflect to consultation

FORBIDDEN:
- Explaining your process unprompted
- Offering information not explicitly asked
- Multiple questions in one response

===EXAMPLES===

User: "We have an old WebForms app"
Assistant: "WebForms modernization is our specialty. What .NET Framework version is it running?"

User: "4.5, it's our internal ERP"
Assistant: "EF6 on 4.5—common pattern. Timeline for migration?"

User: "Q3 ideally"
Assistant: "Q3 works. What's your email and company name?"

User: "mike@acme.com, Acme Corp"
Assistant: "Got it—expect contact at mike@acme.com within 24 hours.
***JSON_START***
{"LEAD_CAPTURED":true,"name":"Mike","email":"mike@acme.com","company":"Acme Corp","summary":"WebForms ERP migration, .NET 4.5, Q3 timeline"}
***JSON_END***"

User: "sarah@techfirm.io"
Assistant: "Thanks Sarah. What company are you with?"

User: "TechFirm Inc"
Assistant: "Got it—our Senior Architect and Data Solutions Developer will reach out to sarah@techfirm.io within 24 hours.
***JSON_START***
{"LEAD_CAPTURED":true,"name":"Sarah","email":"sarah@techfirm.io","company":"TechFirm Inc","summary":"Inquiry - needs qualification"}
***JSON_END***"

User: "How many people on your team?"
Assistant: "I'd need to confirm that with our team. Want me to have someone reach out with details?"

User: "What's your hourly rate?"
Assistant: "Depends on scope—our Senior Architect can discuss pricing. What's your email and company?"

User: "Just looking around"
Assistant: "No problem. Reach out when you have a .NET or data project to discuss."

===END EXAMPLES===

LEAD CAPTURE FORMAT (only when email AND company provided):
***JSON_START***
{"LEAD_CAPTURED":true,"name":"[if stated, else null]","email":"[exact email]","company":"[company name]","summary":"[tech + timeline]"}
***JSON_END***
    `;

    log("[DEBUG] Making API call to:", model);
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
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
    
    // Get last user message for regex fallback
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    // Extract lead using 2-check approach: AI JSON first, then regex fallback
    const leadData = extractLead(rawReply, lastUserMessage);
    log("[DEBUG] Lead extraction result:", leadData ? 'Lead captured' : 'No lead');

    // Construct Transcript (needed for both email and Supabase)
    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    // Send Email via shared utility (Lead Alerts)
    if (leadData) {
      leadData.transcript = transcript;
      const emailSent = await sendLeadEmail('chatbot', leadData);
      log("[DEBUG] Lead email result:", emailSent ? 'SUCCESS' : 'FAILED');
    }

    // Supabase Logging (Database Backup)
    if (
      process.env.PUBLIC_SUPABASE_URL &&
      process.env.PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = createClient(
        process.env.PUBLIC_SUPABASE_URL,
        process.env.PUBLIC_SUPABASE_ANON_KEY,
      );
      try {
        await supabase.from("chat_logs").insert([
          {
            lead_name: leadData ? sanitizeText(leadData.name) : null,
            lead_email: leadData ? sanitizeText(leadData.email) : null,
            lead_company: leadData ? sanitizeText(leadData.company) : null,
            lead_summary: leadData ? sanitizeText(leadData.summary) : null,
            transcript: sanitizeText(transcript),
            last_reply: sanitizeText(reply),
            is_lead: !!leadData,
          },
        ]);
      } catch (dbError) {
        console.error("Supabase logging failed:", dbError);
        // Don't fail the request if logging fails
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("[ERROR] Main catch block:", error.message);
    console.error("[ERROR] Stack:", error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to process request",
        details: error.message,
        stack: error.stack?.substring(0, 500)
      }),
    };
  }
};

// Handle contact form submissions
async function handleContactForm(data) {
  console.log("Processing contact form submission:", data);

  try {
    console.log("Sending email via Netlify Email integration");

    // Prepare email content
    const emailContent = `
New Consultation Request from New Media Tek Website

Contact Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Company: ${data.company}

Project Details:
- Project Type: ${data.projectType}
- Timeline: ${data.timeline}
- Message: ${data.message}
- Newsletter: ${data.newsletter ? "Yes" : "No"}

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
    
    console.log("Sending contact form email via SendGrid to: admin@newmediatek.net");
    
    await sgMail.send({
      to: "admin@newmediatek.net",
      from: verifiedSender,
      replyTo: data.email,
      subject: `📋 New Consultation Request: ${data.company}`,
      text: emailContent,
      html: `<h2>📋 New Consultation Request</h2>
<h3>Contact Information:</h3>
<ul>
<li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
<li><strong>Email:</strong> ${data.email}</li>
<li><strong>Phone:</strong> ${data.phone || "Not provided"}</li>
<li><strong>Company:</strong> ${data.company}</li>
</ul>
<h3>Project Details:</h3>
<ul>
<li><strong>Project Type:</strong> ${data.projectType}</li>
<li><strong>Timeline:</strong> ${data.timeline}</li>
<li><strong>Message:</strong> ${data.message}</li>
<li><strong>Newsletter:</strong> ${data.newsletter ? "Yes" : "No"}</li>
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
      body: JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
    };
  }
}
