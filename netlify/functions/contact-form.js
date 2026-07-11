const { sendLeadEmail } = require('./lib/sendLeadEmail');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Build lead data from contact form
    const leadData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      company: data.company,
      phone: data.phone,
      projectType: data.projectType,
      timeline: data.timeline,
      message: data.message
    };
    
    // Use shared email utility
    const emailSent = await sendLeadEmail('contact', leadData);
    
    if (!emailSent) {
      throw new Error("Email sending failed");
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent via SendGrid"
      })
    };
    
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "SendGrid failed",
        details: error.message
      })
    };
  }
};
