// Default content for all pages - editable from admin panel

export interface HeroContent {
  subtitle: string
  title: string
  titleHighlight: string
  description: string
  button1Text: string
  button1Link: string
  button2Text: string
  button2Link: string
  image: string
  heroImages: string[]
}

export interface StatItem {
  value: string
  label: string
}

export interface AdvantageItem {
  title: string
  description: string
}

export interface BrandStoryContent {
  subtitle: string
  title: string
  titleHighlight: string
  paragraphs: string[]
  buttonText: string
  buttonLink: string
  image: string
}

export interface CTAContent {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export interface AboutHeroContent {
  subtitle: string
  title: string
  titleHighlight: string
  description: string
  image: string
  heroImages: string[]
}

export interface AboutIntroContent {
  title: string
  titleHighlight: string
  paragraphs: string[]
  stats: { value: string; label: string }[]
  image: string
}

export interface TimelineItem {
  year: string
  title: string
  description: string
}

export interface ValueItem {
  title: string
  description: string
}

export interface SocialLink {
  name: string
  url: string
  enabled: boolean
}

export interface NavItem {
  label: string
  path: string
  enabled: boolean
}

export interface Subscriber {
  id: string
  email: string
  createdAt: string
}

export interface AnalyticsEvent {
  page: string
  timestamp: string
  referrer: string
}

export interface ContactContent {
  subtitle: string
  title: string
  titleHighlight: string
  description: string
  address: string
  email: string
  phone: string
  workingHours: string
  formTitle: string
  formDescription: string
  whatsapp: string
  whatsappMessage: string
  heroImage: string
  heroImages: string[]
}

export interface SiteContent {
  home: {
    hero: HeroContent
    stats: StatItem[]
    brandStory: BrandStoryContent
    advantages: AdvantageItem[]
    cta: CTAContent
  }
  about: {
    hero: AboutHeroContent
    intro: AboutIntroContent
    values: ValueItem[]
    timeline: TimelineItem[]
    cta: CTAContent
  }
  contact: ContactContent
  blogHeroImages: string[]
  productsHeroImages: string[]
  socialLinks: SocialLink[]
  navItems: NavItem[]
  categories: string[]
  logo: string
}

export const defaultSiteContent: SiteContent = {
  home: {
    hero: {
      subtitle: 'LINFAIR Premium Knitwear',
      title: 'Quality &',
      titleHighlight: 'Warmth Together',
      description: 'Dongguan Lingfei Textile Co., Ltd. — professional knitwear manufacturer specializing in premium women\'s sweaters, cardigans, and knit tops. OEM/ODM services for global fashion brands.',
      button1Text: 'Shop Collection',
      button1Link: '/products',
      button2Text: 'Request a Quote',
      button2Link: '/contact',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
      heroImages: [
        '/images/6006-L2026006-IV.MAIN.jpg',
        '/images/6007-Ivory_1.jpg',
        '/images/kk976-1.jpg',
      ],
    },
    stats: [
      { value: '300+', label: 'Skilled Workers' },
      { value: '500K+', label: 'Sweaters Annually' },
      { value: '25+', label: 'Export Countries' },
      { value: '150+', label: 'Brand Partners' },
    ],
    brandStory: {
      subtitle: 'The LINFAIR Philosophy',
      title: 'Crafted for Comfort,',
      titleHighlight: 'Designed for Life',
      paragraphs: [
        'At LINFAIR, we believe that true elegance lies in simplicity. Founded with a passion for premium knitwear, our mission is to create timeless pieces that seamlessly blend comfort with sophistication. Each garment is thoughtfully crafted using carefully selected fabrics — including our signature 5% lamb cashmere blend with anti-pilling technology.',
        'Our design philosophy centers on clean lines, premium textures, and effortless silhouettes. We obsess over every detail — from the smooth finish of our ribbed trims to the perfect weight of our knit fabric — so your customers can look and feel their best.',
      ],
      buttonText: 'Our Story',
      buttonLink: '/about',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    },
    advantages: [
      {
        title: 'Premium Quality',
        description: 'Premium yarns with 5% lamb cashmere blend and anti-pilling technology. Each piece maintains its beauty wash after wash.',
      },
      {
        title: 'Expert Craftsmanship',
        description: 'Advanced Stoll/Shima Seiki computerized flat knitting machines with 300+ skilled workers and strict QC system.',
      },
      {
        title: 'Custom Design',
        description: 'Full OEM/ODM service from concept to finished product, tailored to your brand.',
      },
      {
        title: 'All-Season Versatility',
        description: 'From lightweight knit tops to fleece-lined sweaters — versatile pieces for every season and every wardrobe.',
      },
    ],
    cta: {
      title: 'Ready to Source Premium Knitwear?',
      description: 'Partner with LINFAIR for your next collection. Contact us for a consultation and quote.',
      buttonText: 'Get in Touch',
      buttonLink: '/contact',
    },
  },
  about: {
    hero: {
      subtitle: 'About LINFAIR',
      title: 'Dongguan Lingfei',
      titleHighlight: 'Textile Co., Ltd.',
      description: 'Professional knitwear manufacturer based in Dalang, Dongguan — the world\'s knitwear capital. Serving global fashion brands since 2020.',
      image: '/images/kk976-1.jpg',
      heroImages: ['/images/kk976-1.jpg', '/images/6034-1.jpg'],
    },
    intro: {
      title: 'Premium Knitwear',
      titleHighlight: 'Manufacturer',
      paragraphs: [
        'Dongguan Lingfei Textile Co., Ltd. (brand: LINFAIR) is a professional knitwear manufacturer established in 2020. Located in Dalang, Dongguan — recognized as China\'s "Hometown of Knitwear" — we benefit from the region\'s complete industry supply chain.',
        'Our factory is equipped with advanced computerized flat knitting machines (Stoll and Shima Seiki) capable of producing a wide range of knitwear: from fine 14gg lightweight knit tops to chunky 3gg cable knits and fleece-lined sweaters. We offer full OEM/ODM services including design development, sample making, production, and quality inspection.',
      ],
      stats: [
        { value: '500K+', label: 'Annual Output' },
        { value: '300+', label: 'Skilled Workers' },
        { value: '25+', label: 'Export Countries' },
        { value: '150+', label: 'Brand Partners' },
      ],
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    },
    values: [
      {
        title: 'Premium Quality',
        description: 'Premium yarns with 5% lamb cashmere blend and anti-pilling technology for lasting beauty.',
      },
      {
        title: 'Quality Materials',
        description: 'We source only the finest wools — Merino, cashmere, lambswool — from trusted, ethical suppliers.',
      },
      {
        title: 'Fashion Forward',
        description: 'Our design team stays ahead of global trends to offer collections that resonate with modern consumers.',
      },
      {
        title: 'Sustainable Practice',
        description: 'Committed to reducing our environmental footprint through responsible sourcing and production.',
      },
    ],
    timeline: [
      { year: '2020', title: 'Company Founded', description: 'Dongguan Lingfei Textile Co., Ltd. was established in Dalang, Dongguan — China\'s knitwear capital.' },
      { year: '2021', title: 'Production Launch', description: 'Factory commenced operations with advanced Stoll knitting machines, producing first export orders.' },
      { year: '2022', title: 'LINFAIR Brand Launch', description: 'Launched LINFAIR brand to serve international fashion brands with premium knitwear.' },
      { year: '2023', title: 'Capacity Expansion', description: 'Expanded production facility and team to 300+ workers, reaching 500K sweaters annual capacity.' },
      { year: '2024', title: 'Global Reach', description: 'Exported to 25+ countries across Europe, North America, and Southeast Asia.' },
      { year: '2025', title: 'Amazon Launch', description: 'Launched LINFAIR Premium Knitwear on Amazon US, expanding direct-to-consumer presence.' },
    ],
    cta: {
      title: 'Start Your Partnership',
      description: 'Let\'s create exceptional knitwear for your brand. Get in touch with our team.',
      buttonText: 'Contact Us',
      buttonLink: '/contact',
    },
  },
  contact: {
    subtitle: 'Get in Touch',
    title: 'Let\'s Discuss',
    titleHighlight: 'Your Collection',
    description: 'Ready to source premium knitwear? Fill out the form and our team will get back to you within 24 hours.',
    address: 'Dalang Town, Dongguan City, Guangdong Province, China',
    email: 'info@linfairwool.cn',
    phone: '+8613724494230',
    workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM (CST)',
    formTitle: 'Send Us a Message',
    formDescription: 'Tell us about your requirements and we\'ll create the perfect solution for your brand.',
    whatsapp: '+8613724494230',
    whatsappMessage: 'Hi LINFAIR, I am interested in your knitwear products.',
    heroImage: '/images/6034-1.jpg',
    heroImages: ['/images/6034-1.jpg', '/images/kk222-1.jpg'],
  },
  blogHeroImages: ['/images/kk222-1.jpg', '/images/6034-1.jpg'],
  productsHeroImages: ['/images/6007-Ivory_1.jpg', '/images/kk976-1.jpg', '/images/6006-L2026006-IV.MAIN.jpg'],
  socialLinks: [
    { name: 'Facebook', url: 'https://facebook.com/linfairwool', enabled: true },
    { name: 'Instagram', url: 'https://instagram.com/linfairwool', enabled: true },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/linfairwool', enabled: true },
    { name: 'Pinterest', url: 'https://pinterest.com/linfairwool', enabled: true },
    { name: 'YouTube', url: 'https://youtube.com/@linfairwool', enabled: true },
    { name: 'TikTok', url: 'https://tiktok.com/@linfairwool', enabled: true },
    { name: 'Twitter/X', url: 'https://x.com/linfairwool', enabled: true },
  ],
  navItems: [
    { label: 'Home', path: '/', enabled: true },
    { label: 'About', path: '/about', enabled: true },
    { label: 'Products', path: '/products', enabled: true },
    { label: 'Blog', path: '/blog', enabled: true },
    { label: 'Contact', path: '/contact', enabled: true },
  ],
  categories: ['Women', 'Men'],
  logo: '/logo.png?v=2',
}
