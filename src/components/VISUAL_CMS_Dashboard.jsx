import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient.js';
import {
  Home, 
  Users, 
  Briefcase, 
  FileText, 
  Phone, 
  Eye,
  Edit3,
  Save,
  X,
  Plus,
  LogOut,
  ChevronRight,
  Layout,
  Globe,
  Trash2,
  Banknote,
  HeartPulse,
  ShoppingCart,
  Cpu,
  Database,
  Cloud,
  Code,
  Server,
  Shield,
  Zap,
  Settings,
  Target,
  TrendingUp,
  Award,
  Building,
  Factory,
  Truck,
  Plane,
  GraduationCap,
  Stethoscope,
  Scale,
  Landmark,
  Wallet,
  CreditCard,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Gauge,
  Layers,
  Box,
  Package,
  Rocket,
  Lightbulb,
  Wrench,
  Hammer,
  ChevronDown
} from 'lucide-react';

// Common icons for dropdown picker
const COMMON_ICONS = [
  { name: 'banknote', label: 'Finance/Banking', Icon: Banknote },
  { name: 'heart-pulse', label: 'Healthcare', Icon: HeartPulse },
  { name: 'shopping-cart', label: 'Retail/E-commerce', Icon: ShoppingCart },
  { name: 'cpu', label: 'Technology/IoT', Icon: Cpu },
  { name: 'database', label: 'Data/Database', Icon: Database },
  { name: 'cloud', label: 'Cloud Services', Icon: Cloud },
  { name: 'code', label: 'Development', Icon: Code },
  { name: 'server', label: 'Infrastructure', Icon: Server },
  { name: 'shield', label: 'Security', Icon: Shield },
  { name: 'zap', label: 'Performance', Icon: Zap },
  { name: 'settings', label: 'Configuration', Icon: Settings },
  { name: 'target', label: 'Goals/Targeting', Icon: Target },
  { name: 'trending-up', label: 'Growth/Analytics', Icon: TrendingUp },
  { name: 'award', label: 'Achievement', Icon: Award },
  { name: 'building', label: 'Enterprise/Corporate', Icon: Building },
  { name: 'factory', label: 'Manufacturing', Icon: Factory },
  { name: 'truck', label: 'Logistics/Shipping', Icon: Truck },
  { name: 'plane', label: 'Travel/Aviation', Icon: Plane },
  { name: 'graduation-cap', label: 'Education', Icon: GraduationCap },
  { name: 'stethoscope', label: 'Medical', Icon: Stethoscope },
  { name: 'scale', label: 'Legal/Justice', Icon: Scale },
  { name: 'landmark', label: 'Government', Icon: Landmark },
  { name: 'wallet', label: 'Payments', Icon: Wallet },
  { name: 'credit-card', label: 'Financial Services', Icon: CreditCard },
  { name: 'bar-chart-3', label: 'Reports/Charts', Icon: BarChart3 },
  { name: 'pie-chart', label: 'Analytics', Icon: PieChart },
  { name: 'line-chart', label: 'Trends', Icon: LineChart },
  { name: 'activity', label: 'Monitoring', Icon: Activity },
  { name: 'gauge', label: 'Performance Metrics', Icon: Gauge },
  { name: 'layers', label: 'Architecture', Icon: Layers },
  { name: 'box', label: 'Products', Icon: Box },
  { name: 'package', label: 'Delivery/Packages', Icon: Package },
  { name: 'rocket', label: 'Startup/Launch', Icon: Rocket },
  { name: 'lightbulb', label: 'Innovation/Ideas', Icon: Lightbulb },
  { name: 'wrench', label: 'Tools/Maintenance', Icon: Wrench },
  { name: 'hammer', label: 'Construction/Building', Icon: Hammer },
  { name: 'briefcase', label: 'Business', Icon: Briefcase },
  { name: 'users', label: 'Team/People', Icon: Users },
  { name: 'phone', label: 'Contact/Communication', Icon: Phone },
];

// Shared Supabase client (imported at the top of the file). The same instance
// is used by CMSAuth so the authenticated session from sign-in is visible here.

