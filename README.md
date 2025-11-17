# David Knipe - Technical Blog

A modern, sleek redesign of david-tec.com built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Design & UX
- Modern glassmorphism design with gradient accents
- Smooth animations using Framer Motion
- Full dark mode support with system preference detection
- Responsive design optimized for all devices
- Beautiful typography with Inter font family
- Custom scrollbars and hover effects

### Pages
1. **Homepage** - Hero section with stats, featured posts, and tag cloud
2. **Blog Listing** - Searchable and filterable blog posts with tag system
3. **Blog Post** - Rich content display with syntax highlighting
4. **NuGet Explorer** - Interactive package browser with search and filters
5. **Archive** - Chronological archive with expandable years

### Components
- `Navigation` - Sticky header with mobile menu
- `Footer` - Comprehensive footer with links and info
- `ThemeProvider` - Dark mode context and management
- `CodeBlock` - Syntax highlighting with copy functionality
- `BlogCard` - Reusable blog post card component
- `TagCloud` - Dynamic tag visualization

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/
│   ├── blog/
│   │   ├── [slug]/      # Dynamic blog post pages
│   │   └── page.tsx     # Blog listing page
│   ├── nuget-explorer/  # NuGet package explorer
│   ├── archive/         # Archive page
│   ├── layout.tsx       # Root layout with theme provider
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles and design tokens
├── components/
│   ├── BlogCard.tsx     # Blog post card component
│   ├── CodeBlock.tsx    # Syntax highlighted code blocks
│   ├── Footer.tsx       # Site footer
│   ├── Navigation.tsx   # Main navigation with mobile menu
│   ├── TagCloud.tsx     # Tag visualization component
│   └── ThemeProvider.tsx # Dark mode context provider
└── public/              # Static assets

```

## Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Purple (#6b3fa0)
- **Optimizely Brand**: Blue (#0073e7)

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Inter font family
- **Code**: JetBrains Mono / Fira Code

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with shadow effects
- **Inputs**: Clean borders with focus states

## Customization

### Adding Blog Posts
Blog posts are currently hardcoded. To add CMS integration:
1. Create a content service in `lib/`
2. Fetch posts from your CMS API
3. Update pages to use the service

### Modifying Theme
Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints

### Adding Pages
Create new pages in the `app/` directory following Next.js 14 conventions.

## Performance

- Server-side rendering for fast initial loads
- Code splitting for optimal bundle sizes
- Image optimization with Next.js Image
- Lazy loading for animations and images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

**David Knipe**
VP of Solution Architecture @ Optimizely
Optimizely MVP Alumni

- Website: [david-tec.com](https://www.david-tec.com/)
- GitHub: [@davidknipe](https://github.com/davidknipe)
- Twitter: [@davidknipe](https://twitter.com/davidknipe)
