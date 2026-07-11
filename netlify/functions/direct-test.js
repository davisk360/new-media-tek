exports.handler = async (event, context) => {
  try {
    const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || "noreply@newmediatek.net";
    const emailSecret = process.env.NETLIFY_EMAILS_SECRET;
    const siteUrl = process.env.URL;
    
    // Return debug info
    const debugInfo = {
      verifiedSender,
      emailSecretExists: !!emailSecret,
      siteUrl,
    };
    
    console.log("Debug info:", debugInfo);
    
    // Test with verified sender
    const emailResponse = await fetch(`${siteUrl}/.netlify/functions/emails/contact-form`, {
      headers: {
        "netlify-emails-secret": emailSecret,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        from: verifiedSender,
        to: "contact@newmediatek.net", 
        subject: "Direct Test Email",
        parameters: {
          firstName: "Direct",
          lastName: "Test",
          email: "direct@example.com",
          phone: "+1-555-123-4567",
          company: "Test Company",
          projectType: "Custom .NET Application",
          timeline: "Standard (3-6 months)",
          message: "This is a direct test of the email function.",
          newsletter: "Yes",
          submittedDate: new Date().toLocaleString()
        },
      }),
    });

    const responseText = await emailResponse.text();
    console.log("Email response status:", emailResponse.status);
    console.log("Email response text:", responseText);

    if (!emailResponse.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Email service error",
          status: emailResponse.status,
          details: responseText
        })
      };
    }

    console.log("Direct test email sent successfully!");
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Direct test email sent successfully!",
        status: emailResponse.status,
        response: responseText,
        debug: {
          verifiedSender: process.env.SENDGRID_VERIFIED_SENDER || "noreply@newmediatek.net",
          emailSecretExists: !!process.env.NETLIFY_EMAILS_SECRET,
          siteUrl: process.env.URL
        }
      })
    };
    
  } catch (error) {
    console.error("Direct test error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Direct test failed",
        details: error.message
      })
    };
  }
};
