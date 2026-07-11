const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  const testPassword = event.queryStringParameters?.password;
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      SMTP_HOST: process.env.SMTP_HOST || 'NOT_SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT_SET', 
      SMTP_USER: process.env.SMTP_USER || 'NOT_SET',
      SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT_SET'
    },
    namecheap_fix: "Using SSL port 465 with proper TLS configuration",
    tests: {}
  };

  // Test 1: Environment Variables
  results.tests.env_vars = {
    status: Object.values(results.environment).every(v => v !== 'NOT_SET'),
    details: results.environment
  };

  // Test 2: Basic SMTP Connection (no auth)
  try {
    const basicTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      tls: { rejectUnauthorized: false }
    });
    await basicTransporter.verify();
    results.tests.smtp_connection = { status: true, message: "SMTP server reachable" };
  } catch (error) {
    results.tests.smtp_connection = { status: false, error: error.message };
  }

  // Test 3: Authentication with current password
  if (process.env.SMTP_PASS) {
    try {
      const authTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: { rejectUnauthorized: false }
      });
      await authTransporter.verify();
      results.tests.current_auth = { status: true, message: "Current password works" };
    } catch (error) {
      results.tests.current_auth = { status: false, error: error.message };
    }
  }

  // Test 4: Authentication with test password (if provided)
  if (testPassword) {
    try {
      const testTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: testPassword
        },
        tls: { rejectUnauthorized: false }
      });
      await testTransporter.verify();
      results.tests.test_password = { 
        status: true, 
        message: "Test password works! Use this for SMTP_PASS",
        password_preview: testPassword.substring(0, 3) + "***"
      };
    } catch (error) {
      results.tests.test_password = { 
        status: false, 
        error: error.message,
        password_preview: testPassword.substring(0, 3) + "***"
      };
    }
  }

  // Test 5: Try Namecheap SSL configuration
  results.tests.namecheap_ssl = {};
  
  try {
    const namecheapTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: testPassword || process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'mail.privateemail.com'
      }
    });
    await namecheapTransporter.verify();
    results.tests.namecheap_ssl = { 
      status: true, 
      message: "Namecheap SSL configuration works!"
    };
  } catch (error) {
    results.tests.namecheap_ssl = { 
      status: false, 
      error: error.message
    };
  }

  // Test 6: Try different ports with proper SSL
  const portTests = [587, 465, 25];
  results.tests.port_scan = {};
  
  for (const port of portTests) {
    try {
      const portTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: testPassword || process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false,
          servername: 'mail.privateemail.com'
        }
      });
      await portTransporter.verify();
      results.tests.port_scan[port] = { status: true };
    } catch (error) {
      results.tests.port_scan[port] = { status: false, error: error.message };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results, null, 2),
    headers: { 'Content-Type': 'application/json' }
  };
};