// Add New Page Form Component
const AddNewPageForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    pageId: '',
    title: '',
    url: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate page ID from title if not provided
    const pageId = formData.pageId || formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const url = formData.url || `/${pageId}`;

    onSubmit({
      pageId,
      title: formData.title,
      url,
      content: {
        title: formData.title,
        description: formData.description,
        content: ''
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Blog, Careers, FAQ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page ID (URL)
        </label>
        <input
          type="text"
          value={formData.pageId}
          onChange={(e) => setFormData(prev => ({ ...prev, pageId: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., blog, careers, faq (auto-generated from title)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Will be used in URL: /{formData.pageId || 'page-id'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Brief description of this page..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Page
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Add Project Form Component
const AddProjectForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    industry: '',
    technologies: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Project</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., E-commerce Platform, IoT Dashboard"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Describe the project, challenges, and solutions..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Financial, Healthcare"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., .NET, React, Azure"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Project
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const VISUAL_CMS_Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [editingField, setEditingField] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddPage, setShowAddPage] = useState(false);
  const [customPages, setCustomPages] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [panelWidth, setPanelWidth] = useState(384); // Live preview panel width
  const [isResizing, setIsResizing] = useState(false); // New state for live preview
  const [highlightedField, setHighlightedField] = useState(null); // Track field highlighted from preview click
  const fieldRefs = React.useRef({}); // Refs to scroll to fields

  // Handle clicking on preview to edit corresponding field
  const handlePreviewClick = (sectionId, fieldId) => {
    const fieldKey = `${sectionId}-${fieldId}`;
    setEditingField(fieldKey);
    setHighlightedField(fieldKey);
    
    // Scroll to the field in the edit panel
    setTimeout(() => {
      const fieldElement = fieldRefs.current[fieldKey];
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldElement.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
        setTimeout(() => {
          fieldElement.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
        }, 2000);
      }
    }, 100);
    
    // Clear highlight after delay
    setTimeout(() => setHighlightedField(null), 3000);
  };

  // Page structure with visual mapping - ALL fields sync to website (100% MIRROR)
  const pageStructure = {
    home: {
      title: "Homepage",
      icon: Home,
      url: "/",
      sections: [
        {
          id: 'hero',
          name: 'Hero Section',
          icon: Layout,
          fields: [
            { id: 'hero_badge', label: 'Badge Text', type: 'text', preview: '15+ Years Enterprise Experience' },
            { id: 'hero_title', label: 'Main Headline', type: 'heading', preview: 'Enterprise .NET Development' },
            { id: 'hero_title_highlight', label: 'Headline Highlight', type: 'text', preview: 'AI-Accelerated.' },
            { id: 'hero_subtitle', label: 'Subtitle', type: 'textarea', preview: 'Led by a Senior .NET Architect with Fortune 500 experience. Custom applications, REST APIs, and modernization delivered faster with AI-augmented development.' },
            { id: 'hero_cta_primary', label: 'Primary Button', type: 'text', preview: 'Schedule Consultation' },
            { id: 'hero_cta_secondary', label: 'Secondary Button', type: 'text', preview: 'View Services' }
          ]
        },
        {
          id: 'team_card',
          name: 'Team Excellence Card',
          icon: Users,
          fields: [
            { id: 'team_card_title', label: 'Card Title', type: 'text', preview: 'Team Excellence' },
            { id: 'team_card_badge', label: 'Card Badge', type: 'text', preview: 'AI-Enhanced' },
            { id: 'team_counter_value', label: 'Counter Value', type: 'text', preview: '15+' },
            { id: 'team_counter_label', label: 'Counter Label', type: 'text', preview: 'Years Enterprise' },
            { id: 'team_role_1_icon', label: 'Role 1 Icon', type: 'icon', preview: 'crown' },
            { id: 'team_role_1_title', label: 'Role 1 Title', type: 'text', preview: '.NET Architect' },
            { id: 'team_role_2_icon', label: 'Role 2 Icon', type: 'icon', preview: 'database' },
            { id: 'team_role_2_title', label: 'Role 2 Title', type: 'text', preview: 'Data Solutions Developer' },
            { id: 'team_role_3_icon', label: 'Role 3 Icon', type: 'icon', preview: 'palette' },
            { id: 'team_role_3_title', label: 'Role 3 Title', type: 'text', preview: 'UX/UI Developer' },
            { id: 'team_role_4_icon', label: 'Role 4 Icon', type: 'icon', preview: 'server' },
            { id: 'team_role_4_title', label: 'Role 4 Title', type: 'text', preview: 'DevOps Engineer' }
          ]
        },
        {
          id: 'services',
          name: 'Services Cards',
          icon: Briefcase,
          fields: [
            { id: 'service_1_icon', label: 'Service 1 Icon', type: 'icon', preview: 'code-2' },
            { id: 'service_1_title', label: 'Service 1 Title', type: 'text', preview: 'Custom .NET Applications' },
            { id: 'service_1_desc', label: 'Service 1 Description', type: 'textarea', preview: 'Enterprise-grade ASP.NET Core and MVC solutions built with proven N-tier architecture patterns for Fortune 500 companies.' },
            { id: 'service_2_icon', label: 'Service 2 Icon', type: 'icon', preview: 'network' },
            { id: 'service_2_title', label: 'Service 2 Title', type: 'text', preview: 'REST APIs & Microservices' },
            { id: 'service_2_desc', label: 'Service 2 Description', type: 'textarea', preview: 'Scalable gRPC and RESTful services with advanced caching strategies using Redis for optimal performance.' },
            { id: 'service_3_icon', label: 'Service 3 Icon', type: 'icon', preview: 'rocket' },
            { id: 'service_3_title', label: 'Service 3 Title', type: 'text', preview: 'Legacy Modernization' },
            { id: 'service_3_desc', label: 'Service 3 Description', type: 'textarea', preview: 'Upgrade .NET Framework 2.0-4.8 applications to modern .NET 10 with EF Core 10 optimization and modern frontend integration.' },
            { id: 'service_4_icon', label: 'Service 4 Icon', type: 'icon', preview: 'layout' },
            { id: 'service_4_title', label: 'Service 4 Title', type: 'text', preview: 'UX/UI Design & Frontend' },
            { id: 'service_4_desc', label: 'Service 4 Description', type: 'textarea', preview: 'Modern, responsive interfaces built with React 19, Angular 21, and Blazor. Bridging the gap between complex enterprise logic and intuitive user experiences.' },
            { id: 'service_5_icon', label: 'Service 5 Icon', type: 'icon', preview: 'cloud' },
            { id: 'service_5_title', label: 'Service 5 Title', type: 'text', preview: 'Cloud Infrastructure & DevOps' },
            { id: 'service_5_desc', label: 'Service 5 Description', type: 'textarea', preview: 'Robust CI/CD pipelines and cloud infrastructure management. Secure deployment with Azure Functions, AWS Lambda, Docker/Kubernetes for high-availability systems.' }
          ]
        },
        {
          id: 'clients',
          name: 'Client Logos Section',
          icon: Users,
          fields: [
            { id: 'clients_title', label: 'Section Title', type: 'text', preview: 'Led by Fortune 500 Experience' },
            { id: 'client_1_icon', label: 'Client 1 Icon', type: 'icon', preview: 'landmark' },
            { id: 'client_1', label: 'Client 1 Name', type: 'text', preview: 'Wells Fargo Home Lending' },
            { id: 'client_2_icon', label: 'Client 2 Icon', type: 'icon', preview: 'users' },
            { id: 'client_2', label: 'Client 2 Name', type: 'text', preview: 'Avionté' },
            { id: 'client_3_icon', label: 'Client 3 Icon', type: 'icon', preview: 'trending-up' },
            { id: 'client_3', label: 'Client 3 Name', type: 'text', preview: 'Piper Sandler' },
            { id: 'client_4_icon', label: 'Client 4 Icon', type: 'icon', preview: 'zap' },
            { id: 'client_4', label: 'Client 4 Name', type: 'text', preview: 'STRETTO INC' },
            { id: 'client_5_icon', label: 'Client 5 Icon', type: 'icon', preview: 'factory' },
            { id: 'client_5', label: 'Client 5 Name', type: 'text', preview: 'Park Industries' },
            { id: 'client_6_icon', label: 'Client 6 Icon', type: 'icon', preview: 'power' },
            { id: 'client_6', label: 'Client 6 Name', type: 'text', preview: 'WE Energy' }
          ]
        },
        {
          id: 'faq',
          name: 'FAQ Section',
          icon: FileText,
          fields: [
            { id: 'faq_title', label: 'FAQ Title', type: 'heading', preview: 'Common Questions' },
            { id: 'faq_subtitle', label: 'FAQ Subtitle', type: 'text', preview: 'Expert answers about our enterprise .NET development capabilities' },
            { id: 'faq_1_q', label: 'FAQ 1 Question', type: 'text', preview: 'Do you work with legacy .NET versions?' },
            { id: 'faq_1_a', label: 'FAQ 1 Answer', type: 'textarea', preview: 'Yes, we specialize in legacy modernization. We have deep expertise in .NET Framework versions 2.0 through 4.8 and help enterprises migrate to modern .NET 10 architectures while preserving critical business logic.' },
            { id: 'faq_2_q', label: 'FAQ 2 Question', type: 'text', preview: 'How does AI-augmented development work?' },
            { id: 'faq_2_a', label: 'FAQ 2 Answer', type: 'textarea', preview: 'We integrate advanced AI tools into our workflow for code generation, automated testing, and pattern recognition. This allows our Senior Architects to deliver enterprise-grade software up to 40% faster without compromising security.' },
            { id: 'faq_3_q', label: 'FAQ 3 Question', type: 'text', preview: 'What does "Senior-Led" mean?' },
            { id: 'faq_3_a', label: 'FAQ 3 Answer', type: 'textarea', preview: 'Unlike agencies that rely on junior developers, every project is architected and actively led by a Senior .NET Architect with Fortune 500 experience. This ensures superior quality and scalability.' },
            { id: 'faq_4_q', label: 'FAQ 4 Question', type: 'text', preview: 'Can you handle high-scale applications?' },
            { id: 'faq_4_a', label: 'FAQ 4 Answer', type: 'textarea', preview: 'Yes. Our team has built solutions for Fortune 500 companies handling millions of transactions. We specialize in N-tier architecture, distributed caching (Redis), and scalable cloud infrastructure.' },
            { id: 'faq_5_q', label: 'FAQ 5 Question', type: 'text', preview: 'Do you handle frontend design and cloud DevOps?' },
            { id: 'faq_5_a', label: 'FAQ 5 Answer', type: 'textarea', preview: 'Yes. We are a full-service modernization partner. Beyond .NET backend, we provide comprehensive UX/UI Design (React 19, Angular 21, Blazor) and Cloud Infrastructure management (Azure Functions, AWS Lambda, Docker/Kubernetes, CI/CD) to deliver complete, production-ready solutions.' }
          ]
        },
        {
          id: 'cta',
          name: 'Call to Action Section',
          icon: Phone,
          fields: [
            { id: 'cta_title', label: 'CTA Title', type: 'heading', preview: 'Ready to modernize your .NET applications?' },
            { id: 'cta_description', label: 'CTA Description', type: 'textarea', preview: 'Work with a Senior .NET Architect who\'s built enterprise solutions at Fortune 500 scale. Faster delivery with AI-augmented development.' },
            { id: 'cta_button_primary', label: 'Primary Button', type: 'text', preview: 'Start a Project' },
            { id: 'cta_button_secondary', label: 'Secondary Button', type: 'text', preview: 'Learn More' }
          ]
        }
      ]
    },
    about: {
      title: 'About Page',
      icon: Users,
      url: '/about',
      sections: [
        {
          id: 'hero',
          name: 'Hero Section',
          icon: Layout,
          fields: [
            { id: 'hero_badge', label: 'Badge Text', type: 'text', preview: 'Senior-Led .NET Excellence' },
            { id: 'hero_title', label: 'Page Title', type: 'heading', preview: 'Enterprise .NET' },
            { id: 'hero_title_highlight', label: 'Title Highlight', type: 'text', preview: 'Leadership' },
            { id: 'hero_subtitle', label: 'Subtitle', type: 'textarea', preview: 'Led by a Senior .NET Architect with 15+ years building enterprise solutions for Fortune 500 companies. We deliver proven expertise with AI-accelerated development.' },
            { id: 'hero_cta_primary', label: 'Primary Button', type: 'text', preview: 'Meet the Team' },
            { id: 'hero_cta_secondary', label: 'Secondary Button', type: 'text', preview: 'View Our Work' }
          ]
        },
        {
          id: 'architect',
          name: 'Lead Architect Section',
          icon: Users,
          fields: [
            { id: 'architect_icon', label: 'Section Icon', type: 'icon', preview: 'award' },
            { id: 'architect_title', label: 'Architect Title', type: 'text', preview: 'Senior .NET Architect' },
            { id: 'architect_experience', label: 'Experience Text', type: 'text', preview: '15+ Years Enterprise Experience' },
            { id: 'architect_section_1_title', label: 'Section 1 Title', type: 'text', preview: 'Fortune 500 Expertise' },
            { id: 'architect_section_1_desc', label: 'Section 1 Description', type: 'textarea', preview: 'Designed and deployed enterprise-scale .NET solutions for Fortune 500 and Fortune 5000 corporations. Extensive experience in high-pressure IT environments with complex system requirements.' },
            { id: 'architect_section_2_title', label: 'Section 2 Title', type: 'text', preview: 'Technical Leadership' },
            { id: 'architect_section_2_desc', label: 'Section 2 Description', type: 'textarea', preview: 'Deep expertise in Windows Server environments, IIS deployment, and N-tier application architecture. Proven track record of delivering scalable, secure enterprise applications.' },
            { id: 'architect_stat_1_value', label: 'Stat 1 Value', type: 'text', preview: '15+' },
            { id: 'architect_stat_1_label', label: 'Stat 1 Label', type: 'text', preview: 'Years Experience' },
            { id: 'architect_stat_2_value', label: 'Stat 2 Value', type: 'text', preview: '500+' },
            { id: 'architect_stat_2_label', label: 'Stat 2 Label', type: 'text', preview: 'Fortune Projects' }
          ]
        },
        {
          id: 'architect_skills',
          name: 'Architect Skills List',
          icon: Briefcase,
          fields: [
            { id: 'skill_1_icon', label: 'Skill 1 Icon', type: 'icon', preview: 'server' },
            { id: 'skill_1_title', label: 'Skill 1 Title', type: 'text', preview: 'Windows Server Expertise' },
            { id: 'skill_1_subtitle', label: 'Skill 1 Subtitle', type: 'text', preview: 'IIS 6.0 & 7.5 deployment specialist' },
            { id: 'skill_2_icon', label: 'Skill 2 Icon', type: 'icon', preview: 'layers' },
            { id: 'skill_2_title', label: 'Skill 2 Title', type: 'text', preview: 'N-Tier Architecture' },
            { id: 'skill_2_subtitle', label: 'Skill 2 Subtitle', type: 'text', preview: 'Enterprise application design patterns' },
            { id: 'skill_3_icon', label: 'Skill 3 Icon', type: 'icon', preview: 'database' },
            { id: 'skill_3_title', label: 'Skill 3 Title', type: 'text', preview: 'EF Core 10' },
            { id: 'skill_3_subtitle', label: 'Skill 3 Subtitle', type: 'text', preview: 'Advanced data layer optimization' },
            { id: 'skill_4_icon', label: 'Skill 4 Icon', type: 'icon', preview: 'globe' },
            { id: 'skill_4_title', label: 'Skill 4 Title', type: 'text', preview: 'gRPC Services' },
            { id: 'skill_4_subtitle', label: 'Skill 4 Subtitle', type: 'text', preview: 'Modern enterprise integration' },
            { id: 'skill_5_icon', label: 'Skill 5 Icon', type: 'icon', preview: 'zap' },
            { id: 'skill_5_title', label: 'Skill 5 Title', type: 'text', preview: 'Redis Caching' },
            { id: 'skill_5_subtitle', label: 'Skill 5 Subtitle', type: 'text', preview: 'Performance optimization expert' },
            { id: 'skill_6_icon', label: 'Skill 6 Icon', type: 'icon', preview: 'code' },
            { id: 'skill_6_title', label: 'Skill 6 Title', type: 'text', preview: 'Frontend Development' },
            { id: 'skill_6_subtitle', label: 'Skill 6 Subtitle', type: 'text', preview: 'React 19, Angular 21, Blazor' }
          ]
        },
        {
          id: 'team',
          name: 'Team Structure Section',
          icon: Users,
          fields: [
            { id: 'team_title', label: 'Section Title', type: 'heading', preview: 'Senior-Led Team Structure' },
            { id: 'team_subtitle', label: 'Section Subtitle', type: 'text', preview: 'Our lean, expert team ensures every project benefits from senior-level oversight and specialized skills' },
            { id: 'team_1_icon', label: 'Team Member 1 Icon', type: 'icon', preview: 'crown' },
            { id: 'team_1_title', label: 'Team Member 1 Title', type: 'text', preview: 'Senior Architect' },
            { id: 'team_1_desc', label: 'Team Member 1 Description', type: 'textarea', preview: 'Leads architecture, codes critical components, ensures technical excellence' },
            { id: 'team_1_badge', label: 'Team Member 1 Badge', type: 'text', preview: 'Technical Leadership' },
            { id: 'team_2_icon', label: 'Team Member 2 Icon', type: 'icon', preview: 'database' },
            { id: 'team_2_title', label: 'Team Member 2 Title', type: 'text', preview: 'Data Solutions Developer' },
            { id: 'team_2_desc', label: 'Team Member 2 Description', type: 'textarea', preview: 'Advanced data analytics, ML.NET integration, Power BI dashboards, data architecture' },
            { id: 'team_2_badge', label: 'Team Member 2 Badge', type: 'text', preview: 'Data & Analytics' },
            { id: 'team_3_icon', label: 'Team Member 3 Icon', type: 'icon', preview: 'palette' },
            { id: 'team_3_title', label: 'Team Member 3 Title', type: 'text', preview: 'UX/UI Developer' },
            { id: 'team_3_desc', label: 'Team Member 3 Description', type: 'textarea', preview: 'Designs user experiences, builds polished interfaces, ensures visual consistency' },
            { id: 'team_3_badge', label: 'Team Member 3 Badge', type: 'text', preview: 'Design & Frontend' },
            { id: 'team_4_icon', label: 'Team Member 4 Icon', type: 'icon', preview: 'settings' },
            { id: 'team_4_title', label: 'Team Member 4 Title', type: 'text', preview: 'DevOps Specialist' },
            { id: 'team_4_desc', label: 'Team Member 4 Description', type: 'textarea', preview: 'Manages deployment, infrastructure, CI/CD pipelines, and monitoring' },
            { id: 'team_4_badge', label: 'Team Member 4 Badge', type: 'text', preview: 'Operations Excellence' }
          ]
        },
        {
          id: 'values',
          name: 'Company Values Section',
          icon: FileText,
          fields: [
            { id: 'values_title', label: 'Section Title', type: 'heading', preview: 'Our Values' },
            { id: 'values_subtitle', label: 'Section Subtitle', type: 'text', preview: 'Principles that guide every project and client relationship' },
            { id: 'value_1_icon', label: 'Value 1 Icon', type: 'icon', preview: 'shield' },
            { id: 'value_1_title', label: 'Value 1 Title', type: 'text', preview: 'Enterprise Security' },
            { id: 'value_1_desc', label: 'Value 1 Description', type: 'text', preview: 'Security-first approach for Fortune 500 standards' },
            { id: 'value_2_icon', label: 'Value 2 Icon', type: 'icon', preview: 'trending-up' },
            { id: 'value_2_title', label: 'Value 2 Title', type: 'text', preview: 'Scalability Focus' },
            { id: 'value_2_desc', label: 'Value 2 Description', type: 'text', preview: 'Built for enterprise growth and performance' },
            { id: 'value_3_icon', label: 'Value 3 Icon', type: 'icon', preview: 'cpu' },
            { id: 'value_3_title', label: 'Value 3 Title', type: 'text', preview: 'AI-Augmented' },
            { id: 'value_3_desc', label: 'Value 3 Description', type: 'text', preview: 'Faster delivery without compromising quality' },
            { id: 'value_4_icon', label: 'Value 4 Icon', type: 'icon', preview: 'users' },
            { id: 'value_4_title', label: 'Value 4 Title', type: 'text', preview: 'Senior-Led Excellence' },
            { id: 'value_4_desc', label: 'Value 4 Description', type: 'text', preview: 'Expert oversight on every project' }
          ]
        },
        {
          id: 'cta',
          name: 'Call to Action Section',
          icon: Phone,
          fields: [
            { id: 'cta_title', label: 'CTA Title', type: 'heading', preview: 'Ready to work with enterprise .NET expertise?' },
            { id: 'cta_description', label: 'CTA Description', type: 'textarea', preview: 'Partner with a Senior .NET Architect who understands Fortune 500 requirements. Get the expertise your enterprise project deserves.' },
            { id: 'cta_button_primary', label: 'Primary Button', type: 'text', preview: 'Start Consultation' },
            { id: 'cta_button_secondary', label: 'Secondary Button', type: 'text', preview: 'Our Services' }
          ]
        }
      ]
    },
    services: {
      title: 'Services Page',
      icon: Briefcase,
      url: '/services',
      sections: [
        {
          id: 'hero',
          name: 'Hero Section',
          icon: Layout,
          fields: [
            { id: 'hero_badge', label: 'Badge Text', type: 'text', preview: 'Enterprise-Grade .NET Solutions' },
            { id: 'hero_title', label: 'Page Title', type: 'heading', preview: '.NET Development' },
            { id: 'hero_title_highlight', label: 'Title Highlight', type: 'text', preview: 'Services' },
            { id: 'hero_subtitle', label: 'Subtitle', type: 'textarea', preview: 'Led by a Senior .NET Architect with Fortune 500 experience. We deliver enterprise-grade applications, APIs, and modernization solutions with AI-accelerated development.' },
            { id: 'hero_cta_primary', label: 'Primary Button', type: 'text', preview: 'Start Your Project' },
            { id: 'hero_cta_secondary', label: 'Secondary Button', type: 'text', preview: 'Our Process' }
          ]
        },
        {
          id: 'service_1',
          name: 'Service 1: Custom .NET Applications',
          icon: Briefcase,
          fields: [
            { id: 'service_1_icon', label: 'Icon', type: 'icon', preview: 'code-2' },
            { id: 'service_1_title', label: 'Title', type: 'text', preview: 'Custom .NET Applications' },
            { id: 'service_1_badge', label: 'Badge', type: 'text', preview: 'Core Service' },
            { id: 'service_1_desc', label: 'Description', type: 'textarea', preview: 'Enterprise-grade ASP.NET Core and MVC solutions built with proven N-tier architecture patterns. Scalable applications designed for Fortune 500 environments with comprehensive security and performance optimization.' },
            { id: 'service_1_feature_1', label: 'Feature 1', type: 'text', preview: 'ASP.NET Core MVC' },
            { id: 'service_1_feature_2', label: 'Feature 2', type: 'text', preview: 'EF Core 10 Integration' },
            { id: 'service_1_feature_3', label: 'Feature 3', type: 'text', preview: 'Windows Server & IIS Deployment' },
            { id: 'service_1_feature_4', label: 'Feature 4', type: 'text', preview: 'React 19 Frontend Integration' }
          ]
        },
        {
          id: 'service_2',
          name: 'Service 2: REST APIs & Microservices',
          icon: Briefcase,
          fields: [
            { id: 'service_2_icon', label: 'Icon', type: 'icon', preview: 'network' },
            { id: 'service_2_title', label: 'Title', type: 'text', preview: 'REST APIs & Microservices' },
            { id: 'service_2_badge', label: 'Badge', type: 'text', preview: 'High Demand' },
            { id: 'service_2_desc', label: 'Description', type: 'textarea', preview: 'Scalable gRPC and RESTful services with advanced caching strategies using Redis. High-performance APIs designed for enterprise integration with comprehensive security and monitoring capabilities.' },
            { id: 'service_2_feature_1', label: 'Feature 1', type: 'text', preview: 'gRPC Services' },
            { id: 'service_2_feature_2', label: 'Feature 2', type: 'text', preview: 'RESTful API Design & Development' },
            { id: 'service_2_feature_3', label: 'Feature 3', type: 'text', preview: 'Redis Caching Implementation' },
            { id: 'service_2_feature_4', label: 'Feature 4', type: 'text', preview: 'API Security & Authentication' }
          ]
        },
        {
          id: 'service_3',
          name: 'Service 3: Legacy Modernization',
          icon: Briefcase,
          fields: [
            { id: 'service_3_icon', label: 'Icon', type: 'icon', preview: 'rocket' },
            { id: 'service_3_title', label: 'Title', type: 'text', preview: 'Legacy Modernization' },
            { id: 'service_3_badge', label: 'Badge', type: 'text', preview: 'Specialty' },
            { id: 'service_3_desc', label: 'Description', type: 'textarea', preview: 'Upgrade .NET Framework 2.0-4.8 applications to modern .NET 10 with EF Core 10 optimization and modern frontend integration. Seamless migration paths that preserve business logic while enhancing performance.' },
            { id: 'service_3_feature_1', label: 'Feature 1', type: 'text', preview: '.NET Framework to .NET 10 Migration' },
            { id: 'service_3_feature_2', label: 'Feature 2', type: 'text', preview: 'Database Modernization' },
            { id: 'service_3_feature_3', label: 'Feature 3', type: 'text', preview: 'Legacy Code Refactoring' },
            { id: 'service_3_feature_4', label: 'Feature 4', type: 'text', preview: 'Performance Optimization' }
          ]
        },
        {
          id: 'service_4',
          name: 'Service 4: Enterprise Architecture',
          icon: Briefcase,
          fields: [
            { id: 'service_4_icon', label: 'Icon', type: 'icon', preview: 'building' },
            { id: 'service_4_title', label: 'Title', type: 'text', preview: 'Enterprise Architecture' },
            { id: 'service_4_badge', label: 'Badge', type: 'text', preview: 'Advanced' },
            { id: 'service_4_desc', label: 'Description', type: 'textarea', preview: 'Comprehensive enterprise architecture design including system integration, scalability planning, and governance frameworks. Solutions built for Fortune 500 scale with future-proof technology stacks.' },
            { id: 'service_4_feature_1', label: 'Feature 1', type: 'text', preview: 'System Architecture Design' },
            { id: 'service_4_feature_2', label: 'Feature 2', type: 'text', preview: 'Integration Patterns & ESB' },
            { id: 'service_4_feature_3', label: 'Feature 3', type: 'text', preview: 'Scalability & Performance Planning' },
            { id: 'service_4_feature_4', label: 'Feature 4', type: 'text', preview: 'Enterprise Security Frameworks' }
          ]
        },
        {
          id: 'service_5',
          name: 'Service 5: UX/UI Design & Frontend',
          icon: Briefcase,
          fields: [
            { id: 'service_5_icon', label: 'Icon', type: 'icon', preview: 'layout' },
            { id: 'service_5_title', label: 'Title', type: 'text', preview: 'UX/UI Design & Frontend' },
            { id: 'service_5_badge', label: 'Badge', type: 'text', preview: 'Modern UI' },
            { id: 'service_5_desc', label: 'Description', type: 'textarea', preview: 'Modern, responsive interfaces built with React 19, Angular 21, and Blazor. We bridge the gap between complex enterprise logic and intuitive user experiences, designing for efficiency and accessibility.' },
            { id: 'service_5_feature_1', label: 'Feature 1', type: 'text', preview: 'React 19, Angular 21, Blazor Development' },
            { id: 'service_5_feature_2', label: 'Feature 2', type: 'text', preview: 'Enterprise Design Systems' },
            { id: 'service_5_feature_3', label: 'Feature 3', type: 'text', preview: 'Figma Prototyping' },
            { id: 'service_5_feature_4', label: 'Feature 4', type: 'text', preview: 'Responsive Enterprise Dashboards' }
          ]
        },
        {
          id: 'service_6',
          name: 'Service 6: Cloud Infrastructure & DevOps',
          icon: Briefcase,
          fields: [
            { id: 'service_6_icon', label: 'Icon', type: 'icon', preview: 'cloud' },
            { id: 'service_6_title', label: 'Title', type: 'text', preview: 'Cloud Infrastructure & DevOps' },
            { id: 'service_6_badge', label: 'Badge', type: 'text', preview: 'Operations' },
            { id: 'service_6_desc', label: 'Description', type: 'textarea', preview: 'Robust CI/CD pipelines and cloud infrastructure management. We ensure your applications are deployed securely with Azure Functions, AWS Lambda, Docker/Kubernetes for high-availability systems.' },
            { id: 'service_6_feature_1', label: 'Feature 1', type: 'text', preview: 'Azure Functions & AWS Lambda' },
            { id: 'service_6_feature_2', label: 'Feature 2', type: 'text', preview: 'Docker & Kubernetes Orchestration' },
            { id: 'service_6_feature_3', label: 'Feature 3', type: 'text', preview: 'Automated CI/CD Pipelines' },
            { id: 'service_6_feature_4', label: 'Feature 4', type: 'text', preview: 'Infrastructure as Code (IaC)' }
          ]
        },
        {
          id: 'service_7',
          name: 'Service 7: Cloud Data Migration',
          icon: Briefcase,
          fields: [
            { id: 'service_7_icon', label: 'Icon', type: 'icon', preview: 'database' },
            { id: 'service_7_title', label: 'Title', type: 'text', preview: 'Cloud Data Migration' },
            { id: 'service_7_badge', label: 'Badge', type: 'text', preview: 'Specialty' },
            { id: 'service_7_desc', label: 'Description', type: 'textarea', preview: 'Seamless migration of on-premises databases and data warehouses to cloud platforms. We ensure zero-downtime transitions with comprehensive data integrity validation.' },
            { id: 'service_7_feature_1', label: 'Feature 1', type: 'text', preview: 'On-Premises to Cloud Migration' },
            { id: 'service_7_feature_2', label: 'Feature 2', type: 'text', preview: 'AWS Database Migration Service (DMS)' },
            { id: 'service_7_feature_3', label: 'Feature 3', type: 'text', preview: 'Azure Data Migration Service' },
            { id: 'service_7_feature_4', label: 'Feature 4', type: 'text', preview: 'Data Lake & Warehouse Migration' }
          ]
        },
        {
          id: 'service_8',
          name: 'Service 8: Cloud Platform Integrations',
          icon: Briefcase,
          fields: [
            { id: 'service_8_icon', label: 'Icon', type: 'icon', preview: 'cloud' },
            { id: 'service_8_title', label: 'Title', type: 'text', preview: 'Cloud Platform Integrations' },
            { id: 'service_8_badge', label: 'Badge', type: 'text', preview: 'Advanced' },
            { id: 'service_8_desc', label: 'Description', type: 'textarea', preview: 'Deep expertise in AWS and Azure cloud services integration. We build scalable, secure cloud-native applications leveraging the full power of enterprise cloud platforms.' },
            { id: 'service_8_feature_1', label: 'Feature 1', type: 'text', preview: 'AWS Services: EC2, S3, RDS, Lambda, EKS' },
            { id: 'service_8_feature_2', label: 'Feature 2', type: 'text', preview: 'Azure Services: App Service, Azure SQL, Functions, AKS' },
            { id: 'service_8_feature_3', label: 'Feature 3', type: 'text', preview: 'Serverless Architecture' },
            { id: 'service_8_feature_4', label: 'Feature 4', type: 'text', preview: 'Multi-Cloud Strategy & Management' }
          ]
        },
        {
          id: 'data_solutions',
          name: 'Advanced Data Solutions Section',
          icon: Database,
          fields: [
            { id: 'data_title', label: 'Section Title', type: 'heading', preview: 'Advanced Data Solutions' },
            { id: 'data_subtitle', label: 'Section Subtitle', type: 'text', preview: '.NET-native data capabilities powered by ML.NET and modern analytics. Transform your enterprise applications with intelligent data processing and insights.' }
          ]
        },
        {
          id: 'data_service_1',
          name: 'Data Service 1: ML.NET Integration',
          icon: Database,
          fields: [
            { id: 'data_1_icon', label: 'Icon', type: 'icon', preview: 'brain' },
            { id: 'data_1_title', label: 'Title', type: 'text', preview: 'ML.NET Integration' },
            { id: 'data_1_badge', label: 'Badge', type: 'text', preview: 'Machine Learning' },
            { id: 'data_1_desc', label: 'Description', type: 'textarea', preview: 'Native .NET machine learning with ML.NET 4.0. Build predictive models, automated insights, and intelligent features directly within your .NET applications.' },
            { id: 'data_1_feature_1', label: 'Feature 1', type: 'text', preview: 'ML.NET 4.0 Predictive Models' },
            { id: 'data_1_feature_2', label: 'Feature 2', type: 'text', preview: 'Automated Machine Learning (AutoML)' },
            { id: 'data_1_feature_3', label: 'Feature 3', type: 'text', preview: 'Deep Learning with TorchSharp' },
            { id: 'data_1_feature_4', label: 'Feature 4', type: 'text', preview: 'Natural Language Processing' }
          ]
        },
        {
          id: 'data_service_2',
          name: 'Data Service 2: Power BI Analytics',
          icon: Database,
          fields: [
            { id: 'data_2_icon', label: 'Icon', type: 'icon', preview: 'bar-chart-3' },
            { id: 'data_2_title', label: 'Title', type: 'text', preview: 'Power BI Analytics' },
            { id: 'data_2_badge', label: 'Badge', type: 'text', preview: 'Business Intelligence' },
            { id: 'data_2_desc', label: 'Description', type: 'textarea', preview: 'Embedded Power BI dashboards and analytics within .NET applications. Real-time business intelligence and interactive reporting for enterprise decision-making.' },
            { id: 'data_2_feature_1', label: 'Feature 1', type: 'text', preview: 'Power BI Embedded Analytics' },
            { id: 'data_2_feature_2', label: 'Feature 2', type: 'text', preview: 'Interactive .NET Dashboards' },
            { id: 'data_2_feature_3', label: 'Feature 3', type: 'text', preview: 'Real-time Data Visualization' },
            { id: 'data_2_feature_4', label: 'Feature 4', type: 'text', preview: 'Custom Report Development' }
          ]
        },
        {
          id: 'tech_stack',
          name: 'Technology Stack Section',
          icon: Briefcase,
          fields: [
            { id: 'tech_title', label: 'Section Title', type: 'heading', preview: 'Technology Expertise' },
            { id: 'tech_subtitle', label: 'Section Subtitle', type: 'text', preview: 'Deep experience across the full .NET ecosystem and enterprise technologies' },
            { id: 'tech_1_name', label: 'Tech 1 Name', type: 'text', preview: '.NET' },
            { id: 'tech_1_detail', label: 'Tech 1 Detail', type: 'text', preview: 'Framework 2.0-4.8, 8/9' },
            { id: 'tech_2_name', label: 'Tech 2 Name', type: 'text', preview: 'ASP.NET' },
            { id: 'tech_2_detail', label: 'Tech 2 Detail', type: 'text', preview: 'Core MVC' },
            { id: 'tech_3_name', label: 'Tech 3 Name', type: 'text', preview: 'EF Core' },
            { id: 'tech_3_detail', label: 'Tech 3 Detail', type: 'text', preview: '8/10' },
            { id: 'tech_4_name', label: 'Tech 4 Name', type: 'text', preview: 'gRPC' },
            { id: 'tech_4_detail', label: 'Tech 4 Detail', type: 'text', preview: 'Modern Services' },
            { id: 'tech_5_name', label: 'Tech 5 Name', type: 'text', preview: 'Redis' },
            { id: 'tech_5_detail', label: 'Tech 5 Detail', type: 'text', preview: 'Caching Layer' },
            { id: 'tech_6_name', label: 'Tech 6 Name', type: 'text', preview: 'Angular' },
            { id: 'tech_6_detail', label: 'Tech 6 Detail', type: 'text', preview: '17/18' },
            { id: 'tech_7_name', label: 'Tech 7 Name', type: 'text', preview: 'ML.NET' },
            { id: 'tech_7_detail', label: 'Tech 7 Detail', type: 'text', preview: '4.0' },
            { id: 'tech_8_name', label: 'Tech 8 Name', type: 'text', preview: 'Power BI' },
            { id: 'tech_8_detail', label: 'Tech 8 Detail', type: 'text', preview: 'Embedded' }
          ]
        },
        {
          id: 'cta',
          name: 'Call to Action Section',
          icon: Phone,
          fields: [
            { id: 'cta_title', label: 'CTA Title', type: 'heading', preview: 'Ready to enhance your .NET applications with data?' },
            { id: 'cta_description', label: 'CTA Description', type: 'textarea', preview: 'Work with a Senior .NET Architect and Data Solutions Developer. Enterprise .NET development enhanced with advanced data analytics and ML.NET capabilities.' },
            { id: 'cta_button_primary', label: 'Primary Button', type: 'text', preview: 'Discuss Your Project' },
            { id: 'cta_button_secondary', label: 'Secondary Button', type: 'text', preview: 'View Our Work' }
          ]
        }
      ]
    },
    portfolio: {
      title: 'Portfolio Page',
      icon: FileText,
      url: '/portfolio',
      sections: [
        {
          id: 'hero',
          name: 'Hero Section',
          icon: Layout,
          fields: [
            { id: 'hero_badge', label: 'Badge Text', type: 'text', preview: 'Fortune 500 Success Stories' },
            { id: 'hero_title', label: 'Page Title', type: 'heading', preview: 'Enterprise' },
            { id: 'hero_title_highlight', label: 'Title Highlight', type: 'text', preview: 'Portfolio' },
            { id: 'hero_subtitle', label: 'Subtitle', type: 'textarea', preview: 'Proven .NET solutions and advanced data analytics delivered for Fortune 500 corporations. Real-world enterprise applications, intelligent APIs, and data-driven modernization projects that drive business value.' },
            { id: 'hero_cta_primary', label: 'Primary Button Text', type: 'text', preview: 'Discuss Your Project' },
            { id: 'hero_cta_secondary', label: 'Secondary Button Text', type: 'text', preview: 'Our Services' }
          ]
        },
        {
          id: 'project_1',
          name: 'Project 1: Financial Services',
          icon: FileText,
          fields: [
            { id: 'project_1_title', label: 'Project Title', type: 'text', preview: 'Enterprise Trading Platform' },
            { id: 'project_1_industry', label: 'Industry', type: 'text', preview: 'Financial Services' },
            { id: 'project_1_icon', label: 'Icon', type: 'icon', preview: 'banknote' },
            { id: 'project_1_color', label: 'Color Theme', type: 'text', preview: 'blue' },
            { id: 'project_1_description', label: 'Description', type: 'textarea', preview: 'High-frequency trading application with real-time data processing. Built with ASP.NET MVC, Entity Framework optimization, and Redis caching for sub-second response times.' },
            { id: 'project_1_stat_1', label: 'Stat 1', type: 'text', preview: '10,000+ concurrent users' },
            { id: 'project_1_stat_2', label: 'Stat 2', type: 'text', preview: 'Sub-second transaction processing' },
            { id: 'project_1_stat_3', label: 'Stat 3', type: 'text', preview: '99.9% uptime achieved' },
            { id: 'project_1_technologies', label: 'Technologies (pipe-separated)', type: 'text', preview: 'ASP.NET MVC|Entity Framework|Redis|SQL Server' }
          ]
        },
        {
          id: 'project_2',
          name: 'Project 2: Healthcare',
          icon: FileText,
          fields: [
            { id: 'project_2_title', label: 'Project Title', type: 'text', preview: 'Patient Management System' },
            { id: 'project_2_industry', label: 'Industry', type: 'text', preview: 'Healthcare' },
            { id: 'project_2_icon', label: 'Icon', type: 'icon', preview: 'heart-pulse' },
            { id: 'project_2_color', label: 'Color Theme', type: 'text', preview: 'cyan' },
            { id: 'project_2_description', label: 'Description', type: 'textarea', preview: 'Modernized .NET 2.0 healthcare system to .NET 10 with Angular frontend. HIPAA-compliant architecture with enhanced security and mobile responsiveness.' },
            { id: 'project_2_stat_1', label: 'Stat 1', type: 'text', preview: '500,000+ patient records' },
            { id: 'project_2_stat_2', label: 'Stat 2', type: 'text', preview: 'HIPAA compliance achieved' },
            { id: 'project_2_stat_3', label: 'Stat 3', type: 'text', preview: '60% performance improvement' },
            { id: 'project_2_technologies', label: 'Technologies (pipe-separated)', type: 'text', preview: '.NET 10|Angular|WCF Services|SQL Server' }
          ]
        },
        {
          id: 'project_3',
          name: 'Project 3: Retail',
          icon: FileText,
          fields: [
            { id: 'project_3_title', label: 'Project Title', type: 'text', preview: 'E-commerce API Platform' },
            { id: 'project_3_industry', label: 'Industry', type: 'text', preview: 'Retail' },
            { id: 'project_3_icon', label: 'Icon', type: 'icon', preview: 'shopping-cart' },
            { id: 'project_3_color', label: 'Color Theme', type: 'text', preview: 'indigo' },
            { id: 'project_3_description', label: 'Description', type: 'textarea', preview: 'High-volume REST API platform handling millions of daily transactions. Microservices architecture with Redis caching and comprehensive API documentation.' },
            { id: 'project_3_stat_1', label: 'Stat 1', type: 'text', preview: '1M+ daily transactions' },
            { id: 'project_3_stat_2', label: 'Stat 2', type: 'text', preview: 'API response < 100ms' },
            { id: 'project_3_stat_3', label: 'Stat 3', type: 'text', preview: 'Auto-scaling enabled' },
            { id: 'project_3_technologies', label: 'Technologies (pipe-separated)', type: 'text', preview: 'ASP.NET Core|Redis|Docker|Azure' }
          ]
        },
        {
          id: 'metrics',
          name: 'Success Metrics Section',
          icon: Briefcase,
          fields: [
            { id: 'metrics_title', label: 'Section Title', type: 'heading', preview: 'Enterprise Impact' },
            { id: 'metrics_subtitle', label: 'Section Subtitle', type: 'text', preview: 'Measurable results delivered to Fortune 500 clients' },
            { id: 'metric_1_value', label: 'Metric 1 Value', type: 'text', preview: '500+' },
            { id: 'metric_1_label', label: 'Metric 1 Label', type: 'text', preview: 'Fortune 500 Projects' },
            { id: 'metric_1_sublabel', label: 'Metric 1 Sub-label', type: 'text', preview: 'Across multiple industries' },
            { id: 'metric_2_value', label: 'Metric 2 Value', type: 'text', preview: '99.9%' },
            { id: 'metric_2_label', label: 'Metric 2 Label', type: 'text', preview: 'System Uptime' },
            { id: 'metric_2_sublabel', label: 'Metric 2 Sub-label', type: 'text', preview: 'Enterprise reliability' },
            { id: 'metric_3_value', label: 'Metric 3 Value', type: 'text', preview: '60%' },
            { id: 'metric_3_label', label: 'Metric 3 Label', type: 'text', preview: 'Performance Gain' },
            { id: 'metric_3_sublabel', label: 'Metric 3 Sub-label', type: 'text', preview: 'Average improvement' },
            { id: 'metric_4_value', label: 'Metric 4 Value', type: 'text', preview: '15+' },
            { id: 'metric_4_label', label: 'Metric 4 Label', type: 'text', preview: 'Years Experience' },
            { id: 'metric_4_sublabel', label: 'Metric 4 Sub-label', type: 'text', preview: 'Enterprise .NET expertise' }
          ]
        },
        {
          id: 'cta',
          name: 'Call to Action Section',
          icon: Phone,
          fields: [
            { id: 'cta_title', label: 'CTA Title', type: 'heading', preview: 'Ready to add your success story?' },
            { id: 'cta_description', label: 'CTA Description', type: 'textarea', preview: 'Join the Fortune 500 companies that trust our Senior .NET Architect for their most critical enterprise projects.' },
            { id: 'cta_button_primary', label: 'Primary Button', type: 'text', preview: 'Start Your Project' },
            { id: 'cta_button_secondary', label: 'Secondary Button', type: 'text', preview: 'Meet the Team' }
          ]
        }
      ]
    },
    contact: {
      title: 'Contact Page',
      icon: Phone,
      url: '/contact',
      sections: [
        {
          id: 'hero',
          name: 'Hero Section',
          icon: Layout,
          fields: [
            { id: 'hero_badge', label: 'Badge Text', type: 'text', preview: 'Start Your Project' },
            { id: 'hero_title', label: 'Page Title', type: 'heading', preview: "Let's Build" },
            { id: 'hero_title_highlight', label: 'Title Highlight', type: 'text', preview: 'Together' },
            { id: 'hero_subtitle', label: 'Subtitle', type: 'textarea', preview: 'Schedule a consultation with our Senior .NET Architect and Data Solutions Developer. Discuss your enterprise requirements and discover how AI-augmented development and advanced data analytics can accelerate your project.' },
            { id: 'hero_cta_primary', label: 'Primary Button', type: 'text', preview: 'Schedule Consultation' },
            { id: 'hero_cta_secondary', label: 'Secondary Button', type: 'text', preview: 'Call Now' }
          ]
        },
        {
          id: 'contact_form',
          name: 'Contact Form',
          icon: FileText,
          fields: [
            { id: 'form_title', label: 'Form Title', type: 'text', preview: 'Schedule Your Consultation' },
            { id: 'form_firstname_label', label: 'First Name Label', type: 'text', preview: 'First Name *' },
            { id: 'form_lastname_label', label: 'Last Name Label', type: 'text', preview: 'Last Name *' },
            { id: 'form_email_label', label: 'Email Label', type: 'text', preview: 'Business Email *' },
            { id: 'form_phone_label', label: 'Phone Label', type: 'text', preview: 'Phone Number' },
            { id: 'form_company_label', label: 'Company Label', type: 'text', preview: 'Company *' },
            { id: 'form_project_label', label: 'Project Type Label', type: 'text', preview: 'Project Type *' },
            { id: 'form_timeline_label', label: 'Timeline Label', type: 'text', preview: 'Project Timeline' },
            { id: 'form_message_label', label: 'Message Label', type: 'text', preview: 'Project Details *' },
            { id: 'form_submit_button', label: 'Submit Button', type: 'text', preview: 'Schedule Consultation' }
          ]
        },
        {
          id: 'contact_info',
          name: 'Contact Information',
          icon: Phone,
          fields: [
            { id: 'info_title', label: 'Section Title', type: 'text', preview: 'Get in Touch' },
            { id: 'contact_phone_icon', label: 'Phone Icon', type: 'icon', preview: 'phone' },
            { id: 'contact_phone_label', label: 'Phone Label', type: 'text', preview: 'Phone' },
            { id: 'contact_phone', label: 'Phone Number', type: 'text', preview: '+1 (929) 630-5021' },
            { id: 'contact_email_icon', label: 'Email Icon', type: 'icon', preview: 'mail' },
            { id: 'contact_email_label', label: 'Email Label', type: 'text', preview: 'Email' },
            { id: 'contact_email', label: 'Email Address', type: 'text', preview: 'contact@newmediatek.net' },
            { id: 'contact_linkedin_icon', label: 'LinkedIn Icon', type: 'icon', preview: 'linkedin' },
            { id: 'contact_linkedin_label', label: 'LinkedIn Label', type: 'text', preview: 'LinkedIn' },
            { id: 'contact_linkedin_text', label: 'LinkedIn Text', type: 'text', preview: 'Connect with us' },
            { id: 'contact_twitter_icon', label: 'Twitter Icon', type: 'icon', preview: 'twitter' },
            { id: 'contact_twitter_label', label: 'Twitter Label', type: 'text', preview: 'X' },
            { id: 'contact_twitter_text', label: 'Twitter Text', type: 'text', preview: 'Follow us' }
          ]
        },
        {
          id: 'consultation_process',
          name: 'Consultation Process',
          icon: Briefcase,
          fields: [
            { id: 'process_title', label: 'Section Title', type: 'text', preview: 'Consultation Process' },
            { id: 'process_step_1_title', label: 'Step 1 Title', type: 'text', preview: 'Initial Consultation' },
            { id: 'process_step_1_desc', label: 'Step 1 Description', type: 'text', preview: '30-minute discovery call' },
            { id: 'process_step_2_title', label: 'Step 2 Title', type: 'text', preview: 'Technical Assessment' },
            { id: 'process_step_2_desc', label: 'Step 2 Description', type: 'text', preview: 'Architecture & requirements analysis' },
            { id: 'process_step_3_title', label: 'Step 3 Title', type: 'text', preview: 'Proposal & Timeline' },
            { id: 'process_step_3_desc', label: 'Step 3 Description', type: 'text', preview: 'Detailed project plan & pricing' }
          ]
        },
        {
          id: 'response_times',
          name: 'Response Times',
          icon: Briefcase,
          fields: [
            { id: 'response_title', label: 'Section Title', type: 'text', preview: 'Response Times' },
            { id: 'response_1_label', label: 'Response 1 Label', type: 'text', preview: 'Consultation Requests' },
            { id: 'response_1_time', label: 'Response 1 Time', type: 'text', preview: 'Within 24 hours' },
            { id: 'response_2_label', label: 'Response 2 Label', type: 'text', preview: 'Project Inquiries' },
            { id: 'response_2_time', label: 'Response 2 Time', type: 'text', preview: 'Within 48 hours' },
            { id: 'response_3_label', label: 'Response 3 Label', type: 'text', preview: 'Urgent Matters' },
            { id: 'response_3_time', label: 'Response 3 Time', type: 'text', preview: 'Same day' }
          ]
        }
      ]
    },
    process: {
      title: 'Process Page',
      icon: Briefcase,
      url: '/process',
      sections: [
        {
          id: 'hero',
          name: 'Hero Section',
          icon: Layout,
          fields: [
            { id: 'hero_badge', label: 'Badge Text', type: 'text', preview: 'AI-Augmented Development' },
            { id: 'hero_title', label: 'Page Title', type: 'heading', preview: 'Development' },
            { id: 'hero_title_highlight', label: 'Title Highlight', type: 'text', preview: 'Process' },
            { id: 'hero_subtitle', label: 'Subtitle', type: 'textarea', preview: 'Senior-led .NET development and data solutions accelerated by AI. Enterprise-grade methodology combining 15+ years of Fortune 500 experience with ML.NET analytics and cutting-edge AI tools for faster, smarter delivery.' },
            { id: 'hero_cta_primary', label: 'Primary Button', type: 'text', preview: 'Start Your Project' },
            { id: 'hero_cta_secondary', label: 'Secondary Button', type: 'text', preview: 'Our Services' }
          ]
        },
        {
          id: 'ai_methodology',
          name: 'AI-Augmented Methodology',
          icon: Briefcase,
          fields: [
            { id: 'ai_icon', label: 'Section Icon', type: 'icon', preview: 'cpu' },
            { id: 'ai_title', label: 'Section Title', type: 'text', preview: 'AI-Augmented Methodology' },
            { id: 'ai_subtitle', label: 'Section Subtitle', type: 'text', preview: 'Enterprise expertise + AI acceleration' },
            { id: 'ai_section_1_title', label: 'Section 1 Title', type: 'text', preview: 'Senior Architect Oversight' },
            { id: 'ai_section_1_desc', label: 'Section 1 Description', type: 'textarea', preview: 'Every project benefits from 15+ years of Fortune 500 experience. AI tools accelerate development while senior expertise ensures quality, security, and architectural excellence.' },
            { id: 'ai_section_2_title', label: 'Section 2 Title', type: 'text', preview: 'AI-Enhanced Development' },
            { id: 'ai_section_2_desc', label: 'Section 2 Description', type: 'textarea', preview: 'AI-assisted code generation, automated testing, and intelligent debugging accelerate routine tasks while maintaining enterprise standards and security protocols.' },
            { id: 'ai_stat_1_value', label: 'Stat 1 Value', type: 'text', preview: '40%' },
            { id: 'ai_stat_1_label', label: 'Stat 1 Label', type: 'text', preview: 'Faster Delivery' },
            { id: 'ai_stat_2_value', label: 'Stat 2 Value', type: 'text', preview: '100%' },
            { id: 'ai_stat_2_label', label: 'Stat 2 Label', type: 'text', preview: 'Quality Assurance' }
          ]
        },
        {
          id: 'ai_capabilities',
          name: 'AI Capabilities List',
          icon: Briefcase,
          fields: [
            { id: 'cap_1_icon', label: 'Capability 1 Icon', type: 'icon', preview: 'brain' },
            { id: 'cap_1_title', label: 'Capability 1 Title', type: 'text', preview: 'AI Code Generation' },
            { id: 'cap_1_desc', label: 'Capability 1 Description', type: 'text', preview: 'Accelerated boilerplate & patterns' },
            { id: 'cap_2_icon', label: 'Capability 2 Icon', type: 'icon', preview: 'shield-check' },
            { id: 'cap_2_title', label: 'Capability 2 Title', type: 'text', preview: 'Automated Testing' },
            { id: 'cap_2_desc', label: 'Capability 2 Description', type: 'text', preview: 'AI-enhanced test coverage' },
            { id: 'cap_3_icon', label: 'Capability 3 Icon', type: 'icon', preview: 'bug' },
            { id: 'cap_3_title', label: 'Capability 3 Title', type: 'text', preview: 'Intelligent Debugging' },
            { id: 'cap_3_desc', label: 'Capability 3 Description', type: 'text', preview: 'Pattern recognition & fixes' },
            { id: 'cap_4_icon', label: 'Capability 4 Icon', type: 'icon', preview: 'file-check' },
            { id: 'cap_4_title', label: 'Capability 4 Title', type: 'text', preview: 'Code Review Assistant' },
            { id: 'cap_4_desc', label: 'Capability 4 Description', type: 'text', preview: 'Automated quality checks' },
            { id: 'cap_5_icon', label: 'Capability 5 Icon', type: 'icon', preview: 'zap' },
            { id: 'cap_5_title', label: 'Capability 5 Title', type: 'text', preview: 'Performance Optimization' },
            { id: 'cap_5_desc', label: 'Capability 5 Description', type: 'text', preview: 'AI-driven improvements' },
            { id: 'cap_6_icon', label: 'Capability 6 Icon', type: 'icon', preview: 'lock' },
            { id: 'cap_6_title', label: 'Capability 6 Title', type: 'text', preview: 'Security Analysis' },
            { id: 'cap_6_desc', label: 'Capability 6 Description', type: 'text', preview: 'Automated vulnerability detection' }
          ]
        },
        {
          id: 'lifecycle',
          name: 'Development Lifecycle',
          icon: Briefcase,
          fields: [
            { id: 'lifecycle_title', label: 'Section Title', type: 'heading', preview: 'Development Lifecycle' },
            { id: 'lifecycle_subtitle', label: 'Section Subtitle', type: 'text', preview: 'Structured approach ensuring quality, security, and timely delivery' },
            { id: 'phase_1_icon', label: 'Phase 1 Icon', type: 'icon', preview: 'search' },
            { id: 'phase_1_title', label: 'Phase 1 Title', type: 'text', preview: '1. Discovery' },
            { id: 'phase_1_desc', label: 'Phase 1 Description', type: 'text', preview: 'Requirements analysis, technical architecture, AI-assisted planning' },
            { id: 'phase_1_timeline', label: 'Phase 1 Timeline', type: 'text', preview: 'Week 1' },
            { id: 'phase_2_icon', label: 'Phase 2 Icon', type: 'icon', preview: 'pen-tool' },
            { id: 'phase_2_title', label: 'Phase 2 Title', type: 'text', preview: '2. Design' },
            { id: 'phase_2_desc', label: 'Phase 2 Description', type: 'text', preview: 'System architecture, database design, AI-enhanced prototyping' },
            { id: 'phase_2_timeline', label: 'Phase 2 Timeline', type: 'text', preview: 'Week 2' },
            { id: 'phase_3_icon', label: 'Phase 3 Icon', type: 'icon', preview: 'code' },
            { id: 'phase_3_title', label: 'Phase 3 Title', type: 'text', preview: '3. Development' },
            { id: 'phase_3_desc', label: 'Phase 3 Description', type: 'text', preview: 'AI-accelerated coding, senior oversight, continuous integration' },
            { id: 'phase_3_timeline', label: 'Phase 3 Timeline', type: 'text', preview: 'Weeks 3-8' },
            { id: 'phase_4_icon', label: 'Phase 4 Icon', type: 'icon', preview: 'rocket' },
            { id: 'phase_4_title', label: 'Phase 4 Title', type: 'text', preview: '4. Deployment' },
            { id: 'phase_4_desc', label: 'Phase 4 Description', type: 'text', preview: 'Enterprise deployment, monitoring, AI-driven optimization' },
            { id: 'phase_4_timeline', label: 'Phase 4 Timeline', type: 'text', preview: 'Week 9' }
          ]
        },
        {
          id: 'qa',
          name: 'Quality Assurance Section',
          icon: Briefcase,
          fields: [
            { id: 'qa_title', label: 'Section Title', type: 'heading', preview: 'Quality Assurance' },
            { id: 'qa_subtitle', label: 'Section Subtitle', type: 'text', preview: 'Enterprise-grade testing and security protocols' },
            { id: 'qa_1_icon', label: 'QA 1 Icon', type: 'icon', preview: 'check-circle' },
            { id: 'qa_1_title', label: 'QA 1 Title', type: 'text', preview: 'Automated Testing' },
            { id: 'qa_1_desc', label: 'QA 1 Description', type: 'text', preview: 'AI-enhanced unit tests, integration tests, and continuous testing pipelines' },
            { id: 'qa_2_icon', label: 'QA 2 Icon', type: 'icon', preview: 'shield' },
            { id: 'qa_2_title', label: 'QA 2 Title', type: 'text', preview: 'Security Testing' },
            { id: 'qa_2_desc', label: 'QA 2 Description', type: 'text', preview: 'AI-powered vulnerability scanning, penetration testing, compliance checks' },
            { id: 'qa_3_icon', label: 'QA 3 Icon', type: 'icon', preview: 'trending-up' },
            { id: 'qa_3_title', label: 'QA 3 Title', type: 'text', preview: 'Performance Testing' },
            { id: 'qa_3_desc', label: 'QA 3 Description', type: 'text', preview: 'Load testing, AI-driven optimization, scalability validation' }
          ]
        },
        {
          id: 'cta',
          name: 'Call to Action Section',
          icon: Phone,
          fields: [
            { id: 'cta_title', label: 'CTA Title', type: 'heading', preview: 'Experience AI-Augmented Development' },
            { id: 'cta_description', label: 'CTA Description', type: 'textarea', preview: 'Get enterprise .NET solutions delivered faster with AI acceleration while maintaining the quality and security your business requires.' },
            { id: 'cta_button_primary', label: 'Primary Button', type: 'text', preview: 'Start Your Project' },
            { id: 'cta_button_secondary', label: 'Secondary Button', type: 'text', preview: 'View Results' }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    loadContent();
  }, [activeSection]);

  const loadContent = async () => {
    if (!supabase) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visual_content')
        .select('*')
        .eq('page', activeSection)
        .single();

      if (data) {
        setContent(data.content || {});
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('visual_content')
        .upsert({
          page: activeSection,
          content: content,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };

  // Save and publish - saves content then triggers Netlify rebuild
  const saveAndPublish = async () => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('visual_content')
        .upsert({
          page: activeSection,
          content: content,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Trigger Netlify rebuild via the server-side cms-publish function (the
      // build hook URL is a server-only env var, never exposed to the client).
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/.netlify/functions/cms-publish', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        alert('✅ Content saved and site rebuild triggered!\n\nChanges will be live in ~1-2 minutes.');
      } else {
        alert('Content saved but rebuild failed. Try again or deploy manually from Netlify.');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };

  const updateField = (fieldId, value) => {
    setContent(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Add new page functionality
  const addNewPage = async (pageData) => {
    if (!supabase) return;

    try {
      // Add to visual_content table
      const { error } = await supabase
        .from('visual_content')
        .insert({
          page: pageData.pageId,
          content: pageData.content || {},
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Add to custom pages state
      setCustomPages(prev => [...prev, {
        id: pageData.pageId,
        title: pageData.title,
        url: `/${pageData.pageId}`,
        icon: Globe,
        sections: pageData.sections || [
          {
            id: 'content',
            name: 'Page Content',
            icon: FileText,
            fields: [
              { id: 'title', label: 'Page Title', type: 'heading', preview: pageData.title },
              { id: 'content', label: 'Page Content', type: 'textarea', preview: 'Your page content goes here...' }
            ]
          }
        ]
      }]);

      setShowAddPage(false);
      setActiveSection(pageData.pageId);
      alert('New page added successfully!');
    } catch (error) {
      console.error('Error adding new page:', error);
      alert('Error adding new page');
    }
  };

  // Get all pages (default + custom)
  const getAllPages = () => {
    return {
      ...pageStructure,
      ...Object.fromEntries(customPages.map(page => [page.id, page]))
    };
  };

  // Project management functions
  const loadProjects = () => {
    const savedProjects = content.projects || [
      { id: 1, title: 'Enterprise Trading Platform', description: 'High-frequency trading application with real-time data processing...' },
      { id: 2, title: 'Patient Management System', description: 'Modernized .NET 2.0 healthcare system to .NET 10 with Angular frontend...' }
    ];
    setProjects(savedProjects);
  };

  const addProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      title: projectData.title,
      description: projectData.description,
      industry: projectData.industry,
      technologies: projectData.technologies
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    updateField('projects', updatedProjects);
    setShowAddProject(false);
  };

  const removeProject = (projectId) => {
    if (!confirm('Are you sure you want to remove this project?')) return;
    
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    updateField('projects', updatedProjects);
  };

  const updateProject = (projectId, field, value) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, [field]: value } : p
    );
    setProjects(updatedProjects);
    updateField('projects', updatedProjects);
  };

  // Load projects when portfolio section is active
  useEffect(() => {
    if (activeSection === 'portfolio') {
      loadProjects();
    }
  }, [activeSection, content]);

  // Handle panel resize
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 600) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Handle cursor position tracking
  const handleCursorChange = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const renderField = (field, sectionId) => {
    const value = content[field.id] || field.preview;
    const isEditing = editingField === `${sectionId}-${field.id}`;

    // Special handling for dynamic projects section
    if (sectionId === 'projects' && getAllPages()[activeSection]?.sections?.find(s => s.id === 'projects')?.dynamicProjects) {
      return renderDynamicProjects();
    }

    if (isEditing) {
      return (
        <div className="space-y-2">
          {field.type === 'icon' ? (
            <div className="space-y-3">
              {/* Icon Preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  {(() => {
                    const iconData = COMMON_ICONS.find(i => i.name === value);
                    if (iconData) {
                      const IconComponent = iconData.Icon;
                      return <IconComponent className="w-6 h-6 text-blue-600" />;
                    }
                    return <Code className="w-6 h-6 text-gray-400" />;
                  })()}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Current Icon</div>
                  <div className="text-xs text-gray-500">{value || 'None selected'}</div>
                </div>
              </div>
              
              {/* Dropdown Picker */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Choose from common icons:</label>
                <select
                  value={value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">-- Select an icon --</option>
                  {COMMON_ICONS.map(icon => (
                    <option key={icon.name} value={icon.name}>
                      {icon.label} ({icon.name})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Custom Text Input */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Or enter custom Lucide icon name:</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., banknote, heart-pulse, shopping-cart"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Browse all icons at <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">lucide.dev/icons</a>
                </p>
              </div>
            </div>
          ) : field.type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => {
                updateField(field.id, e.target.value);
                handleCursorChange(e);
              }}
              onSelect={handleCursorChange}
              onClick={handleCursorChange}
              onKeyUp={handleCursorChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={Math.max(4, value.split('\n').length)}
              placeholder={field.preview}
              style={{minHeight: '120px'}}
            />
          ) : (
            <input
              type={field.type}
              value={value}
              onChange={(e) => {
                updateField(field.id, e.target.value);
                handleCursorChange(e);
              }}
              onSelect={handleCursorChange}
              onClick={handleCursorChange}
              onKeyUp={handleCursorChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.preview}
              style={{minHeight: '44px'}}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setEditingField(null)}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    const fieldKey = `${sectionId}-${field.id}`;
    const isHighlighted = highlightedField === fieldKey;

    return (
      <div 
        ref={el => fieldRefs.current[fieldKey] = el}
        className={`group cursor-pointer p-3 border rounded-lg transition-all duration-300 ${
          isHighlighted 
            ? 'border-blue-500 bg-blue-100 shadow-lg' 
            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
        }`}
        onClick={() => setEditingField(fieldKey)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">{field.label}</div>
            <div className="font-semibold text-gray-800">{value}</div>
          </div>
          <Edit3 className={`w-4 h-4 ${isHighlighted ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
        </div>
      </div>
    );
  };

  const renderDynamicProjects = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Portfolio Projects</h4>
            <p className="text-sm text-gray-600">Manage your featured projects</p>
          </div>
          <button
            onClick={() => setShowAddProject(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No projects yet</p>
            <button
              onClick={() => setShowAddProject(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={project.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Project {index + 1}
                      </span>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Project title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Project description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                          <input
                            type="text"
                            value={project.industry || ''}
                            onChange={(e) => updateProject(project.id, 'industry', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Financial, Healthcare"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                          <input
                            type="text"
                            value={project.technologies || ''}
                            onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., .NET, React, Azure"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddProject && (
          <AddProjectForm 
            onSubmit={addProject}
            onCancel={() => setShowAddProject(false)}
          />
        )}
      </div>
    );
  };

  const renderLivePreview = () => {
    const currentPage = getAllPages()[activeSection];
    
    return (
      <div className="bg-white border-2 border-green-200 rounded-lg p-6 sticky top-6" style={{width: `${panelWidth}px`}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Preview
          </h3>
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showLivePreview ? 'Hide' : 'Show'}
          </button>
        </div>
        
        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-medium text-gray-900 mb-2">
            {currentPage?.title || 'Page'} Preview
          </h4>
          <div className="text-sm text-gray-600 mb-4">
            {currentPage?.url || '/page'}
          </div>
          
          {/* Live content preview - INLINE EDITABLE */}
          <div className="space-y-3">
            {currentPage?.sections?.map(section => (
              <div key={section.id} className="border-b border-gray-100 pb-3">
                <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-green-600" />
                  {section.name}
                </h5>
                <div className="space-y-2 text-sm">
                  {section.fields.map(field => {
                    const value = content[field.id] || field.preview;
                    const fieldKey = `${section.id}-${field.id}`;
                    const isCurrentlyEditing = editingField === fieldKey;
                    const isHighlighted = highlightedField === fieldKey;
                    
                    // Icon fields use dropdown, not inline edit
                    if (field.type === 'icon') {
                      return (
                        <div 
                          key={field.id}
                          className={`group cursor-pointer rounded-lg p-2 -mx-2 transition-all duration-200 ${
                            isCurrentlyEditing || isHighlighted
                              ? 'bg-blue-100 border border-blue-300'
                              : 'hover:bg-gray-100 border border-transparent'
                          }`}
                          onClick={() => handlePreviewClick(section.id, field.id)}
                          title="Click to edit icon"
                        >
                          <div className="text-xs text-gray-500 mb-1">{field.label}:</div>
                          <div className="text-blue-600 font-mono text-xs bg-blue-50 px-2 py-1 rounded inline-block">
                            {value}
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div 
                        key={field.id} 
                        className={`group rounded-lg p-2 -mx-2 transition-all duration-200 ${
                          isCurrentlyEditing 
                            ? 'bg-green-100 border-2 border-green-400 shadow-sm' 
                            : isHighlighted
                              ? 'bg-blue-100 border border-blue-300'
                              : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          {field.label}:
                          {isCurrentlyEditing && (
                            <span className="text-green-600 font-medium ml-1">● Editing</span>
                          )}
                        </div>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={value}
                            onChange={(e) => updateField(field.id, e.target.value)}
                            onFocus={() => {
                              setEditingField(fieldKey);
                              setHighlightedField(fieldKey);
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                setEditingField(null);
                                setHighlightedField(null);
                              }, 100);
                            }}
                            className={`w-full bg-transparent border-0 p-0 focus:ring-0 focus:outline-none resize-none ${
                              field.type === 'heading' ? 'font-bold text-lg text-gray-900' : 'text-gray-700'
                            }`}
                            rows={Math.max(2, value.split('\n').length)}
                            placeholder={field.preview}
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateField(field.id, e.target.value)}
                            onFocus={() => {
                              setEditingField(fieldKey);
                              setHighlightedField(fieldKey);
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                setEditingField(null);
                                setHighlightedField(null);
                              }, 100);
                            }}
                            className={`w-full bg-transparent border-0 p-0 focus:ring-0 focus:outline-none ${
                              field.type === 'heading' ? 'font-bold text-lg text-gray-900' : 'text-gray-800 font-medium'
                            }`}
                            placeholder={field.preview}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Updates in real-time as you type
            </div>
            <div className="text-gray-400">
              {panelWidth}px wide
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    const currentPage = getAllPages()[activeSection];
    
    return (
      <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Page Preview</h3>
          <div className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {currentPage?.url || '/page'}
          </div>
        </div>
        
        <div className="space-y-6">
          {currentPage?.sections?.map(section => (
            <div key={section.id} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <section.icon className="w-4 h-4" />
                {section.name}
              </h4>
              <div className="space-y-2">
                {section.fields.map(field => {
                  const value = content[field.id] || field.preview;
                  return (
                    <div key={field.id} className="text-sm">
                      <div className="text-gray-500">{field.label}:</div>
                      <div className="font-medium text-gray-900">{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading Visual CMS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          {/* Top row: Logo and main actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Visual CMS</h1>
            </div>
            <button
              onClick={async () => {
                if (supabase) await supabase.auth.signOut();
                window.location.reload();
              }}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          {/* Bottom row: All other buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={saveContent}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={saveAndPublish}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Publish
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                previewMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                showLivePreview 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Toggle live preview panel"
            >
              <div className="w-2 h-2 bg-current rounded-full"></div>
              Live Preview
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-500">Website Pages</h2>
              <button
                onClick={() => setShowAddPage(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Add New Page"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {Object.entries(getAllPages()).map(([key, page]) => {
                const Icon = page.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === key
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{page.title}</div>
                      <div className="text-xs text-gray-500">{page.url}</div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          <main className="flex-1 p-6">
            {previewMode ? (
              renderPreview()
            ) : (
              <div className="space-y-6">
                {/* Page Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {getAllPages()[activeSection]?.title || 'Page'}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Edit content that appears on {getAllPages()[activeSection]?.url || '/page'}
                      </p>
                    </div>
                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {getAllPages()[activeSection]?.sections?.length || 0} sections
                    </div>
                  </div>
                </div>

                {/* Sections */}
                {getAllPages()[activeSection]?.sections?.map(section => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <section.icon className="w-5 h-5 text-blue-600" />
                      {section.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Click any field below to edit its content
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    {section.fields.map(field => (
                      <div key={field.id}>
                        {renderField(field, section.id)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        
        {/* Resizable Divider */}
        {!previewMode && showLivePreview && (
          <div 
            className="w-1 bg-gray-200 hover:bg-blue-300 cursor-col-resize transition-colors relative"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-400 rounded-full w-2 h-8 opacity-50 hover:opacity-100 transition-opacity"></div>
            {isResizing && (
              <div className="absolute inset-0 bg-blue-400 opacity-50"></div>
            )}
          </div>
        )}
        
        {/* Live Preview Panel */}
        {!previewMode && showLivePreview && (
          <aside className="bg-gray-50" style={{width: `${panelWidth}px`, minWidth: '300px', maxWidth: '600px'}}>
            <div className="p-6 h-full overflow-y-auto">
              {renderLivePreview()}
            </div>
          </aside>
        )}
      </div>

      {/* Add New Page Modal */}
      {showAddPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Page</h3>
              <button
                onClick={() => setShowAddPage(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <AddNewPageForm 
              onSubmit={addNewPage}
              onCancel={() => setShowAddPage(false)}
            />
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default VISUAL_CMS_Dashboard;
