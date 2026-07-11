// Site-wide configuration
// Edit your contact information here and it will populate across the entire site

export const siteConfig = {
  // Business Information
  name: "New Media Tek",
  tagline: "Digital Solutions for Modern Business",
  copyrightYear: 2026,

  // Contact Information
  contact: {
    phone: {
      display: "+1 (929) 630-5021",
      href: "+19296305021",
    },
    email: {
      display: "contact@newmediatek.net",
      href: "contact@newmediatek.net",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
    },
  },

  // Social Media Links
  social: {
    linkedin: "https://www.linkedin.com/company/new-media-tek/",
    twitter: "https://x.com/tek_new10419",
    facebook: "",
    instagram: "",
    github: "",
  },

  // Business Hours
  hours: {
    timezone: "America/New_York",
    schedule: "Mon-Fri 9AM-6PM EST",
  },

  // Schema.org / SEO
  seo: {
    telephone: "+1-929-630-5021", // Format for structured data
    contactType: "sales",
    availableLanguage: "en",
  },
} as const;

// Helper functions for common use cases
export const getPhoneLink = () => `tel:${siteConfig.contact.phone.href}`;
export const getEmailLink = () => `mailto:${siteConfig.contact.email.href}`;

export default siteConfig;
