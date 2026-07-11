const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  try {
    // Check environment variables
    const envStatus = {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      SMTP_HOST_VALUE: process.env.SMTP_HOST || 'NOT_SET',
      SMTP_PORT_VALUE: process.env.SMTP_PORT || 'NOT_SET',
      SMTP_USER_VALUE: process.env.SMTP_USER || 'NOT_SET'
    };

    // Try to create transporter and test connection
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465, // Try SSL port instead
      secure: true, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Allow Namecheap certificates
      }
    });

    // Test the connection
    await transporter.verify();
    
    // If verification passes, try to send a test email
    const testEmailResult = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'SMTP Test - New Media Tek',
      text: 'This is a test email to verify SMTP configuration is working.',
      html: '<p>This is a test email to verify SMTP configuration is working.</p>',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...envStatus,
        connection_test: 'SUCCESS',
        email_sent: true,
        message_id: testEmailResult.messageId,
        timestamp: new Date().toISOString()
      }, null, 2),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
