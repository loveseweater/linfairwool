# LINFAIR Wool - Premium Knitwear Manufacturer

B2B wool sweater brand website for Dongguan Lingfei Textile Co., Ltd. (LINFAIR Wool brand). Showcasing men's and women's wool knitwear for global fashion buyers.

## Quick Start

### Environment Requirements
- Node.js 18+
- npm 9+

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Directory Structure

```
linfariwool/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Footer, Layout
│   │   └── ui/           # Button, SectionTitle
│   ├── pages/
│   │   ├── Home.tsx      # Home page
│   │   ├── About.tsx     # About us
│   │   ├── Products.tsx  # Product catalog
│   │   ├── Contact.tsx   # Contact & inquiry form
│   │   └── Blog.tsx      # Blog / insights
│   ├── data/
│   │   └── products.ts   # Product & blog data
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion
- **Routing**: React Router v7

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, stats, featured products, advantages, CTA |
| `/about` | About Us | Brand story, values, milestones timeline |
| `/products` | Products | Men's & women's sweaters with category filtering |
| `/contact` | Contact | Inquiry form, contact info, business hours |
| `/blog` | Blog | Industry insights, trends, sourcing tips |

## Deployment

Build the project and deploy the `dist/` folder to any static hosting service.

```bash
npm run build
# Upload the dist/ folder to Vercel, Netlify, Cloudflare Pages, etc.
```

For custom domain (linfariwool.cn), configure DNS to point to your hosting provider.
