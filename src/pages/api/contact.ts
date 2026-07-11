import type { APIRoute } from 'astro';

// HTML sanitization function - removes potentially dangerous HTML/script tags
function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (optional field)
function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  projectType: string;
  timeline?: string;
  message: string;
  newsletter?: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    
    // Extract and sanitize all inputs
    const data: ContactFormData = {
      firstName: sanitizeInput(formData.get('firstName') as string),
      lastName: sanitizeInput(formData.get('lastName') as string),
      email: sanitizeInput(formData.get('email') as string),
      phone: sanitizeInput(formData.get('phone') as string || ''),
      company: sanitizeInput(formData.get('company') as string),
      projectType: sanitizeInput(formData.get('projectType') as string),
      timeline: sanitizeInput(formData.get('timeline') as string || ''),
      message: sanitizeInput(formData.get('message') as string),
      newsletter: formData.get('newsletter') === 'on',
    };

    // Validation
    const errors: string[] = [];

    if (!data.firstName || data.firstName.length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    if (!data.lastName || data.lastName.length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    if (!data.email || !isValidEmail(data.email)) {
      errors.push('Valid email address is required');
    }
    if (data.phone && !isValidPhone(data.phone)) {
      errors.push('Invalid phone number format');
    }
    if (!data.company || data.company.length < 2) {
      errors.push('Company name is required');
    }
    if (!data.projectType) {
      errors.push('Project type is required');
    }
    if (!data.message || data.message.length < 10) {
      errors.push('Message must be at least 10 characters');
    }

    // If validation fails, return errors
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          errors,
          message: 'Validation failed. Please check your input.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Rate limiting check (basic implementation)
    // In production, consider using Redis or similar for distributed rate limiting
    
    // Send email via SendGrid through Netlify function
    try {
      const emailResponse = await fetch('/.netlify/functions/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          projectType: data.projectType,
          timeline: data.timeline,
          message: data.message,
          newsletter: data.newsletter,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Email sending failed');
      }

      if (import.meta.env.DEV) {
        console.log('Email sent successfully via SendGrid');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails - don't block user
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your inquiry! We will contact you soon.',
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred processing your request. Please try again.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Prevent GET requests
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Method not allowed',
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST',
      },
    }
  );
};
