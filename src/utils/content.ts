// Content fetching utility for Visual CMS
// This bridges the CMS (InsForge) to the website pages

import { createClient } from '@insforge/sdk';

// Initialize InsForge client for build-time fetching (anon key, public read)
const insforgeUrl = import.meta.env.PUBLIC_INSFORGE_URL;
const insforgeKey = import.meta.env.PUBLIC_INSFORGE_ANON_KEY;

const insforge = insforgeUrl && insforgeKey
  ? createClient({ baseUrl: insforgeUrl, anonKey: insforgeKey })
  : null;

// Type definitions for content
export interface PageContent {
  [key: string]: string | number | boolean | object | null;
}

export interface ProjectContent {
  id: number;
  title: string;
  description: string;
  industry?: string;
  technologies?: string;
  stats?: string[];
  icon?: string;
  color?: string;
}

// Default content for each page (fallbacks if CMS unavailable)
const defaultContent: Record<string, PageContent> = {
  home: {
    // Hero Section
    hero_badge: "15+ Years Enterprise Experience",
    hero_title: "Enterprise .NET Development",
    hero_title_highlight: "AI-Accelerated.",
    hero_subtitle: "Led by a Senior .NET Architect with Fortune 500 experience. Custom applications, REST APIs, and modernization delivered faster with AI-augmented development.",
    hero_cta_primary: "Schedule Consultation",
    hero_cta_secondary: "View Services",
    
    // Services Overview
    service_1_title: "Custom .NET Applications",
    service_1_desc: "Enterprise-grade ASP.NET Core and MVC solutions built with proven N-tier architecture patterns for Fortune 500 companies.",
    service_2_title: "REST APIs & Microservices",
    service_2_desc: "Scalable gRPC and RESTful services with advanced caching strategies using Redis for optimal performance.",
    service_3_title: "Legacy Modernization",
    service_3_desc: "Upgrade .NET Framework 2.0-4.8 applications to modern .NET 10 with EF Core 10 optimization and modern frontend integration.",
    service_4_title: "UX/UI Design & Frontend",
    service_4_desc: "Modern, responsive interfaces built with React 19, Angular 21, and Blazor. Bridging the gap between complex enterprise logic and intuitive user experiences.",
    service_5_title: "Cloud Infrastructure & DevOps",
    service_5_desc: "Robust CI/CD pipelines and cloud infrastructure management. Secure deployment with Azure Functions, AWS Lambda, Docker/Kubernetes for high-availability systems.",
    
    // Team Section
    team_years: "15+",
    team_years_label: "Years Enterprise",
    team_member_1: ".NET Architect",
    team_member_2: "Data Solutions Developer",
    team_member_3: "UX/UI Developer",
    team_member_4: "DevOps Engineer",
    
    // Client Logos
    client_1: "Wells Fargo Home Lending",
    client_2: "Avionté",
    client_3: "Piper Sandler",
    client_4: "STRETTO INC",
    client_5: "Park Industries",
    client_6: "WE Energy",
    
    // FAQ Section
    faq_title: "Common Questions",
    faq_subtitle: "Expert answers about our enterprise .NET development capabilities",
    faq_1_q: "Do you work with legacy .NET versions?",
    faq_1_a: "Yes, we specialize in legacy modernization. We have deep expertise in .NET Framework versions 2.0 through 4.8 and help enterprises migrate to modern .NET 10 architectures while preserving critical business logic.",
    faq_2_q: "How does your AI-augmented development process work?",
    faq_2_a: "We integrate advanced AI tools into our development workflow for code generation, automated testing, and pattern recognition. This allows our Senior Architects to deliver enterprise-grade software up to 40% faster without compromising security or quality.",
    faq_3_q: "What does 'Senior-Led' mean for my project?",
    faq_3_a: "Unlike agencies that rely on junior developers, every New Media Tek project is architected and actively led by a Senior .NET Architect with Fortune 500 experience. This ensures superior code quality, scalability, and long-term maintainability.",
    faq_4_q: "Can you handle high-scale enterprise applications?",
    faq_4_a: "Yes. Our team has built and deployed solutions for Fortune 500 companies handling millions of transactions. We specialize in N-tier architecture, distributed caching (Redis), and scalable cloud infrastructure.",
  },
  
  about: {
    // Hero Section
    hero_badge: "Senior-Led .NET Excellence",
    hero_title: "Enterprise .NET",
    hero_title_highlight: "Leadership",
    hero_subtitle: "Led by a Senior .NET Architect with 15+ years building enterprise solutions for Fortune 500 companies. We deliver proven expertise with AI-accelerated development.",
    hero_cta_primary: "Meet the Team",
    hero_cta_secondary: "View Our Work",
    
    // Lead Architect Section
    architect_title: "Senior .NET Architect",
    architect_experience: "15+ Years Enterprise Experience",
    architect_section_1_title: "Fortune 500 Expertise",
    architect_section_1_desc: "Designed and deployed enterprise-scale .NET solutions for Fortune 500 and Fortune 5000 corporations. Extensive experience in high-pressure IT environments with complex system requirements.",
    architect_section_2_title: "Technical Leadership",
    architect_section_2_desc: "Deep expertise in Windows Server environments, IIS deployment, and N-tier application architecture. Proven track record of delivering scalable, secure enterprise applications.",
    architect_stat_1_value: "15+",
    architect_stat_1_label: "Years Experience",
    architect_stat_2_value: "500+",
    architect_stat_2_label: "Fortune Projects",
    
    // Skills
    skill_1_title: "Windows Server Expertise",
    skill_1_desc: "IIS 6.0 & 7.5 deployment specialist",
    skill_2_title: "N-Tier Architecture",
    skill_2_desc: "Enterprise application design patterns",
    skill_3_title: "EF Core 10",
    skill_3_desc: "Advanced data layer optimization",
    skill_4_title: "REST API Design",
    skill_4_desc: "Scalable service architecture",
  },
  
  services: {
    // Hero Section
    hero_badge: "Enterprise-Grade .NET Solutions",
    hero_title: ".NET Development",
    hero_title_highlight: "Services",
    hero_subtitle: "Led by a Senior .NET Architect with Fortune 500 experience. We deliver enterprise-grade applications, APIs, and modernization solutions with AI-accelerated development.",
    hero_cta_primary: "Start Your Project",
    hero_cta_secondary: "Our Process",
    
    // Service Cards
    service_1_title: "Custom .NET Applications",
    service_1_badge: "Core Service",
    service_1_desc: "Enterprise-grade ASP.NET Core and MVC solutions built with proven N-tier architecture patterns. Scalable applications designed for Fortune 500 environments with comprehensive security and performance optimization.",
    service_1_features: "ASP.NET Core MVC|EF Core 10 Integration|Windows Server & IIS Deployment",
    
    service_2_title: "REST APIs & Microservices",
    service_2_badge: "High Demand",
    service_2_desc: "Scalable gRPC and RESTful services with advanced caching strategies using Redis. High-performance APIs designed for millions of requests with robust security and monitoring.",
    service_2_features: "RESTful & gRPC APIs|Redis Caching|Microservices Architecture",
    
    service_3_title: "Legacy Modernization",
    service_3_badge: "Specialty",
    service_3_desc: "Transform legacy .NET Framework 2.0-4.8 applications to modern .NET 10. Preserve critical business logic while gaining performance, security, and maintainability benefits.",
    service_3_features: ".NET Framework to .NET 10|Database Migration|Code Refactoring",
    
    service_4_title: "UX/UI Design & Frontend",
    service_4_badge: "Full Stack",
    service_4_desc: "Modern, responsive interfaces built with React 19, Angular 21, and Blazor. We bridge the gap between complex enterprise logic and intuitive user experiences.",
    service_4_features: "React 19 & Angular 21|Blazor WebAssembly|Responsive Design",
    
    service_5_title: "Cloud Infrastructure & DevOps",
    service_5_badge: "End-to-End",
    service_5_desc: "Robust CI/CD pipelines and cloud infrastructure management. Secure deployment with Azure Functions, AWS Lambda, Docker/Kubernetes for high-availability systems.",
    service_5_features: "Azure & AWS|Docker/Kubernetes|CI/CD Pipelines",
  },
  
  portfolio: {
    // Hero Section
    hero_badge: "Fortune 500 Success Stories",
    hero_title: "Enterprise",
    hero_title_highlight: "Portfolio",
    hero_subtitle: "Proven .NET solutions and advanced data analytics delivered for Fortune 500 corporations. Real-world enterprise applications, intelligent APIs, and data-driven modernization projects that drive business value.",
    hero_cta_primary: "Discuss Your Project",
    hero_cta_secondary: "Our Services",
    
    // Projects are handled separately as dynamic content
  },
  
  contact: {
    // Hero Section
    hero_badge: "Start Your Project",
    hero_title: "Let's Build",
    hero_title_highlight: "Together",
    hero_subtitle: "Schedule a consultation with our Senior .NET Architect and Data Solutions Developer. Discuss your enterprise requirements and discover how AI-augmented development and advanced data analytics can accelerate your project.",
    hero_cta_primary: "Schedule Consultation",
    hero_cta_secondary: "Call Now",
    
    // Form Section
    form_title: "Schedule Your Consultation",
    
    // Contact Info
    contact_card_title: "Direct Contact",
    contact_response_time: "We typically respond within 24 hours",
  },
  
  process: {
    // Hero Section
    hero_badge: "AI-Augmented Development",
    hero_title: "Development",
    hero_title_highlight: "Process",
    hero_subtitle: "Senior-led .NET development and data solutions accelerated by AI. Enterprise-grade methodology combining 15+ years of Fortune 500 experience with ML.NET analytics and cutting-edge AI tools for faster, smarter delivery.",
    hero_cta_primary: "Start Your Project",
    hero_cta_secondary: "Our Services",
    
    // AI Section
    ai_title: "AI-Augmented Methodology",
    ai_subtitle: "Enterprise expertise + AI acceleration",
    ai_section_1_title: "Senior Architect Oversight",
    ai_section_1_desc: "Every project benefits from 15+ years of Fortune 500 experience. AI tools accelerate development while senior expertise ensures quality, security, and architectural excellence.",
    ai_section_2_title: "AI-Enhanced Development",
    ai_section_2_desc: "AI-assisted code generation, automated testing, and intelligent debugging accelerate routine tasks while maintaining enterprise standards and security protocols.",
    ai_stat_1_value: "40%",
    ai_stat_1_label: "Faster Delivery",
    ai_stat_2_value: "100%",
    ai_stat_2_label: "Quality Assurance",
  },
};

