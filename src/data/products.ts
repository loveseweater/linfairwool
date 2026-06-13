export interface Product {
  id: string
  name: string
  category: 'Men' | 'Women'
  subcategory: string
  description: string
  specs: string[]
  image: string
  gallery: string[]
  video?: string
}

export const products: Product[] = [
  {
    id: 'lf-6006',
    name: 'Drop Shoulder Crew Neck Short Sleeve Knit Top',
    category: 'Women',
    subcategory: 'Crew Neck',
    description: 'Timeless drop shoulder crew neck short sleeve knit top crafted from premium yarns. Features a relaxed fit with ribbed trims. Available in 5 colors: Ivory, Black, Charcoal, Camel, Navy. Our signature 5% lamb cashmere blend with anti-pilling technology.',
    specs: ['5% Lamb Cashmere Blend', 'Anti-Pilling Technology', 'Drop Shoulder Design', 'Relaxed Fit', 'Ribbed Trims', '5 Colors Available', 'Machine Washable'],
    image: '/images/6006-L2026006-IV.MAIN.jpg',
    gallery: ['/images/6006-L2026006-IV.MAIN.jpg', '/images/6006-camel-1.jpg', '/images/6006-L2026006-BK.MAIN.jpg', '/images/6006-camel-2.jpg', '/images/6006-L2026006-CM.MAIN.jpg'],
  },
  {
    id: 'lf-6007',
    name: 'Crew Neck Short Sleeve Knit Top',
    category: 'Women',
    subcategory: 'Crew Neck',
    description: 'Classic crew neck short sleeve knit top with a refined silhouette. Perfect for layering or wearing solo. Made from premium 5% lamb cashmere blend with anti-pilling technology. Available in 5 colors.',
    specs: ['5% Lamb Cashmere Blend', 'Anti-Pilling Technology', 'Crew Neck Design', 'Slim Fit', 'Fine-Gauge Knit', '5 Colors Available', 'Easy Care'],
    image: '/images/6007-Ivory_1.jpg',
    gallery: ['/images/6007-Ivory_1.jpg', '/images/6007-camel-1.jpg', '/images/6007-Black_1.jpg', '/images/6007-camel-2.jpg', '/images/6007-Navy_Blue_1.jpg'],
  },
  {
    id: 'lf-6008',
    name: 'Crew Neck Long Sleeve Knit Top',
    category: 'Women',
    subcategory: 'Crew Neck',
    description: 'Cozy crew neck long sleeve knit top designed for cool-weather layering. Soft, warm, and endlessly versatile. The perfect foundation piece for any wardrobe. Made from premium 5% lamb cashmere blend.',
    specs: ['5% Lamb Cashmere Blend', 'Anti-Pilling Technology', 'Crew Neck Design', 'Long Sleeve', 'Fine-Gauge Knit', '5 Colors Available', 'All-Season Wear'],
    image: '/images/6008-LF2026008.Ivory.jpg',
    gallery: ['/images/6008-LF2026008.Ivory.jpg', '/images/6008-camel-1.jpg', '/images/6008-LF2026008.Black1.jpg', '/images/6008-camel-2.jpg', '/images/6008-LF2026008.Camel.jpg'],
  },
  {
    id: 'lf-6009',
    name: 'V-Neck Long Sleeve Knit Top',
    category: 'Women',
    subcategory: 'V-Neck',
    description: 'Classic V-neck long sleeve knit top that flatters every body type. A timeless silhouette that transitions effortlessly from office to weekend. Made from premium 5% lamb cashmere blend.',
    specs: ['5% Lamb Cashmere Blend', 'Anti-Pilling Technology', 'V-Neck Design', 'Long Sleeve', 'Ribbed Cuffs & Hem', '5 Colors Available', 'Machine Washable'],
    image: '/images/6009-35b469c5-0713-4c92-becf-c4ec9251abd6.jpg',
    gallery: ['/images/6009-35b469c5-0713-4c92-becf-c4ec9251abd6.jpg', '/images/6009-camel-1.jpg', '/images/6009-45eb7fb4-e814-4562-b3b6-ed8278d5d2e5.jpg', '/images/6009-camel-2.jpg', '/images/6009-camel-3.jpg'],
  },
  {
    id: 'kk-976',
    name: 'Fleece-Lined Turtleneck Sweater',
    category: 'Women',
    subcategory: 'Fleece-Lined',
    description: 'Extra warm fleece-lined turtleneck sweater for chilly days. Features a cozy inner fleece layer that keeps you warm without sacrificing style. Available in 26+ colors with massive stock ready for quick shipment.',
    specs: ['Fleece-Lined Interior', 'Turtleneck/Stacked Collar', '26+ Colors Available', 'Heavy Weight', 'Oversized Fit', 'Bulk Stock Ready', 'MOQ: 100 pcs'],
    image: '/images/kk976-1.jpg',
    gallery: ['/images/kk976-1.jpg', '/images/kk976-2.jpg', '/images/kk976-3.jpg', '/images/kk976-4.jpg', '/images/kk976-5.jpg'],
  },
  {
    id: 'kk-222',
    name: 'Half-Zip Mock Neck Fleece-Lined Knit Top',
    category: 'Women',
    subcategory: 'Fleece-Lined',
    description: 'Sweet half-zip mock neck knit top with fleece lining. Features a charming ruffled collar detail. A best-selling basic with consistent demand.',
    specs: ['Fleece-Lined Interior', 'Half-Zip Mock Neck', 'Ruffled Collar Detail', 'Slim Fit', 'White & Black Available', 'Bulk Stock Ready', 'MOQ: 100 pcs'],
    image: '/images/kk222-1.jpg',
    gallery: ['/images/kk222-1.jpg', '/images/kk222-2.jpg', '/images/kk222-3.jpg', '/images/kk222-4.jpg', '/images/kk222-5.jpg'],
  },
  {
    id: 'kk-968',
    name: 'Ribbed Mock Neck Fleece-Lined Sweater',
    category: 'Women',
    subcategory: 'Fleece-Lined',
    description: 'Slim-fit ribbed mock neck sweater with fleece lining. The vertical ribbed pattern creates a flattering silhouette while the inner fleece provides extra warmth.',
    specs: ['Fleece-Lined Interior', 'Ribbed Knit Pattern', 'Mock Neck', 'Slim Fit', 'Multiple Colors', 'Bulk Stock Ready', 'MOQ: 100 pcs'],
    image: '/images/kk968-1.jpg',
    gallery: ['/images/kk968-1.jpg', '/images/kk968-2.jpg', '/images/kk968-3.jpg', '/images/kk968-4.jpg', '/images/kk968-5.jpg'],
  },
  {
    id: 'zxk-6034',
    name: 'Round Neck Sleeveless Knit Top',
    category: 'Women',
    subcategory: 'Sleeveless',
    description: 'Classic round neck sleeveless knit top perfect for layering or warm-weather wear. A versatile basic that belongs in every capsule wardrobe.',
    specs: ['Fine-Gauge Knit', 'Round Neck', 'Sleeveless Design', 'Slim Fit', 'Multiple Colors', 'Spring/Summer Season', 'Bulk Stock Ready'],
    image: '/images/6034-1.jpg',
    gallery: ['/images/6034-1.jpg', '/images/6034-2.jpg', '/images/6034-3.jpg', '/images/6034-4.jpg', '/images/6034-5.jpg'],
  },
]

