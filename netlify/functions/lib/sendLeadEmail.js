/**
 * Send a lead email via Resend (https://resend.com)
 * @param {string} source - 'contact' or 'chatbot'
 * @param {Object} leadData - { name, email, company, summary?, message?, transcript? }
 * @returns {Promise<boolean>} - true if sent successfully
 */
async function sendLeadEmail(source, leadData) {
  const apiKey = process.env.RESEND_API_KEY;
  const verifiedSender = process.env.RESEND_FROM || "New Media Tek <contact@newmediatek.net>";
  const recipient = process.env.LEAD_RECIPIENT || "contact@newmediatek.net";

  if (!apiKey) {
    console.error("[sendLeadEmail] No RESEND_API_KEY found");
    return false;
  }

  if (!leadData || !leadData.email) {
    console.error("[sendLeadEmail] Invalid lead data - missing email");
    return false;
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' });
  const icon = source === 'contact' ? '📋' : '🔥';
  const title = source === 'contact' ? 'Contact Form' : 'Chatbot Lead';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: verifiedSender,
        to: [recipient],
        reply_to: leadData.email,
        subject: `${icon} ${title}: ${leadData.company || 'Unknown'} - ${timestamp}`,
        text: buildTextContent(source, leadData, timestamp),
        html: buildHtmlContent(source, leadData, timestamp)
      })
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[sendLeadEmail] ${source} email failed (${response.status}):`, body);
      return false;
    }

    const result = await response.json();
    console.log(`[sendLeadEmail] ${source} email sent, id:`, result.id);
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
