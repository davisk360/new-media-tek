# New Media Tek

**Enterprise .NET Development, AI-Accelerated**

Senior .NET Architect-led B2B software development company with 15+ years Fortune 500 experience.

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.16.6
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4.1.18
- **Icons**: [Lucide](https://lucide.dev/) 
- **Package Manager**: [Bun](https://bun.sh/)
- **Language**: TypeScript

## 🛠️ Development

### Prerequisites
- [Bun](https://bun.sh/docs/installation) installed locally
- Node.js 18+ (for compatibility)

### Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint

# Type checking
bun run check
```

### Development Server
- URL: `http://localhost:9195`
- Hot reload enabled
- Astro dev server with HMR

## 📁 Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── Header.astro     # Site navigation
│   └── Footer.astro     # Site footer
├── layouts/             # Page layout templates
│   └── BaseLayout.astro # Main layout with header/footer
├── pages/               # File-based routing
│   ├── index.astro     # Homepage
│   ├── about.astro     # About/team page
│   ├── services.astro   # Services page
│   ├── portfolio.astro  # Portfolio/case studies
│   ├── process.astro    # Development process
│   ├── contact.astro   # Contact page
│   ├── privacy.astro    # Privacy policy
│   └── terms.astro     # Terms of service
└── styles/
    └── global.css       # Global styles and animations
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) and Cyan (#22d3ee)
- **Neutral**: Slate palette
- **Background**: Dark theme (#030712, #02050e)

### Typography
- **Sans-serif**: Inter (with system-ui fallback)
- **Monospace**: JetBrains Mono (with Consolas fallback)

### Components
- **Header**: Fixed navigation with blur backdrop
- **Footer**: 4-column layout with links and copyright
- **Cards**: Glass morphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover states

## 🌐 Pages

- **Home** (`/`) - Hero and service overview
- **Services** (`/services`) - .NET development services
- **About** (`/about`) - Team and company info
- **Portfolio** (`/portfolio`) - Case studies and projects
- **Process** (`/process`) - Development methodology
- **Contact** (`/contact`) - Contact form and consultation
- **Privacy** (`/privacy`) - Privacy policy
- **Terms** (`/terms`) - Terms of service

## 📱 Responsive Design

- **Mobile**: < 768px (md breakpoint)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## ⚡ Performance

- **Font preconnect** for faster loading
- **Optimized images** with proper sizing
- **Lazy loading** for non-critical resources
- **Minimal JavaScript** - mostly CSS animations
- **Component-based** architecture for better caching

## 🔧 Configuration

- **Astro Config**: `astro.config.mjs`
- **Tailwind Config**: `tailwind.config.mjs`
- **TypeScript Config**: `tsconfig.json`
- **Package Config**: `package.json`

## 📄 License

© 2026 New Media Tek. All rights reserved.

## 🤝 Contributing

This is a commercial project. For development inquiries, please contact us through the website.

---

**Built with ❤️ using Astro and Tailwind CSS**
