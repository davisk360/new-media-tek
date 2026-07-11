exports.handler = async (event, context) => {
  try {
    console.log("Testing Netlify Email integration...");
    
    // Use built-in fetch in Netlify Functions
    const emailResponse = await fetch(`${process.env.URL}/.netlify/functions/emails/test-email`, {
      headers: {
        "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        from: "test@newmediatek.net",
        to: "contact@newmediatek.net", 
        subject: "Test Email from Netlify Function",
        text: "This is a test email to verify Netlify Email integration works.",
        html: "<p>This is a test email to verify Netlify Email integration works.</p>",
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

    console.log("Test email sent successfully!");
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Test email sent successfully!"
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
