-- Visual CMS Schema for New Media Tek
-- This schema supports the intuitive, visual content management system

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS visual_content CASCADE;
DROP TABLE IF EXISTS visual_media CASCADE;

-- Visual Content Table
CREATE TABLE visual_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(50) NOT NULL UNIQUE, -- 'home', 'about', 'services', 'portfolio', 'contact'
  content JSONB NOT NULL DEFAULT '{}', -- Structured content for each page
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_edited_by TEXT, -- Track who edited last
  version INTEGER DEFAULT 1 -- Track content versions
);

-- Visual Media Table (for images, documents, etc.)
CREATE TABLE visual_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'image', 'document', 'video'
  file_size INTEGER NOT NULL,
  alt_text TEXT,
  usage_context JSONB DEFAULT '{}', -- Where this media is used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default content for each page (matches Astro page dynamic fields)
INSERT INTO visual_content (page, content) VALUES
('home', '{
  "hero_badge": "15+ Years Enterprise Experience",
  "hero_title": "Enterprise .NET Development",
  "hero_title_highlight": "AI-Accelerated.",
  "hero_subtitle": "Led by a Senior .NET Architect with Fortune 500 experience. Custom applications, REST APIs, and modernization delivered faster with AI-augmented development.",
  "service_1_title": "Custom .NET Applications",
  "service_1_desc": "Enterprise-grade ASP.NET Core and MVC solutions built with proven N-tier architecture patterns. Scalable, secure, and maintainable applications designed for Fortune 500 workloads.",
  "service_2_title": "REST APIs & Microservices",
  "service_2_desc": "Scalable gRPC and RESTful services with advanced caching strategies using Redis. High-performance APIs handling millions of requests with sub-second response times.",
  "service_3_title": "Legacy Modernization",
  "service_3_desc": "Upgrade .NET Framework 2.0-4.8 applications to modern .NET 8. Preserve business logic while gaining performance, security, and maintainability improvements.",
  "service_4_title": "UX/UI Design & Frontend",
  "service_4_desc": "Modern, responsive interfaces with Angular, Blazor, and React. User-centered design from Figma prototypes to production-ready TypeScript implementations.",
  "service_5_title": "Cloud Infrastructure & DevOps",
  "service_5_desc": "Robust CI/CD pipelines, Azure/AWS deployments, and infrastructure as code. Ensuring your applications scale reliably with enterprise-grade monitoring.",
  "client_1": "Wells Fargo Home Lending",
  "client_2": "Avionté",
  "client_3": "Piper Sandler",
  "client_4": "STRETTO INC",
  "client_5": "Park Industries",
  "client_6": "WE Energy",
  "faq_title": "Common Questions",
  "faq_subtitle": "Expert answers about our enterprise .NET development capabilities",
  "faq_1_q": "Do you work with legacy .NET versions?",
  "faq_1_a": "Yes, we specialize in legacy modernization. Our team has extensive experience upgrading .NET Framework 2.0 through 4.8 applications to modern .NET 8, preserving business logic while improving performance and security.",
  "faq_2_q": "How does AI-augmented development work?",
  "faq_2_a": "We integrate advanced AI tools into our development workflow for code generation, automated testing, and intelligent refactoring. This accelerates delivery by 40% while maintaining enterprise-grade quality standards.",
  "faq_3_q": "What does Senior-Led mean?",
  "faq_3_a": "Unlike agencies that rely on junior developers, every project is directly led by our Senior .NET Architect with 15+ years of Fortune 500 experience. This ensures enterprise-grade architecture from day one.",
  "faq_4_q": "Can you handle high-scale applications?",
  "faq_4_a": "Yes. Our team has built solutions handling 10,000+ concurrent users with sub-second response times using Redis caching, optimized Entity Framework queries, and scalable cloud architecture."
}'),
('about', '{
  "hero_badge": "Senior-Led .NET Excellence",
  "hero_title": "Enterprise .NET",
  "hero_title_highlight": "Leadership",
  "hero_subtitle": "Led by a Senior .NET Architect with 15+ years building enterprise solutions for Fortune 500 companies. AI-augmented development that delivers faster without compromising quality.",
  "architect_title": "Senior .NET Architect",
  "architect_experience": "15+ Years Enterprise Experience",
  "architect_section_1_title": "Fortune 500 Expertise",
  "architect_section_1_desc": "Designed and deployed enterprise-scale .NET solutions for Wells Fargo, Piper Sandler, and other Fortune 500 corporations. Deep expertise in high-pressure IT environments with proven delivery track record.",
  "architect_section_2_title": "Technical Leadership",
  "architect_section_2_desc": "Deep expertise in Windows Server environments, IIS 6.0-7.5, and modern cloud architecture. Skilled in N-tier application design, Entity Framework optimization, Redis caching, and WCF/REST service development.",
  "architect_stat_1_value": "15+",
  "architect_stat_1_label": "Years Experience",
  "architect_stat_2_value": "500+",
  "architect_stat_2_label": "Fortune Projects"
}'),
('services', '{
  "hero_badge": "Enterprise-Grade .NET Solutions",
  "hero_title": ".NET Development",
  "hero_title_highlight": "Services",
  "hero_subtitle": "Led by a Senior .NET Architect with Fortune 500 experience. We deliver enterprise-grade applications, APIs, and modernization solutions with AI-accelerated development.",
  "service_1_title": "Custom .NET Applications",
  "service_1_desc": "Enterprise-grade ASP.NET Core and MVC solutions built with proven N-tier architecture patterns. Scalable, secure, and maintainable applications.",
  "service_2_title": "REST APIs & Microservices",
  "service_2_desc": "Scalable gRPC and RESTful services with advanced caching strategies using Redis. High-performance APIs handling millions of requests.",
  "service_3_title": "Legacy Modernization",
  "service_3_desc": "Transform legacy .NET Framework 2.0-4.8 applications to modern .NET 8 with improved performance, security, and maintainability."
}'),
('portfolio', '{
  "hero_badge": "Fortune 500 Success Stories",
  "hero_title": "Enterprise",
  "hero_title_highlight": "Portfolio",
  "hero_subtitle": "Proven .NET solutions and advanced data analytics delivered for Fortune 500 corporations. Real-world enterprise applications, intelligent APIs, and data-driven modernization projects that drive business value."
}'),
('contact', '{
  "hero_badge": "Start Your Project",
  "hero_title": "Lets Build",
  "hero_title_highlight": "Together",
  "hero_subtitle": "Schedule a consultation with our Senior .NET Architect and Data Solutions Developer. Discuss your enterprise requirements and discover how AI-augmented development and advanced data analytics can accelerate your project.",
  "form_title": "Schedule Your Consultation",
  "contact_email": "contact@newmediatek.net",
  "contact_phone": "+1 (929) 630-5021"
}'),
('process', '{
  "hero_badge": "AI-Augmented Development",
  "hero_title": "Development",
  "hero_title_highlight": "Process",
  "hero_subtitle": "Senior-led .NET development and data solutions accelerated by AI. Enterprise-grade methodology combining 15+ years of Fortune 500 experience with ML.NET analytics and cutting-edge AI tools for faster, smarter delivery.",
  "ai_title": "AI-Augmented Methodology",
  "ai_subtitle": "Enterprise expertise + AI acceleration",
  "ai_section_1_title": "Senior Architect Oversight",
  "ai_section_1_desc": "Every project benefits from 15+ years of Fortune 500 experience. Our Senior .NET Architect reviews all AI-generated code ensuring enterprise-grade quality.",
  "ai_section_2_title": "AI-Enhanced Development",
  "ai_section_2_desc": "AI-assisted code generation, automated testing, and intelligent refactoring accelerate delivery while maintaining the highest quality standards.",
  "ai_stat_1_value": "40%",
  "ai_stat_1_label": "Faster Delivery",
  "ai_stat_2_value": "100%",
  "ai_stat_2_label": "Quality Assurance"
}');

-- Enable Row Level Security
ALTER TABLE visual_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for now, allow all - implement proper auth in production)
CREATE POLICY "Allow all operations on visual_content" ON visual_content FOR ALL USING (true);
CREATE POLICY "Allow all operations on visual_media" ON visual_media FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX idx_visual_content_page ON visual_content(page);
CREATE INDEX idx_visual_content_updated ON visual_content(updated_at);
CREATE INDEX idx_visual_media_type ON visual_media(file_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_visual_content_updated_at BEFORE UPDATE ON visual_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visual_media_updated_at BEFORE UPDATE ON visual_media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE visual_content IS 'Visual CMS content storage for each page section';
COMMENT ON TABLE visual_media IS 'Media files storage for the visual CMS';
COMMENT ON COLUMN visual_content.content IS 'JSONB structure containing all page content fields';
COMMENT ON COLUMN visual_content.page IS 'Page identifier: home, about, services, portfolio, contact';
