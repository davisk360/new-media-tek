exports.handler = async (event, context) => {
  try {
    console.log("Testing contact-form template...");
    
    // Use built-in fetch in Netlify Functions
    const emailResponse = await fetch(`${process.env.URL}/.netlify/functions/emails/contact-form`, {
      headers: {
        "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        from: "test@newmediatek.net",
        to: "contact@newmediatek.net", 
        subject: "Test Contact Form Template",
        parameters: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "+1-555-123-4567",
          company: "Test Company",
          projectType: "Custom .NET Application",
          timeline: "Standard (3-6 months)",
          message: "This is a test of the contact form template.",
          newsletter: "Yes",
          submittedDate: new Date().toLocaleString()
        },
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Email service error:", emailResponse.status, errorText);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Email service error",
          status: emailResponse.status,
          details: errorText
        })
      };
    }

    console.log("Contact form template test email sent successfully!");
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Contact form template test email sent successfully!"
      })
    };
    
  } catch (error) {
    console.error("Test function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Test function failed",
        details: error.message
      })
    };
  }
};
