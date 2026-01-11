# Testimonial Card Component

A modern, accessible, and reusable React testimonial card component built with TypeScript, Tailwind CSS, and CSS Modules.

## 🚀 Features

- **Reusable Component**: Fully typed TestimonialCard component that can be easily integrated into any React application
- **TypeScript Support**: Complete type safety with TypeScript and exported prop interfaces
- **Accessibility**: Built with ARIA attributes and semantic HTML for screen readers and keyboard navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities
- **Modern Stack**: Built with React 19, Vite, and Tailwind CSS
- **CSS Modules**: Component-scoped styling with CSS Modules for better maintainability
- **Feature-Sliced Design**: Organized project structure following FSD architecture principles

## 📦 Tech Stack

- **React** 19.0.0
- **TypeScript** 5.5.4
- **Vite** 5.4.2
- **Tailwind CSS** 3.4.13
- **CSS Modules** for component styling
- **ESLint** for code quality

## 🏗️ Project Structure

```
src/
├── app/                    # Application entry point
│   ├── App.tsx            # Main app component
│   ├── index.tsx          # React DOM root
│   └── index.css          # Global styles
├── shared/                # Shared resources
│   └── ui/                # UI components
│       └── testimonial-card/
│           ├── TestimonialCard.tsx
│           ├── TestimonialCard.module.css
│           └── index.ts   # Public API exports
├── entities/              # Business entities (empty)
├── features/              # Business features (empty)
└── widgets/               # Composite UI blocks (empty)
```

## 🎨 Component API

### TestimonialCard Props

```typescript
interface TestimonialCardProps {
  authorName: string;      // Full name of the testimonial author
  authorUsername: string;   // Username/handle (e.g., @username)
  authorImage: string;     // URL to the author's profile image
  testimonialText: string;  // The testimonial content
}
```

### Usage Example

```tsx
import { TestimonialCard } from '@/shared/ui/testimonial-card';

function App() {
  return (
    <TestimonialCard
      authorName="Sarah Dole"
      authorUsername="@sarahdole"
      authorImage="https://example.com/profile.jpg"
      testimonialText="I've been searching for high-quality abstract images for my design projects, and I'm thrilled to have found this platform. The variety and depth of creativity are astounding!"
    />
  );
}
```

## 🎯 Features

### Accessibility
- Semantic HTML elements (`<figure>`, `<figcaption>`, `<blockquote>`)
- ARIA labels and descriptions for screen readers
- Unique IDs generated with React's `useId()` hook to prevent collisions
- Proper alt text for images

### Styling
- Tailwind CSS for utility-first styling
- CSS Modules for component-specific styles
- Custom color palette and typography configuration
- Noto Sans font family integration
- Responsive design with mobile-first approach

### Developer Experience
- Path aliases configured (`@/` maps to `src/`)
- TypeScript for type safety
- ESLint for code quality
- Hot Module Replacement (HMR) with Vite

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📝 Development

The project uses:
- **Vite** for fast development and building
- **Tailwind CSS** with custom configuration for colors and fonts
- **CSS Modules** for scoped component styles
- **TypeScript** for type safety
- **Feature-Sliced Design** architecture for scalable project structure

### Path Aliases

The project is configured with path aliases for cleaner imports:
- `@/` → `src/`

Example:
```tsx
import { TestimonialCard } from '@/shared/ui/testimonial-card';
```

## 🎨 Customization

### Tailwind Configuration

The project includes a custom Tailwind configuration with:
- Custom gray color palette
- Noto Sans font family as the default sans-serif font

You can extend the theme in `tailwind.config.js` to add more customizations.

### Component Styling

The component uses a combination of Tailwind utilities and CSS Modules. To customize:
- Global styles: Edit `src/app/index.css`
- Component styles: Edit `src/shared/ui/testimonial-card/TestimonialCard.module.css`
- Tailwind config: Edit `tailwind.config.js`

## 🚀 Deployment

This project is configured for deployment on [Vercel](https://vercel.com).

### Deploy to Vercel

#### Option 1: GitHub Integration (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project" and import the repository `ydunets/ui-kit`
3. Vercel will auto-detect the Vite configuration from `vercel.json`
4. Click "Deploy"

Vercel will automatically:
- Build the project using `npm run build`
- Deploy to a production URL
- Set up automatic deployments on every push to `main` branch
- Create preview deployments for pull requests

#### Option 2: Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel
```

The project includes `vercel.json` with the following configuration:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **SPA Routing**: Configured for client-side routing

## 📄 License

This project is private and for educational purposes.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!