export const blogPosts = [
  {
    id: 'blog-1',
    title: 'Why Choose a Chinese Knitwear Manufacturer? Quality, Cost & Reliability',
    excerpt: 'Learn about the advantages of partnering with a Dalang-based knitwear manufacturer for your brand\'s sweater production.',
    content: 'When sourcing knitwear for your fashion brand, choosing the right manufacturing partner is one of the most critical decisions you will make. China, particularly the Dalang region in Dongguan, has long been recognized as a global hub for knitwear production.\n\n## Why Dalang?\n\nDalang is often called the \"World Knitwear Capital.\" The region is home to thousands of specialized knitting factories, yarn suppliers, and finishing workshops. This concentration of expertise means faster turnaround times, competitive pricing, and access to a vast range of materials and techniques.\n\n## Quality Standards\n\nModern Chinese knitwear factories have invested heavily in technology. Computerized Stoll and Shima Seiki knitting machines allow for precise, consistent production. Many factories now operate under strict quality control systems, including AQL (Acceptable Quality Limit) inspections at every stage.\n\n## Cost Advantages\n\nThe cost advantage of Chinese manufacturing goes beyond cheap labor. It comes from the entire ecosystem: yarn is available locally, spare parts are readily accessible, and skilled technicians are abundant. This efficiency translates to better pricing for buyers without compromising quality.\n\n## Reliability and Communication\n\nLeading manufacturers like LINFAIR have dedicated English-speaking sales teams who understand international business practices. With clear communication, sample development, and production timelines, partnering with a Chinese knitwear manufacturer can be a smooth and profitable experience.',
    date: 'June 1, 2026',
    category: 'Sourcing Guide',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  },
  {
    id: 'blog-2',
    title: 'Merino Wool vs Cashmere: A Buyer\'s Guide for Fashion Brands',
    excerpt: 'Comprehensive comparison to help you choose the right material for your seasonal collection.',
    content: 'Choosing between merino wool and cashmere is a common dilemma for fashion brands developing their knitwear collections. Both are premium natural fibers, but they have distinct characteristics that suit different products and price points.\n\n## Merino Wool\n\nMerino wool comes from Merino sheep, primarily bred in Australia and New Zealand. The fibers are extremely fine (typically 18-24 microns), making them soft enough to wear directly against the skin. Merino is known for its excellent temperature regulation, moisture-wicking properties, and durability. It is also machine-washable in many cases, making it practical for everyday wear.\n\n## Cashmere\n\nCashmere comes from the undercoat of cashmere goats, primarily from Inner Mongolia. The fibers are even finer than merino (14-19 microns), giving cashmere its signature ultra-soft feel. Cashmere is lighter than wool for the same warmth level, making it a luxury choice. However, it requires more careful maintenance and is generally more expensive.\n\n## Comparison\n\n| Feature | Merino Wool | Cashmere |\n|---------|------------|----------|\n| Softness | Very soft | Ultra-soft |\n| Durability | High | Moderate |\n| Price | $$ | $$$$ |\n| Care | Machine washable | Dry clean recommended |\n| Warmth-to-weight | Good | Excellent |\n\n## Which One to Choose?\n\nFor brands targeting the mid-market, merino wool blends offer excellent value. For luxury positioning, a cashmere blend (even 5-10% cashmere) can significantly elevate the product\'s appeal. LINFAIR specializes in custom blends that balance quality and cost.',
    date: 'May 15, 2026',
    category: 'Fabric Guide',
    image: 'https://images.unsplash.com/photo-1614975059407-efcda6e9b2a9?w=800&q=80',
  },
  {
    id: 'blog-3',
    title: 'OEM vs ODM: Which Knitwear Manufacturing Model Is Right for Your Brand?',
    excerpt: 'Understand the differences between OEM and ODM services and how to choose the best approach for your business.',
    content: 'When starting a knitwear line, one of the first decisions you will face is whether to use OEM (Original Equipment Manufacturing) or ODM (Original Design Manufacturing). Each model has its advantages, and the right choice depends on your brand\'s stage and capabilities.\n\n## OEM: Your Design, Our Production\n\nOEM means you provide the design, specifications, and sometimes the materials, and the factory produces according to your requirements. This model gives you full control over the product design and is ideal for established brands with in-house design teams.\n\n**Pros:**\n- Complete design control\n- Exclusive products\n- Brand ownership of designs\n\n**Cons:**\n- Requires design capability\n- Longer development time\n- Higher minimum quantities\n\n## ODM: Ready-Made Designs, Customized for You\n\nODM means the factory has existing designs that you can customize with your branding, colors, and minor modifications. This is perfect for startups and brands looking to launch quickly.\n\n**Pros:**\n- Faster time to market\n- Lower MOQs\n- Proven designs with sales history\n- Cost-effective\n\n**Cons:**\n- Less design exclusivity\n- Limited customization\n\n## Which One for Your Brand?\n\nAt LINFAIR, we offer both OEM and ODM services. Many of our clients start with ODM to test the market, then transition to OEM as their brand grows. Our design team can also help bridge the gap, turning your rough ideas into production-ready specifications.',
    date: 'April 28, 2026',
    category: 'Manufacturing',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80',
  },
  {
    id: 'blog-4',
    title: 'The Complete Guide to Knitwear Quality Control: What Every Buyer Should Know',
    excerpt: 'Essential quality control checklist for knitwear sourcing — from yarn inspection to final packaging.',
    content: 'Quality control is crucial when sourcing knitwear from overseas manufacturers. A robust QC process ensures that the products you receive match your specifications and meet your customers\' expectations.\n\n## The QC Process at LINFAIR\n\n### 1. Yarn Inspection\nBefore production begins, all yarn is tested for fiber composition, color fastness, and tensile strength. This prevents issues before they reach the knitting machines.\n\n### 2. In-Production Inspection\nDuring knitting, our QC team checks gauge consistency, stitch quality, and color accuracy. Random samples are taken from each production batch.\n\n### 3. Final Inspection (AQL)\nFinished garments undergo AQL (Acceptable Quality Limit) inspection. We typically follow AQL 2.5 for major defects and 4.0 for minor defects. This international standard ensures consistency.\n\n### 4. Packing Inspection\nBefore shipping, we check labeling, barcodes, polybag quality, and carton strength.\n\n## What Buyers Should Check\n\n- **Fiber content**: Verify against your specification sheet\n- **Color**: Check against approved lab dips under standard lighting\n- **Measurements**: Compare to the approved size set\n- **Workmanship**: Check seams, buttons, zippers, and trims\n- **Pilling resistance**: Ask for Martindale test results\n\nA good manufacturer will welcome your QC inspections and provide transparent reports. At LINFAIR, we provide photo and video reports at every stage.',
    date: 'April 10, 2026',
    category: 'Quality Control',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a99?w=800&q=80',
  },
  {
    id: 'blog-5',
    title: 'Top 5 Knitwear Trends for Fall/Winter 2026',
    excerpt: 'Stay ahead of the curve with our curated list of the most influential knitwear trends this season.',
    content: 'As we look ahead to Fall/Winter 2026, several key trends are emerging in the knitwear world. Whether you are a buyer planning your next collection or a designer seeking inspiration, these trends should be on your radar.\n\n## 1. Texture Play\n\nRibbed knits, cable patterns, and mixed textures are dominating. Chunky cables meet fine-gauge ribbing in the same garment, creating visual interest through texture alone.\n\n## 2. Fleece-Lined Everything\n\nThe fleece-lined trend continues to grow. Consumers want the look of a sweater with the warmth of a jacket. Half-zip mock necks and turtlenecks with inner fleece layers are bestsellers.\n\n## 3. Neutral Earth Tones\n\nWhile bold colors have their place, earthy neutrals — camel, oatmeal, charcoal, and warm brown — remain the foundation of any knitwear collection. These colors transcend seasons and appeal to a broad customer base.\n\n## 4. Relaxed Silhouettes\n\nOversized and drop shoulder designs continue to dominate. Consumers prioritize comfort without sacrificing style.\n\n## 5. Sustainable Materials\n\nEco-conscious consumers are driving demand for sustainable fibers. Recycled yarns, organic cotton blends, and responsibly sourced cashmere are becoming standard expectations rather than differentiators.\n\nLINFAIR can help you develop any of these trends into your next collection. Contact our team to discuss your seasonal plans.',
    date: 'March 22, 2026',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
  },
  {
    id: 'blog-6',
    title: 'Sustainable Knitwear Manufacturing: How LINFAIR Is Leading the Change',
    excerpt: 'Learn about our commitment to sustainable manufacturing and ethical wool sourcing practices.',
    content: 'Sustainability is no longer just a buzzword — it is a business imperative. At LINFAIR, we are committed to reducing our environmental footprint while maintaining the highest quality standards.\n\n## Ethical Yarn Sourcing\n\nWe source our yarns from suppliers who adhere to ethical practices. Our cashmere comes from responsibly managed goat herds in Inner Mongolia, and our merino wool is sourced from farms that prioritize animal welfare.\n\n## Waste Reduction\n\nComputerized knitting machines allow us to minimize yarn waste. Unlike cut-and-sew manufacturing, our whole-garment knitting produces minimal scraps. Any waste yarn is collected and recycled.\n\n## Energy Efficiency\n\nOur factory uses energy-efficient Stoll and Shima Seiki machines that consume less power than older models. We are also exploring solar energy to power our production facilities.\n\n## Sustainable Packaging\n\nWe have transitioned to recycled and biodegradable packaging materials. Our polybags are made from recycled plastic, and our cartons use recycled cardboard.\n\n## How You Can Contribute\n\nAs a brand, you can contribute to sustainability by:\n- Ordering in bulk to reduce shipping frequency\n- Choosing sustainable fibers like organic cotton or recycled polyester blends\n- Designing timeless pieces that transcend seasonal trends\n- Working with manufacturers who share your values\n\nAt LINFAIR, we believe that sustainable manufacturing is not just good for the planet — it is good for business. Contact us to learn more about our sustainability initiatives.',
    date: 'March 8, 2026',
    category: 'Sustainability',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
  },
]
