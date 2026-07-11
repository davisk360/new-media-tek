const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Get password from query parameter for testing
  const testPassword = event.queryStringParameters?.password;
  
  if (!testPassword) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Add ?password=YOUR_PASSWORD to URL to test",
        example: "https://newmediatek.net/.netlify/functions/test-password?password=yourtestpassword"
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    console.log('Testing password for:', process.env.SMTP_USER);
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: testPassword, // Use test password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Password works! Update SMTP_PASS with this password",
        tested_password: testPassword.substring(0, 3) + "***" // Show partial for security
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        tested_password: testPassword.substring(0, 3) + "***"
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
