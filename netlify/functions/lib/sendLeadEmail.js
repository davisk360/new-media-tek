const sgMail = require('@sendgrid/mail');

/**
 * Send a lead email via SendGrid
 * @param {string} source - 'contact' or 'chatbot'
 * @param {Object} leadData - { name, email, company, summary?, message?, transcript? }
 * @returns {Promise<boolean>} - true if sent successfully
 */
async function sendLeadEmail(source, leadData) {
  const apiKey = process.env.SENDGRID_API_KEY || process.env.NETLIFY_EMAILS_PROVIDER_API_KEY;
  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || "contact@newmediatek.net";
  const recipient = "contact@newmediatek.net";

  if (!apiKey) {
    console.error("[sendLeadEmail] No SendGrid API key found");
    return false;
  }

  if (!leadData || !leadData.email) {
    console.error("[sendLeadEmail] Invalid lead data - missing email");
    return false;
  }

  sgMail.setApiKey(apiKey);

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' });
  const icon = source === 'contact' ? '📋' : '🔥';
  const title = source === 'contact' ? 'Contact Form' : 'Chatbot Lead';

  const msg = {
    to: recipient,
    from: verifiedSender,
    subject: `${icon} ${title}: ${leadData.company || 'Unknown'} - ${timestamp}`,
    text: buildTextContent(source, leadData, timestamp),
    html: buildHtmlContent(source, leadData, timestamp)
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`[sendLeadEmail] ${source} email sent, status:`, response[0]?.statusCode);
    return true;
  } catch (error) {
    console.error(`[sendLeadEmail] ${source} email failed:`, error.message);
    return false;
  }
}

function buildTextContent(source, data, timestamp) {
  if (source === 'contact') {
    return `New consultation request from ${data.name || 'Unknown'} at ${data.company}.

Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Project: ${data.projectType || 'Not specified'}
Timeline: ${data.timeline || 'Not specified'}

Message:
${data.message || 'No message'}

Submitted: ${timestamp} (Hawaii)`;
  } else {
    return `QUALIFIED LEAD CAPTURED!

Lead Details:
Name: ${data.name || 'Not provided'}
Email: ${data.email}
Company: ${data.company || 'Unknown'}
Summary: ${data.summary || 'Chat inquiry'}

${data.transcript ? `Full Transcript:\n${data.transcript}` : ''}

Captured: ${timestamp} (Hawaii)`;
  }
}

function buildHtmlContent(source, data, timestamp) {
  if (source === 'contact') {
    return `<h2>📋 New Consultation Request</h2>
<p><strong>From:</strong> ${data.name || 'Unknown'}</p>
<p><strong>Company:</strong> ${data.company}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
<p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
<p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
<p><strong>Message:</strong> ${data.message || 'No message'}</p>
<p><em>Submitted: ${timestamp} (Hawaii)</em></p>`;
  } else {
    return `<h2>🔥 Qualified Lead Captured!</h2>
<h3>Lead Details:</h3>
<ul>
<li><strong>Name:</strong> ${data.name || 'Not provided'}</li>
<li><strong>Email:</strong> ${data.email}</li>
<li><strong>Company:</strong> ${data.company || 'Unknown'}</li>
<li><strong>Summary:</strong> ${data.summary || 'Chat inquiry'}</li>
</ul>
${data.transcript ? `<h3>Transcript:</h3><pre>${data.transcript}</pre>` : ''}
<p><em>Captured: ${timestamp} (Hawaii)</em></p>`;
  }
}

module.exports = { sendLeadEmail };