// Default projects for portfolio
const defaultProjects: ProjectContent[] = [
  {
    id: 1,
    title: "Enterprise Trading Platform",
    description: "High-frequency trading application with real-time data processing. Built with ASP.NET MVC, Entity Framework optimization, and Redis caching for sub-second response times.",
    industry: "Financial Services",
    technologies: "ASP.NET MVC|Entity Framework|Redis|SQL Server",
    stats: ["10,000+ concurrent users", "Sub-second transaction processing", "99.9% uptime achieved"],
    icon: "banknote",
    color: "blue"
  },
  {
    id: 2,
    title: "Patient Management System",
    description: "Modernized .NET 2.0 healthcare system to .NET 10 with Angular frontend. HIPAA-compliant architecture with enhanced security and mobile responsiveness.",
    industry: "Healthcare",
    technologies: ".NET 10|Angular 21|WCF Services|SQL Server",
    stats: ["500,000+ patient records", "HIPAA compliance achieved", "60% performance improvement"],
    icon: "heart-pulse",
    color: "cyan"
  },
  {
    id: 3,
    title: "E-commerce API Platform",
    description: "High-volume REST API platform handling millions of daily transactions. Microservices architecture with Redis caching and comprehensive API documentation.",
    industry: "Retail",
    technologies: "ASP.NET Core|Redis|Docker|Azure",
    stats: ["1M+ daily transactions", "API response < 100ms", "Auto-scaling enabled"],
    icon: "shopping-cart",
    color: "indigo"
  }
];

