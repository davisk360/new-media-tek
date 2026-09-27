// Contact Form Handler with Security Features
// Prevents XSS and validates input before submission

interface FormElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  email: HTMLInputElement;
  phone: HTMLInputElement;
  company: HTMLInputElement;
  projectType: HTMLSelectElement;
  timeline: HTMLSelectElement;
  message: HTMLTextAreaElement;
  newsletter: HTMLInputElement;
}

// Client-side input sanitization (additional layer)
function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Email validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show error message
function showError(message: string): void {
  const errorDiv = document.getElementById('form-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Show success message
function showSuccess(message: string): void {
  const successDiv = document.getElementById('form-success');
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Hide messages
function hideMessages(): void {
  const errorDiv = document.getElementById('form-error');
  const successDiv = document.getElementById('form-success');
  if (errorDiv) errorDiv.classList.add('hidden');
  if (successDiv) successDiv.classList.add('hidden');
}

// Main form handler
export function initContactForm(): void {
  const form = document.getElementById('consultationForm') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    hideMessages();

    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalButtonText = submitButton?.innerHTML || 'Submit';
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>Sending...';
    }

    try {
      const elements = form.elements as FormElements;
      
      // Client-side validation
      if (!elements.firstName.value.trim() || elements.firstName.value.length < 2) {
        throw new Error('First name must be at least 2 characters');
      }
      if (!elements.lastName.value.trim() || elements.lastName.value.length < 2) {
        throw new Error('Last name must be at least 2 characters');
      }
      if (!validateEmail(elements.email.value)) {
        throw new Error('Please enter a valid email address');
      }
      if (!elements.company.value.trim() || elements.company.value.length < 2) {
        throw new Error('Company name is required');
      }
      if (!elements.projectType.value) {
        throw new Error('Please select a project type');
      }
      if (!elements.message.value.trim() || elements.message.value.length < 10) {
        throw new Error('Message must be at least 10 characters');
      }

      // Prepare payload — POST JSON to the Netlify function.
      // (The site is built as a static site, so /api/contact is not a live endpoint.)
      const payload = {
        firstName: elements.firstName.value.trim(),
        lastName: elements.lastName.value.trim(),
        email: elements.email.value.trim(),
        phone: elements.phone.value.trim(),
        company: elements.company.value.trim(),
        projectType: elements.projectType.value,
        timeline: elements.timeline?.value || '',
        message: elements.message.value.trim(),
        newsletter: elements.newsletter?.checked === true,
      };

      const response = await fetch('/.netlify/functions/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'An error occurred. Please try again.');
      }

      // Success!
      showSuccess(result.message || 'Thank you! We will be in touch soon.');
      form.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      showError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });

  // Real-time validation on blur
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  inputs.forEach((input) => {
    input.addEventListener('blur', (e) => {
      const element = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      validateField(element);
    });
  });
}

// Field validation helper
function validateField(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
  const value = element.value.trim();
  let isValid = true;
  let errorMessage = '';

  if (element.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (element.type === 'email' && value && !validateEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  } else if (element.name === 'message' && value && value.length < 10) {
    isValid = false;
    errorMessage = 'Message must be at least 10 characters';
  }

  // Show/hide error for individual field
  const parent = element.parentElement;
  if (!parent) return;

  let errorSpan = parent.querySelector('.field-error') as HTMLSpanElement;
  
  if (!isValid) {
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'field-error text-xs text-red-400 mt-1 block';
      parent.appendChild(errorSpan);
    }
    errorSpan.textContent = errorMessage;
    element.classList.add('border-red-500');
  } else {
    if (errorSpan) {
      errorSpan.remove();
    }
    element.classList.remove('border-red-500');
  }
}

// Initialize on page load
if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initContactForm);
}
