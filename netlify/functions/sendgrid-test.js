const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  try {
    // Try multiple possible API key locations
    const apiKey = process.env.SENDGRID_API_KEY || process.env.NETLIFY_EMAILS_PROVIDER_API_KEY;
    const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || "contact@newmediatek.net";
    
    // Get recipient from query param or default
    const params = event.queryStringParameters || {};
    const recipient = params.to || 'contact@newmediatek.net';
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "SENDGRID_API_KEY environment variable not set"
        })
      };
    }
    
    sgMail.setApiKey(apiKey);
    
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' });
    const msg = {
      to: recipient,
      from: verifiedSender,
      subject: `New Media Tek Test - ${timestamp}`,
      text: `Test email sent at ${timestamp} (Hawaii Time). Your email system is working correctly!`,
      html: `<h1>Email System Test</h1><p>Sent at: <strong>${timestamp}</strong> (Hawaii Time)</p><p>Your New Media Tek email system is working correctly!</p>`,
    };
    
    const response = await sgMail.send(msg);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent via direct SendGrid API!",
        statusCode: response[0].statusCode,
        verifiedSender: verifiedSender
      })
    };
    
  } catch (error) {
    console.error("SendGrid error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "SendGrid API failed",
        details: error.message,
        response: error.response ? error.response.body : null
      })
    };
  }
};