/**
 * Fetch page content from InsForge CMS
 * Falls back to default content if CMS unavailable
 */
export async function getPageContent(page: string): Promise<PageContent> {
  if (!insforge) {
    console.warn('InsForge not configured, using default content for:', page);
    return defaultContent[page] || {};
  }

  try {
    const { data, error } = await insforge.database
      .from('visual_content')
      .select('content')
      .eq('page', page)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching content for', page, ':', error.message);
      return defaultContent[page] || {};
    }

    // Merge CMS content with defaults (CMS takes precedence)
    return {
      ...defaultContent[page],
      ...(data?.content || {})
    };
  } catch (err) {
    console.error('Failed to fetch content for', page, ':', err);
    return defaultContent[page] || {};
  }
}

/**
 * Fetch portfolio projects from InsForge CMS
 * Falls back to default projects if CMS unavailable
 */
export async function getProjects(): Promise<ProjectContent[]> {
  if (!insforge) {
    console.warn('InsForge not configured, using default projects');
    return defaultProjects;
  }

  try {
    const { data, error } = await insforge.database
      .from('visual_content')
      .select('content')
      .eq('page', 'portfolio')
      .maybeSingle();

    if (error || !data?.content?.projects) {
      return defaultProjects;
    }

    return data.content.projects as ProjectContent[];
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return defaultProjects;
  }
}

/**
 * Fetch all content for multiple pages at once
 * Useful for preloading or SSG
 */
export async function getAllContent(): Promise<Record<string, PageContent>> {
  if (!insforge) {
    return defaultContent;
  }

  try {
    const { data, error } = await insforge.database
      .from('visual_content')
      .select('page, content');

    if (error) {
      console.warn('Error fetching all content:', error.message);
      return defaultContent;
    }

    const result: Record<string, PageContent> = { ...defaultContent };
    
    for (const row of data || []) {
      result[row.page] = {
        ...defaultContent[row.page],
        ...(row.content || {})
      };
    }

    return result;
  } catch (err) {
    console.error('Failed to fetch all content:', err);
    return defaultContent;
  }
}

/**
 * Helper to get a content value with fallback
 */
export function getContentValue(
  content: PageContent, 
  key: string, 
  fallback: string = ''
): string {
  return (content[key] as string) || fallback;
}

/**
 * Helper to split pipe-delimited features into array
 */
export function getFeatures(content: PageContent, key: string): string[] {
  const value = content[key] as string;
  if (!value) return [];
  return value.split('|').map(f => f.trim()).filter(Boolean);
}

export { defaultContent, defaultProjects };
