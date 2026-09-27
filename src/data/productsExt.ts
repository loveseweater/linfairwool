// ════════════════════════════════════════════════════════════════════════════
// LINFAIR 新品系列数据（2026-09 扩容）
//
// 覆盖 7 大品类：针织毛衣 / 打底衫 / 羊毛衫 / 围巾 / 帽子 / 手套 / 袜子
//
// AEO/GEO 设计要点：
//   - longDescription 为「答案优先」段落：首句即完整定义，便于 AI 引擎直接摘录引用
//   - faqs 会同时渲染为页面 Q&A 区块 + FAQPage 结构化数据，命中 AI 问答检索
//   - materials / gauge / moq / leadTime 提供可被引用的具体数字（AI 偏好可验证事实）
//   - 统一实体表述：LINFAIR / Dongguan Lingfei Textile Co., Ltd. / Dalang, Dongguan
// ════════════════════════════════════════════════════════════════════════════

import type { Product } from './products'

/** 7 大产品品类（用于前台筛选与结构化数据 hasOfferCatalog） */
export const PRODUCT_TYPES = [
  'Knit Sweaters',
  'Base Layers',
  'Wool Sweaters',
  'Scarves',
  'Hats',
  'Gloves',
  'Socks',
] as const

export type ProductType = (typeof PRODUCT_TYPES)[number]

export const productsExt: Product[] = [
  // ══════════════════════ 1. 针织毛衣 · Knit Sweaters ══════════════════════
  {
    id: 'LF-KS-01',
    slug: 'cable-knit-crewneck-sweater',
    name: "Women's Chunky Cable-Knit Crewneck Sweater",
    category: 'Women',
    productType: 'Knit Sweaters',
    subcategory: 'Cable Knit',
    description:
      'A chunky cable-knit crewneck in oatmeal cream wool, offering the textured hand-feel and premium drape that sell in the AW season.',
    longDescription:
      'A chunky cable-knit crewneck sweater is a heavyweight pullover built on a 5gg flat knitting machine, where raised cable braids are knitted into the panel rather than added as surface decoration. LINFAIR produces this style in oatmeal cream wool with a ribbed collar, cuffs and hem that retain their shape after repeated washing. For brands, the cable knit is one of the highest perceived-value constructions available: the visible texture reads as craftsmanship on a shelf or in a product photo, while the heavier yarn weight supports a premium price point at retail. This style is fully customizable in yarn composition, colour, gauge and fit.',
    specs: ['5gg Chunky Gauge', 'Raised Cable Braid Panel', 'Ribbed Collar, Cuffs & Hem', 'Relaxed Drop-Shoulder Fit'],
    materials: ['100% Merino Wool', '70% Wool / 30% Nylon', 'Wool-Acrylic Blend (custom ratio)'],
    construction: ['5gg Computerized Flat Knit', 'Fully Fashioned Panels', 'Linked Shoulder Seams', 'Hand-Finished Cable Detail'],
    customization: ['Custom gauge (3gg–12gg)', 'Pantone colour matching', 'Custom labels & hangtags', 'Private label & branded packaging'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or dry clean', 'Do not wring or tumble dry', 'Dry flat in shade', 'Store folded, never hung'],
    applications: ['Autumn/Winter womenswear', 'Premium knitwear private label', 'Department store & boutique ranges'],
    faqs: [
      {
        q: 'What does 5gg mean in a chunky cable knit sweater?',
        a: 'GG stands for gauge — the number of needles per inch on a flat knitting machine. 5gg means roughly 5 needles per inch, which produces the thick, open, chunky stitch that defines a heavyweight cable sweater. Lower GG numbers mean thicker yarn and a heavier garment; 3gg is the chunkiest common setting, while 12gg and above produces fine, lightweight knits.',
      },
      {
        q: 'What is the minimum order quantity for a custom cable knit sweater?',
        a: 'LINFAIR starts custom cable knit sweaters at 100 pieces per colourway. Because the cable pattern is programmed into the knitting machine, there is no separate tooling cost — the MOQ is driven by yarn minimums and machine setup time rather than pattern development.',
      },
      {
        q: 'Which yarn works best for a chunky cable knit?',
        a: 'Merino wool is the most popular choice because its fibre length holds a raised cable structure without sagging. Lambswool gives a softer, fluffier hand at a lower cost, and a wool-nylon blend improves abrasion resistance for styles that will be worn hard. We can knit samples in several yarns so you can compare hand-feel before committing.',
      },
      {
        q: 'Can the cable pattern be customized?',
        a: 'Yes. We can scale the cable braid width, change the braid repeat, combine cable with rib or moss stitch panels, and adjust the neckline. Send us a reference photo or a tech pack and our knitwear technicians will produce a digitized pattern and a physical sample for approval.',
      },
    ],
    image: '/images/products/cable-knit-crewneck-sweater-1.jpg',
    gallery: [
      '/images/products/cable-knit-crewneck-sweater-1.jpg',
      '/images/products/cable-knit-crewneck-sweater-2.jpg',
      '/images/products/cable-knit-crewneck-sweater-3.jpg',
    ],
    keywords: ['custom cable knit sweater manufacturer', 'chunky cable knit sweater OEM', 'cable knit sweater supplier China'],
  },
  {
    id: 'LF-KS-02',
    slug: 'mens-ribbed-crewneck-sweater',
    name: "Men's Ribbed Knit Crewneck Sweater",
    category: 'Men',
    productType: 'Knit Sweaters',
    subcategory: 'Rib Knit',
    description:
      'A men\'s ribbed crewneck in deep charcoal merino, cut to a clean straight silhouette with structured shoulders.',
    longDescription:
      'A ribbed knit crewneck sweater is a men\'s pullover knitted in a vertical rib structure that gives the fabric natural stretch and a defined, vertical line on the body. This LINFAIR style is made in deep charcoal merino wool on a 12gg machine, producing a mid-weight garment that holds a sharp silhouette under a jacket without bulk. Vertical rib is one of the most commercially reliable men\'s knitwear constructions: it photographs well, resists the slouch that plagues plain jersey knits, and suits both formal and casual merchandising. Available in crew, v-neck and quarter-zip necklines on the same body.',
    specs: ['12gg Mid-Weight Gauge', 'Vertical Rib Structure', 'Straight Classic Fit', 'Ribbed Neck, Cuffs & Hem'],
    materials: ['100% Merino Wool', '100% Lambswool', 'Cotton-Merino Blend'],
    construction: ['12gg Computerized Flat Knit', 'Fully Fashioned Panels', 'Reinforced Shoulder Seams', 'Tubular Rib Trims'],
    customization: ['Crew / V-neck / Quarter-zip', 'Custom chest embroidery', 'Woven brand labels', 'Size grading US / EU / UK'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Machine wash cold on wool cycle', 'Reshape while damp', 'Dry flat in shade', 'Do not bleach'],
    applications: ['Menswear AW collections', 'Corporate uniform & gifting', 'Menswear private label'],
    faqs: [
      {
        q: 'What is the difference between rib knit and plain knit sweaters?',
        a: 'Rib knit alternates knit and purl stitches in vertical columns, which creates natural elasticity and a vertical texture. Plain knit (jersey) uses only knit stitches and is smoother and flatter. Rib knit sweaters stretch to fit and spring back, hold their shape better through wear, and hide creasing — which is why rib is the standard choice for men\'s crewnecks.',
      },
      {
        q: 'What gauge is best for a men\'s merino crewneck?',
        a: '12gg is the workhorse gauge for men\'s merino crewnecks. It produces a mid-weight fabric around 250–320 gsm that layers comfortably under a blazer. For a heavier winter piece, go down to 7gg or 5gg; for a lightweight travel sweater, move up to 14gg.',
      },
      {
        q: 'Can you produce men\'s sizes for US, EU and UK markets?',
        a: 'Yes. We grade patterns to your target market\'s size chart — US, EU or UK — and can produce a graded size set as part of sampling so you can verify fit across the range before bulk production.',
      },
    ],
    image: '/images/products/mens-ribbed-crewneck-sweater-1.jpg',
    gallery: [
      '/images/products/mens-ribbed-crewneck-sweater-1.jpg',
      '/images/products/mens-ribbed-crewneck-sweater-2.jpg',
      '/images/products/mens-ribbed-crewneck-sweater-3.jpg',
    ],
    keywords: ['mens ribbed sweater manufacturer', 'merino wool crewneck OEM China', 'custom mens knitwear supplier'],
  },
  {
    id: 'LF-KS-03',
    slug: 'fuzzy-mohair-blend-sweater',
    name: "Women's Fuzzy Mohair-Blend Sweater",
    category: 'Women',
    productType: 'Knit Sweaters',
    subcategory: 'Mohair Blend',
    description:
      'A brushed mohair-blend pullover in dusty pink with a soft fibre halo that catches light — a strong visual seller in lookbooks.',
    longDescription:
      'A fuzzy mohair-blend sweater is knitted from yarn with a high hair content that is brushed after knitting to raise a soft fibre halo across the fabric surface. LINFAIR produces this style in dusty pink on a 7gg machine with a loose, airy hand-feel and low fabric weight relative to its bulk. The halo effect is a merchandising asset: it photographs as softness and warmth, and it differentiates a knitwear range from flat, glossy synthetic competitors. Because loose fibres shed, we specify a yarn with a low-shedding mohair blend and a controlled brushing process so the garment survives transit and retail handling.',
    specs: ['7gg Mid-Heavy Gauge', 'Brushed Halo Finish', 'Airy Low-Density Hand-Feel', 'Ribbed Trims'],
    materials: ['50% Mohair / 30% Wool / 20% Nylon', 'Mohair-Acrylic Blend', 'Soft Wool Blend (mohair-free option)'],
    construction: ['7gg Computerized Flat Knit', 'Post-Knit Brushing Process', 'Low-Shed Fibre Selection', 'Fully Fashioned Panels'],
    customization: ['Custom brushing intensity', 'Mohair-free soft-touch alternative', 'Custom dye shades', 'Custom neckline & length'],
    moq: '150 pieces per colourway',
    leadTime: '35–50 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold, do not soak', 'Do not tumble dry', 'Dry flat away from heat', 'Brush gently to restore loft'],
    applications: ['Trend-led womenswear', 'Lookbook & campaign styles', 'Premium e-commerce ranges'],
    faqs: [
      {
        q: 'Does a mohair sweater shed?',
        a: 'Mohair sweaters shed loose surface fibres, especially when new — this is normal for hairy yarns. The amount depends on fibre length and the brushing process. We select longer-fibre yarn and control the brushing stage to minimize shedding, and we recommend a mohair-free soft-touch blend if your market has low tolerance for shedding.',
      },
      {
        q: 'Is mohair warm compared to wool?',
        a: 'Yes — mohair is one of the warmest commonly used knitwear fibres for its weight, because its smooth, hollow fibre traps air efficiently. That is why a light 7gg mohair blend feels as warm as a much heavier plain wool sweater.',
      },
      {
        q: 'Can you knit a mohair style without mohair?',
        a: 'Yes. We can produce the same halo aesthetic using a brushed wool-acrylic or alpaca-acrylic blend, which reduces cost, removes the animal-welfare concern some markets raise about mohair, and eliminates shedding. Sampling both versions lets you compare hand-feel and price side by side.',
      },
    ],
    image: '/images/products/fuzzy-mohair-blend-sweater-1.jpg',
    gallery: [
      '/images/products/fuzzy-mohair-blend-sweater-1.jpg',
      '/images/products/fuzzy-mohair-blend-sweater-2.jpg',
      '/images/products/fuzzy-mohair-blend-sweater-3.jpg',
    ],
    keywords: ['mohair blend sweater manufacturer', 'brushed fluffy sweater OEM', 'custom mohair knitwear supplier'],
  },
  {
    id: 'LF-KS-04',
    slug: 'fishermans-ribbed-sweater',
    name: "Women's Fisherman Ribbed Sweater",
    category: 'Women',
    productType: 'Knit Sweaters',
    subcategory: 'Fisherman Rib',
    description:
      'A fisherman ribbed sweater in natural undyed ivory with deep horizontal ridges and a softly rolled crewneck.',
    longDescription:
      'A fisherman rib sweater is knitted in a half-cardigan stitch that produces deep horizontal ridges and an exceptionally elastic fabric that stretches to fit while holding its loft. LINFAIR makes this style in natural undyed ivory wool, where the stitch definition and the undyed yarn work together as a quiet-luxury proposition that requires no added colour. Fisherman rib is one of the heaviest, warmest knit structures commonly produced, and it is increasingly specified by brands positioning around traceability and reduced chemical processing.',
    specs: ['7gg Heavy Gauge', 'Deep Fisherman Rib Ridges', 'High Loft & Elasticity', 'Rolled Crewneck'],
    materials: ['100% Undyed Wool (natural ivory)', '100% Merino Wool', 'Organic Cotton Fisherman Rib'],
    construction: ['7gg Computerized Flat Knit', 'Half-Cardigan Stitch Structure', 'Undyed Natural Yarn', 'Rolled Neckline Finish'],
    customization: ['Dyed or natural undyed yarn', 'GOTS organic cotton option', 'Custom rib depth', 'Custom fit & length'],
    moq: '150 pieces per colourway',
    leadTime: '35–50 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'GOTS organic cotton option available', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat, reshaping to size', 'Store folded'],
    applications: ['Quiet-luxury knitwear ranges', 'Natural & undyed capsule collections', 'Scandinavian & Japanese market styles'],
    faqs: [
      {
        q: 'What is fisherman rib in knitwear?',
        a: 'Fisherman rib — also called half-cardigan stitch — is a knit structure that alternates knit and purl in a way that pushes one stitch forward, creating deep horizontal ridges. The result is a thick, highly elastic fabric with strong stitch definition that stretches to fit and returns to shape, making it warmer and more forgiving than plain jersey knit.',
      },
      {
        q: 'Can fisherman rib sweaters be made in undyed natural yarn?',
        a: 'Yes. Undyed — sometimes called ecru or natural — wool skips the dyeing stage entirely, which reduces water use, chemical input and cost. Colour varies naturally between batches, so we recommend approving a bulk yarn sample so you can see the actual natural tone before production.',
      },
      {
        q: 'Is fisherman rib heavier than cable knit?',
        a: 'Fisherman rib and cable knit are both heavy structures, but they behave differently. Fisherman rib creates dense horizontal ridges and is typically denser and warmer per unit area, while cable knit builds texture through raised braids and tends to be slightly lighter with more visual drama. Many brands stock one of each for different price tiers.',
      },
    ],
    image: '/images/products/fishermans-ribbed-sweater-1.jpg',
    gallery: [
      '/images/products/fishermans-ribbed-sweater-1.jpg',
      '/images/products/fishermans-ribbed-sweater-2.jpg',
      '/images/products/fishermans-ribbed-sweater-3.jpg',
    ],
    keywords: ['fisherman rib sweater manufacturer', 'undyed wool sweater OEM', 'quiet luxury knitwear supplier'],
  },

  // ══════════════════════ 2. 打底衫 · Base Layers ══════════════════════
  {
    id: 'LF-BL-01',
    slug: 'merino-base-layer-top',
    name: "Women's Fine-Gauge Merino Base Layer Top",
    category: 'Women',
    productType: 'Base Layers',
    subcategory: 'Merino Base Layer',
    description:
      'A fine-gauge merino base layer in heather grey, engineered as a slim second-layer piece with a smooth, non-bulky hand-feel.',
    longDescription:
      'A merino base layer top is a fine-gauge knit garment worn against the skin as the first insulating layer, knitted thin enough to sit flat under a sweater or jacket. LINFAIR produces this style in 16gg fine-gauge merino at a low fabric weight, which is what allows it to layer invisibly. Merino is the standard fibre for base layers because its fibre structure manages moisture vapour and resists odour without chemical treatment, unlike synthetic alternatives. For brands, base layers are a high-repeat SKU: customers replace them regularly and buy across multiple colours.',
    specs: ['16gg Fine Gauge', 'Slim Fitted Silhouette', 'Low-Bulk Layering Profile', 'Flatlock Seams'],
    materials: ['100% Merino Wool (18.5 micron)', 'Merino-Tencel Blend', 'Merino-Elastane (stretch option)'],
    construction: ['16gg Fine-Gauge Flat Knit', 'Flatlock Seam Construction', 'Low-Profile Neckline', 'No-Twist Body Panel'],
    customization: ['Custom micron count', 'Elastane blend for stretch', 'Custom sleeve & body length', 'Custom label placement'],
    moq: '200 pieces per colourway',
    leadTime: '35–50 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'RWS available on request', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Machine wash cold on wool cycle', 'Do not tumble dry', 'Dry flat', 'Do not use fabric softener'],
    applications: ['Winter layering ranges', 'Travel & outdoor apparel', 'Merino capsule collections'],
    faqs: [
      {
        q: 'What gauge is best for a merino base layer?',
        a: 'Base layers are typically knit at 16gg or finer, producing a thin, smooth fabric around 150–190 gsm that sits flat under outer layers. Heavier gauges like 12gg or 7gg make a base layer too bulky to layer invisibly.',
      },
      {
        q: 'Why is merino wool used for base layers instead of cotton?',
        a: 'Merino manages moisture vapour rather than absorbing liquid, so it moves sweat away from the skin and dries quickly, while cotton soaks and stays wet against the body. Merino also resists odour naturally without antimicrobial finishes, which matters for garments worn directly against the skin.',
      },
      {
        q: 'What micron count should a merino base layer use?',
        a: 'For next-to-skin wear, 17.5–19.5 micron merino is the commercial sweet spot — soft enough not to prickle, at a cost that keeps retail pricing viable. Under 17 micron the hand-feel becomes noticeably softer but the yarn cost rises sharply.',
      },
    ],
    image: '/images/products/merino-base-layer-top-1.jpg',
    gallery: [
      '/images/products/merino-base-layer-top-1.jpg',
      '/images/products/merino-base-layer-top-2.jpg',
      '/images/products/merino-base-layer-top-3.jpg',
    ],
    keywords: ['merino base layer manufacturer', 'fine gauge merino top OEM', 'custom base layer supplier China'],
  },
  {
    id: 'LF-BL-02',
    slug: 'ribbed-thermal-turtleneck',
    name: "Women's Ribbed Thermal Turtleneck Top",
    category: 'Women',
    productType: 'Base Layers',
    subcategory: 'Thermal Turtleneck',
    description:
      'A slim ribbed thermal turtleneck in black with a high folded collar — the layering essential that anchors a winter wardrobe.',
    longDescription:
      'A ribbed thermal turtleneck is a close-fitting knit top with a tall collar that folds over itself, worn as an insulating base layer or as a standalone piece. LINFAIR knits this style in a fine vertical rib that stretches to the body and recovers its shape, with a collar deep enough to fold once and hold its position. Black thermal turtlenecks are among the highest-velocity winter basics in most markets because they solve a specific wardrobe problem: warmth at the neck without a scarf, and a clean line under a blazer. They are also an efficient production style — one body, minimal trims, fast machine time.',
    specs: ['14gg Fine Rib Gauge', 'Tall Folded Collar', 'Slim Body-Hugging Fit', 'Vertical Rib Structure'],
    materials: ['Merino-Modal Blend', 'Cotton-Merino Blend', 'Wool-Elastane (4-way stretch)'],
    construction: ['14gg Vertical Rib Knit', 'Double-Layer Folded Collar', 'Flatlock Seams', 'Elongated Body Length'],
    customization: ['Collar height adjustment', 'Long / short sleeve options', 'Custom colour range', 'Branded neck label'],
    moq: '200 pieces per colourway',
    leadTime: '35–50 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Machine wash cold on wool cycle', 'Do not tumble dry', 'Dry flat', 'Reshape collar while damp'],
    applications: ['Winter layering basics', 'Office & smart-casual ranges', 'Black basics capsule collections'],
    faqs: [
      {
        q: 'What makes a thermal turtleneck different from a regular turtleneck?',
        a: 'A thermal turtleneck is knitted in a denser rib structure with a tighter fit and a taller collar designed to be folded. The rib traps more air than a plain jersey knit and stretches to the body without gaps, so it insulates more effectively as a base layer while staying thin enough to layer under other garments.',
      },
      {
        q: 'Can a ribbed turtleneck hold its shape after washing?',
        a: 'Rib structures recover well if the yarn has good elasticity and the garment is dried flat rather than hung. We can add a small percentage of elastane to the blend for stronger recovery, which is worth specifying if your customers are likely to machine wash.',
      },
      {
        q: 'Is a turtleneck suitable as a base layer in cold climates?',
        a: 'Yes — a fine-gauge merino or merino-blend turtleneck is one of the most effective base layers for cold climates because it seals the neck, which is where a disproportionate amount of body heat is lost. Worn under a sweater and coat, a 14gg merino turtleneck handles temperatures well below freezing.',
      },
    ],
    image: '/images/products/ribbed-thermal-turtleneck-1.jpg',
    gallery: [
      '/images/products/ribbed-thermal-turtleneck-1.jpg',
      '/images/products/ribbed-thermal-turtleneck-2.jpg',
      '/images/products/ribbed-thermal-turtleneck-3.jpg',
    ],
    keywords: ['thermal turtleneck manufacturer', 'ribbed base layer OEM China', 'custom turtleneck top supplier'],
  },
  {
    id: 'LF-BL-03',
    slug: 'mens-merino-thermal-crew',
    name: "Men's Merino Thermal Crew Neck Base Layer",
    category: 'Men',
    productType: 'Base Layers',
    subcategory: 'Thermal Crew',
    description:
      'A men\'s fine-gauge merino thermal crew in dark navy, built for athletic layering with flatlock seams and a smooth surface.',
    longDescription:
      'A men\'s merino thermal crew neck base layer is a lightweight fine-gauge knit top designed to sit directly against the skin under a shirt or sweater. LINFAIR produces this style in 16gg merino at a low fabric weight with flatlock seams that lie flat against the body so they do not create pressure points under outer layers. The men\'s thermal category rewards consistency: buyers reorder the same style in multiples of black, navy and grey, so colour-fastness and repeatable fit across production runs matter more than novelty. We hold bulk yarn to a colour standard so that a reorder in month six matches the original delivery.',
    specs: ['16gg Fine Gauge', 'Flatlock Seam Construction', 'Athletic Fitted Cut', 'Breathable Low-Weight Knit'],
    materials: ['100% Merino Wool (18.5 micron)', 'Merino-Nylon Blend', 'Merino-Elastane (stretch option)'],
    construction: ['16gg Fine-Gauge Flat Knit', 'Flatlock Seams Throughout', 'Raglan Sleeve Construction', 'Elongated Back Hem'],
    customization: ['Crew / V-neck', 'Custom sleeve length', 'Thumbhole cuff option', 'Multi-pack retail packaging'],
    moq: '200 pieces per colourway',
    leadTime: '35–50 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'RWS available on request', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Machine wash cold on wool cycle', 'Do not tumble dry', 'Dry flat', 'Do not bleach'],
    applications: ['Outdoor & performance layering', 'Menswear basics ranges', 'Multi-pack retail programs'],
    faqs: [
      {
        q: 'Do men\'s merino base layers work for high-output activity?',
        a: 'Yes — merino is widely used in performance base layers because it regulates temperature across a wide range of activity levels and resists odour without chemical treatment. For very high sweat output, a merino-nylon blend improves durability and drying speed compared with 100% merino.',
      },
      {
        q: 'What is the advantage of flatlock seams in a base layer?',
        a: 'Flatlock seams join fabric panels so the seam sits flat rather than standing proud with a raised ridge. On a fitted base layer a conventional seam creates a pressure point under a backpack strap or outer layer; a flatlock seam removes it and reduces chafing against the skin.',
      },
      {
        q: 'Can you produce base layers with retail multi-pack packaging?',
        a: 'Yes. We can pack base layers as single units or as multi-packs with printed retail boxes, barcode labels and size stickers, ready for direct store or e-commerce fulfilment.',
      },
    ],
    image: '/images/products/mens-merino-thermal-crew-1.jpg',
    gallery: [
      '/images/products/mens-merino-thermal-crew-1.jpg',
      '/images/products/mens-merino-thermal-crew-2.jpg',
      '/images/products/mens-merino-thermal-crew-3.jpg',
    ],
    keywords: ['mens merino base layer manufacturer', 'thermal crew neck OEM China', 'performance knitwear supplier'],
  },

  // ══════════════════════ 3. 羊毛衫 · Wool Sweaters ══════════════════════
  {
    id: 'LF-WS-01',
    slug: 'merino-wool-crewneck-sweater',
    name: "Women's Merino Wool Crewneck Sweater",
    category: 'Women',
    productType: 'Wool Sweaters',
    subcategory: 'Merino Crewneck',
    description:
      'A medium-gauge 100% merino crewneck in rich camel tan — the classic wool sweater that carries a full price point.',
    longDescription:
      'A merino wool crewneck sweater is knitted from 100% merino yarn, a fine wool prized for a soft hand-feel that does not prickle against the skin. LINFAIR produces this style at 12gg in rich camel tan with ribbed neck, cuffs and hem. Camel, oatmeal and navy are the three colourways that sell through most reliably in wool crewnecks across European and North American markets, and camel in particular supports the highest price positioning because it reads as a premium natural fibre. A 100% merino crewneck is a long-life garment if cared for: merino resists odour and holds colour, so the style survives many seasons of wear.',
    specs: ['12gg Medium Gauge', '100% Merino Wool', 'Ribbed Neck, Cuffs & Hem', 'Regular Relaxed Fit'],
    materials: ['100% Merino Wool (19.5 micron)', 'Merino-Cashmere Blend (5–10% cashmere)', 'Extra-Fine Merino (17.5 micron)'],
    construction: ['12gg Computerized Flat Knit', 'Fully Fashioned Panels', 'Linked Neckline', 'Tubular Rib Trims'],
    customization: ['Micron count selection', 'Cashmere blend upgrade', 'Pantone colour matching', 'Custom fit grading'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'RWS (Responsible Wool Standard) available on request', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or dry clean', 'Do not tumble dry', 'Dry flat in shade', 'Store folded with cedar'],
    applications: ['Classic womenswear ranges', 'Premium wool collections', 'Department store knitwear floors'],
    faqs: [
      {
        q: 'What does 100% merino wool mean for a sweater?',
        a: 'A 100% merino sweater contains no other fibre — no nylon, acrylic or viscose blended in. This matters because the wool content drives both the hand-feel and the price positioning: pure merino can be labelled and marketed as a natural-fibre premium product, while blends must declare their composition on the care label in most markets.',
      },
      {
        q: 'What micron merino is soft enough for a sweater?',
        a: 'For sweaters worn against the skin, 19.5 micron is the standard commercial grade and is comfortable for most wearers. Extra-fine merino at 17.5–18.5 micron feels noticeably softer and suits premium positioning, while fibres above 23 micron can prickle and are usually reserved for outerwear or heavy knitwear worn over layers.',
      },
      {
        q: 'How do I verify merino wool claims from a supplier?',
        a: 'Ask for the yarn specification sheet from the mill, including micron count and fibre origin, and request third-party fibre composition testing on the finished garment. RWS certification covers responsible sourcing at farm level. LINFAIR provides yarn spec sheets and can arrange composition testing on bulk orders.',
      },
    ],
    image: '/images/products/merino-wool-crewneck-sweater-1.jpg',
    gallery: [
      '/images/products/merino-wool-crewneck-sweater-1.jpg',
      '/images/products/merino-wool-crewneck-sweater-2.jpg',
      '/images/products/merino-wool-crewneck-sweater-3.jpg',
    ],
    keywords: ['merino wool sweater manufacturer', '100% wool sweater OEM China', 'premium wool knitwear supplier'],
  },
  {
    id: 'LF-WS-02',
    slug: 'lambswool-vneck-sweater',
    name: "Men's Lambswool V-Neck Sweater",
    category: 'Men',
    productType: 'Wool Sweaters',
    subcategory: 'Lambswool V-Neck',
    description:
      'A classic men\'s lambswool v-neck in forest green, knitted to sit cleanly over a shirt and tie.',
    longDescription:
      'A lambswool v-neck sweater is a men\'s pullover knitted from the first shearing of a sheep, which produces a softer and finer yarn than standard wool at a lower cost than merino. LINFAIR produces this style in forest green on a 12gg machine with a ribbed v-neckline deep enough to show a collar and tie. The v-neck is the most durable style in menswear knitwear merchandising because it is a layering garment rather than a standalone one — it is purchased to be worn over shirts, which means repeat purchases across colourways. We can produce a coordinated v-neck, crew and cardigan on the same yarn and gauge as a complete menswear capsule.',
    specs: ['12gg Medium Gauge', 'Ribbed V-Neckline', 'Regular Classic Fit', 'Ribbed Cuffs & Hem'],
    materials: ['100% Lambswool', 'Lambswool-Nylon Blend', '100% Merino Wool'],
    construction: ['12gg Computerized Flat Knit', 'Fully Fashioned Panels', 'Hand-Linked V-Neck Trim', 'Tubular Rib Trims'],
    customization: ['Matching crew & cardigan styles', 'Custom colour range', 'Chest embroidery', 'Woven brand label'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or dry clean', 'Do not tumble dry', 'Dry flat in shade', 'Store folded'],
    applications: ['Menswear layering ranges', 'Corporate & uniform knitwear', 'Classic heritage collections'],
    faqs: [
      {
        q: 'What is lambswool and how does it differ from merino?',
        a: 'Lambswool is the first shearing from a sheep, typically taken at around seven months, and it is finer and softer than wool from older fleeces. Compared with merino, lambswool is generally slightly less fine but has a fuller, more traditional handle and costs less — which makes it a strong choice for classic menswear at mid-tier pricing.',
      },
      {
        q: 'Should a v-neck sweater be worn over a shirt or on its own?',
        a: 'Both, but the v-neck\'s commercial strength is as a layering piece. Knitted to sit over a collared shirt, it shows the collar and tie cleanly, and the neck depth is the key specification — too deep and it looks dated, too shallow and it conflicts with the collar point. We sample the neck depth against your intended shirt so the proportions work.',
      },
      {
        q: 'Can you supply a coordinated menswear knitwear capsule?',
        a: 'Yes. Producing a v-neck, crewneck and cardigan on the same yarn, gauge and colour range is straightforward and reduces sampling cost, because the yarn and colour approvals carry across all three styles. This is one of the most efficient ways to build a coherent menswear knitwear offer.',
      },
    ],
    image: '/images/products/lambswool-vneck-sweater-1.jpg',
    gallery: [
      '/images/products/lambswool-vneck-sweater-1.jpg',
      '/images/products/lambswool-vneck-sweater-2.jpg',
      '/images/products/lambswool-vneck-sweater-3.jpg',
    ],
    keywords: ['lambswool sweater manufacturer', 'mens v-neck sweater OEM China', 'classic wool knitwear supplier'],
  },
  {
    id: 'LF-WS-03',
    slug: 'lambswool-button-cardigan',
    name: "Women's Lambswool Button-Front Cardigan",
    category: 'Women',
    productType: 'Wool Sweaters',
    subcategory: 'Lambswool Cardigan',
    description:
      'A soft dove grey lambswool cardigan with a round neckline and small tonal buttons — an easy layering staple.',
    longDescription:
      'A lambswool button-front cardigan is a knitted outer layer with an open front secured by buttons, worn over a top or dress as a light jacket substitute. LINFAIR produces this style in dove grey lambswool on a 12gg machine with a knitted front placket that carries the buttons rather than a sewn-on ribbon, and small tonal buttons that keep the look restrained. Cardigans outperform pullovers in transitional seasons because they can be opened or closed as temperature changes — a practical benefit that drives strong sell-through in spring and autumn assortments. The same body can be produced with a round, v or shawl neckline.',
    specs: ['12gg Medium Gauge', 'Knitted Front Placket', 'Round Neckline', 'Small Tonal Buttons'],
    materials: ['100% Lambswool', 'Merino-Cashmere Blend', 'Wool-Cotton Blend'],
    construction: ['12gg Computerized Flat Knit', 'Knitted Placket & Buttonholes', 'Fully Fashioned Panels', 'Tubular Rib Trims'],
    customization: ['Round / V / Shawl neckline', 'Custom button finish & colour', 'Patch pocket option', 'Custom length'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or dry clean', 'Do not tumble dry', 'Dry flat in shade', 'Store folded, buttoned'],
    applications: ['Transitional season ranges', 'Womenswear layering', 'Workwear & smart-casual collections'],
    faqs: [
      {
        q: 'What is the difference between a knitted and a sewn front placket on a cardigan?',
        a: 'A knitted placket is knitted as part of the front panel and the buttonholes are formed during knitting or finished by hand, so the front edge is soft and stretches with the garment. A sewn placket uses a strip of woven fabric stitched on, which holds a crisper edge but can pucker as the knit relaxes. Knitted plackets suit soft lambswool and merino; sewn plackets suit structured looks.',
      },
      {
        q: 'What buttons work best on a wool cardigan?',
        a: 'Corozo, horn-look resin and matte polyester buttons are the most common choices. Corozo (tagua nut) reads as a natural premium material; resin gives colour flexibility at low cost. Button weight matters on knitwear — a heavy metal button can pull and distort a knitted placket, so we size the button and reinforce the placket accordingly.',
      },
      {
        q: 'Should a cardigan be stored folded or hung?',
        a: 'Folded. Hanging a knitted cardigan causes the shoulders to stretch and the body to elongate under its own weight. We recommend folding with the buttons fastened so the front edges stay aligned, and storing with cedar or lavender against moths.',
      },
    ],
    image: '/images/products/lambswool-button-cardigan-1.jpg',
    gallery: [
      '/images/products/lambswool-button-cardigan-1.jpg',
      '/images/products/lambswool-button-cardigan-2.jpg',
      '/images/products/lambswool-button-cardigan-3.jpg',
    ],
    keywords: ['lambswool cardigan manufacturer', 'wool button cardigan OEM China', 'custom cardigan supplier'],
  },

  // ══════════════════════ 4. 围巾 · Scarves ══════════════════════
  {
    id: 'LF-SC-01',
    slug: 'chunky-ribbed-merino-scarf',
    name: 'Chunky Ribbed Merino Wool Scarf',
    category: 'Accessories',
    productType: 'Scarves',
    subcategory: 'Chunky Knit Scarf',
    description:
      'A chunky ribbed merino scarf in cream ivory with hand-twisted fringe — a high-margin accessory that merchandises with any wool sweater.',
    longDescription:
      'A chunky ribbed merino scarf is a heavy-gauge knitted accessory, typically 30–40 cm wide and 180–200 cm long, finished with twisted yarn fringe at both ends. LINFAIR produces this style in cream ivory on a heavy-gauge machine using the same merino yarns as our sweaters, which means a brand can offer a matched scarf-and-sweater set from a single yarn approval. Accessories are the most capital-efficient line a knitwear brand can add: they carry a high perceived-value-to-cost ratio, require no size grading or fit risk, and sell as add-on purchases and gift items at full margin.',
    specs: ['Heavy Gauge Rib Knit', 'Hand-Twisted Yarn Fringe', 'Approx. 35 × 190 cm', 'Reversible Rib Structure'],
    materials: ['100% Merino Wool', 'Lambswool', 'Wool-Acrylic Blend'],
    construction: ['Heavy-Gauge Flat Knit', 'Twisted Fringe Finish', 'Woven Brand Label Option', 'No Size Grading Required'],
    customization: ['Custom width & length', 'Fringe style (twisted / cut / none)', 'Pantone colour matching', 'Gift box & ribbon packaging'],
    moq: '100 pieces per colourway',
    leadTime: '25–40 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat in shade', 'Comb fringe gently'],
    applications: ['AW accessory ranges', 'Gift & holiday sets', 'Matched sweater-and-scarf programs'],
    faqs: [
      {
        q: 'What is the standard size for a knitted scarf?',
        a: 'A standard adult knitted scarf is roughly 180–200 cm long and 30–40 cm wide. Shorter, wider styles around 140 cm work as a fashion piece worn over a coat, while long narrow styles suit traditional wrapping. Because scarves require no size grading, you can stock one size and cover the whole adult market.',
      },
      {
        q: 'Can scarves be made from the same yarn as our sweaters?',
        a: 'Yes, and it is one of the most efficient merchandising moves available. Producing a scarf from the same yarn, gauge and colour as a sweater gives you a matched set that sells at full margin as a gift item, and it reuses the yarn and colour approvals you have already paid for.',
      },
      {
        q: 'What fringe finishes are available on a knitted scarf?',
        a: 'Three common finishes: twisted fringe, where yarn lengths are hand-twisted into cords; cut fringe, which is left loose and straight; and no fringe with a plain or ribbed edge. Twisted fringe reads as the most premium and resists tangling, while a clean unfinished edge suits minimal, modern branding.',
      },
    ],
    image: '/images/products/chunky-ribbed-merino-scarf-1.jpg',
    gallery: [
      '/images/products/chunky-ribbed-merino-scarf-1.jpg',
      '/images/products/chunky-ribbed-merino-scarf-2.jpg',
      '/images/products/chunky-ribbed-merino-scarf-3.jpg',
    ],
    keywords: ['knitted scarf manufacturer', 'merino wool scarf OEM China', 'custom winter scarf supplier'],
  },
  {
    id: 'LF-SC-02',
    slug: 'cashmere-blend-woven-scarf',
    name: 'Cashmere-Blend Woven Winter Scarf',
    category: 'Accessories',
    productType: 'Scarves',
    subcategory: 'Woven Scarf',
    description:
      'A woven cashmere-blend scarf in soft taupe with a subtle herringbone weave and a clean hand-rolled hem.',
    longDescription:
      'A woven cashmere-blend scarf is produced on a loom rather than a knitting machine, which allows finer yarns, tighter structures and pattern weaves such as herringbone, twill and houndstooth that are not possible in knit. LINFAIR produces this style in taupe at a moderate cashmere blend with a hand-rolled hem, giving the flat drape and smooth surface that distinguishes woven from knitted accessories. Woven scarves are the premium tier of the accessory category: they photograph as luxury, they layer without bulk under a coat collar, and they are the standard gift-with-purchase and corporate-gifting format.',
    specs: ['Woven Herringbone Structure', 'Hand-Rolled Hem', 'Approx. 30 × 180 cm', 'Soft Flat Drape'],
    materials: ['70% Wool / 30% Cashmere', '100% Cashmere (premium tier)', 'Lambswool-Cashmere Blend'],
    construction: ['Loom-Woven Twill / Herringbone', 'Hand-Rolled Hem Finish', 'Colour-Fast Yarn Dyeing', 'Woven Label Option'],
    customization: ['Custom weave structure', 'Jacquard logo weaving', 'Custom cashmere percentage', 'Gift box & ribbon packaging'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Dry clean recommended', 'Hand wash cold if required', 'Do not wring', 'Dry flat in shade'],
    applications: ['Premium accessory ranges', 'Corporate & VIP gifting', 'Luxury gifting programs'],
    faqs: [
      {
        q: 'What is the difference between a woven and a knitted scarf?',
        a: 'A woven scarf is made on a loom from interlaced warp and weft yarns, giving a flat, smooth surface with fine pattern detail and a crisp drape. A knitted scarf is made from interlocking loops, giving stretch, texture and loft. Woven scarves suit finer yarns and pattern weaves; knitted scarves suit chunky, textural looks and cost less to produce in heavy weights.',
      },
      {
        q: 'What does a cashmere blend percentage actually mean?',
        a: 'A cashmere blend states the proportion of cashmere fibre in the yarn — for example 30% cashmere and 70% wool. Regulations in most markets require the composition to be declared on the label. A higher cashmere percentage increases softness and cost; a 20–30% blend is the usual commercial balance where the cashmere contributes noticeable softness without pushing the scarf into a price bracket that limits volume.',
      },
      {
        q: 'Can a logo be woven directly into a scarf?',
        a: 'Yes. Jacquard weaving can build a logo or wordmark directly into the fabric as part of the weave, which is a common approach for corporate gifting and brand-identity scarves. It requires a woven artwork file and adds to development time, so allow extra lead time on first orders.',
      },
    ],
    image: '/images/products/cashmere-blend-woven-scarf-1.jpg',
    gallery: [
      '/images/products/cashmere-blend-woven-scarf-1.jpg',
      '/images/products/cashmere-blend-woven-scarf-2.jpg',
      '/images/products/cashmere-blend-woven-scarf-3.jpg',
    ],
    keywords: ['cashmere blend scarf manufacturer', 'woven winter scarf OEM China', 'custom logo scarf supplier'],
  },
  {
    id: 'LF-SC-03',
    slug: 'cable-knit-fringed-scarf',
    name: 'Cable Knit Fringed Wool Scarf',
    category: 'Accessories',
    productType: 'Scarves',
    subcategory: 'Cable Knit Scarf',
    description:
      'A deep burgundy cable knit scarf with a bold centre braid running its full length and fringed ends.',
    longDescription:
      'A cable knit fringed scarf is knitted in the same raised-braid construction used in cable sweaters, with a single bold braid column running the length of the scarf as its design feature. LINFAIR produces this style in deep burgundy wool on a medium-gauge machine, finished with cut fringe. Because the cable structure is programmed into the machine, the braid width, repeat and count can all be adjusted, and the scarf can be produced as a matched set with a cable sweater from the same yarn and colour approval.',
    specs: ['Medium Gauge Cable Knit', 'Full-Length Centre Cable Braid', 'Cut Yarn Fringe', 'Approx. 30 × 180 cm'],
    materials: ['100% Wool', 'Lambswool', 'Wool-Acrylic Blend'],
    construction: ['Medium-Gauge Cable Knit', 'Programmed Braid Repeat', 'Cut Fringe Finish', 'Reversible Construction'],
    customization: ['Cable width & count', 'Multiple braid columns', 'Custom fringe length', 'Matched sweater set'],
    moq: '100 pieces per colourway',
    leadTime: '25–40 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring or tumble dry', 'Dry flat in shade', 'Store folded'],
    applications: ['AW accessory ranges', 'Matched knitwear sets', 'Heritage & classic collections'],
    faqs: [
      {
        q: 'Can a cable knit scarf match a cable knit sweater?',
        a: 'Yes. Because both are produced from the same programmed stitch structure and yarn, a cable scarf and cable sweater can be developed together from a single yarn and colour approval. This gives you a matched set for gifting and merchandising at minimal additional development cost.',
      },
      {
        q: 'How long does a knitted scarf take to produce?',
        a: 'Accessories move faster than garments because there is no size grading, no fit risk and less assembly. A cable scarf typically runs 25–40 days after sample approval, compared with 30–50 days for a comparable sweater, and sampling is usually quicker because only one size needs to be approved.',
      },
      {
        q: 'Which wool is best for a scarf worn against the neck?',
        a: 'Merino and lambswool are the best choices for scarves that sit against the neck, because their finer fibres do not prickle. Standard wool above 23 micron can feel scratchy on sensitive skin, so if your market is sensitive to prickle we recommend specifying merino even though it costs more per kilo.',
      },
    ],
    image: '/images/products/cable-knit-fringed-scarf-1.jpg',
    gallery: [
      '/images/products/cable-knit-fringed-scarf-1.jpg',
      '/images/products/cable-knit-fringed-scarf-2.jpg',
      '/images/products/cable-knit-fringed-scarf-3.jpg',
    ],
    keywords: ['cable knit scarf manufacturer', 'fringed wool scarf OEM', 'custom knit scarf supplier China'],
  },

  // ══════════════════════ 5. 帽子 · Hats ══════════════════════
  {
    id: 'LF-HT-01',
    slug: 'ribbed-merino-beanie',
    name: 'Ribbed Merino Wool Beanie',
    category: 'Accessories',
    productType: 'Hats',
    subcategory: 'Ribbed Beanie',
    description:
      'A mid grey ribbed merino beanie with a folded cuff — the highest-velocity knitwear accessory in most markets.',
    longDescription:
      'A ribbed merino beanie is a close-fitting knitted hat made in a circular knit or flat-knit-and-seamed construction, with vertical rib structure that stretches to fit a wide range of head sizes. LINFAIR produces this style in mid grey merino with a folded cuff, finished on a dedicated circular knitting line. Beanies are the single most efficient knitwear accessory to add to a range: one size covers most of the adult market, there is no fit risk, unit cost is low, and they sell at high multiples as impulse and gift purchases. The same body can be produced in any colourway of a sweater yarn for matched sets.',
    specs: ['Vertical Rib Structure', 'Folded Cuff', 'One Size Fits Most', 'Approx. 22 × 21 cm'],
    materials: ['100% Merino Wool', 'Lambswool', 'Wool-Acrylic Blend', 'Recycled Wool Blend'],
    construction: ['Circular Rib Knit', 'Folded Double Thickness Cuff', 'Seamless Crown Shaping', 'Woven Label Option'],
    customization: ['Custom fold & height', 'Pom-pom addition', 'Woven logo patch', 'Pantone colour matching'],
    moq: '100 pieces per colourway',
    leadTime: '20–35 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'GRS recycled option available on request', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat, reshape cuff', 'Do not tumble dry'],
    applications: ['AW accessory ranges', 'Gift & impulse retail', 'Matched knitwear sets'],
    faqs: [
      {
        q: 'Are knitted beanies one size fits all?',
        a: 'A ribbed knit beanie stretches to fit most adult head sizes, typically covering a circumference range of about 54–60 cm comfortably. Rib structure provides the stretch, which is why vertical rib is the standard construction for one-size knit hats. Adjusting the cuff depth or adding elastane can shift the fit for larger or smaller head size markets.',
      },
      {
        q: 'What is the cheapest way to add knitwear accessories to a range?',
        a: 'Start with a one-size ribbed beanie. It requires no size grading, no fit approvals beyond a single sample, and no pattern tooling, so development cost and risk are both minimal. It can also be produced from a sweater yarn you have already approved, so no new colour approval is needed.',
      },
      {
        q: 'Can beanies be made from recycled wool?',
        a: 'Yes. Recycled wool — often from pre-consumer or post-consumer knitwear — can be spun into beanie yarn, and GRS (Global Recycled Standard) certification can be arranged on request. Recycled wool blends typically contain 30–70% recycled content and can support a sustainability positioning for your accessory line.',
      },
    ],
    image: '/images/products/ribbed-merino-beanie-1.jpg',
    gallery: [
      '/images/products/ribbed-merino-beanie-1.jpg',
      '/images/products/ribbed-merino-beanie-2.jpg',
      '/images/products/ribbed-merino-beanie-3.jpg',
    ],
    keywords: ['knitted beanie manufacturer', 'merino wool hat OEM China', 'custom beanie supplier'],
  },
  {
    id: 'LF-HT-02',
    slug: 'cable-knit-bobble-hat',
    name: 'Cable Knit Bobble Hat with Pom-Pom',
    category: 'Accessories',
    productType: 'Hats',
    subcategory: 'Bobble Hat',
    description:
      'A cream cable knit bobble hat topped with a large fluffy yarn pom-pom — a strong gift and holiday SKU.',
    longDescription:
      'A cable knit bobble hat is a knitted beanie featuring a raised cable braid pattern and a yarn pom-pom attached at the crown. LINFAIR produces this style in cream ivory wool with a large fluffy pom-pom, and can make the pom-pom detachable with a press-stud so the hat can be worn two ways. Bobble hats command a higher retail price than plain beanies because the pom-pom adds perceived craft value, and the style is strongly seasonal — it is a reliable November-to-January seller and a natural gift item when merchandised with a matched scarf.',
    specs: ['Raised Cable Braid Pattern', 'Detachable Yarn Pom-Pom Option', 'One Size Fits Most', 'Approx. 22 × 24 cm'],
    materials: ['100% Wool', 'Lambswool', 'Wool-Acrylic Blend'],
    construction: ['Flat-Knit Cable Panels', 'Crown Seamed & Linked', 'Hand-Attached Pom-Pom', 'Ribbed Band'],
    customization: ['Detachable pom-pom', 'Faux-fur pom-pom alternative', 'Cable pattern scale', 'Tonal or contrast pom-pom'],
    moq: '100 pieces per colourway',
    leadTime: '25–40 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Remove pom-pom before washing if detachable', 'Dry flat', 'Do not tumble dry'],
    applications: ['Holiday & gift ranges', 'AW accessory collections', 'Ski & winter resort retail'],
    faqs: [
      {
        q: 'Can the pom-pom be made detachable?',
        a: 'Yes. We can attach the pom-pom with a press-stud or a removable loop so customers can wear the hat with or without it, and so the hat can be washed without matting the pom-pom. Detachable pom-poms also reduce the risk of the accessory arriving damaged in transit.',
      },
      {
        q: 'What fibre is used for the pom-pom?',
        a: 'Pom-poms are usually made from the same yarn as the hat or from a softer bulky yarn. The trade-off is that a yarn pom-pom can mat and shed over time, while a faux-fur pom-pom holds its volume better but is a synthetic material. We can supply both so you can compare appearance and durability.',
      },
      {
        q: 'When should bobble hats be ordered for the winter season?',
        a: 'For a September-to-October retail floor set, place accessory orders by June or early July. Bobble hats are simple to produce but the winter season concentrates demand across every buyer, so machine time in August and September books out early. Off-season production also typically secures better pricing.',
      },
    ],
    image: '/images/products/cable-knit-bobble-hat-1.jpg',
    gallery: [
      '/images/products/cable-knit-bobble-hat-1.jpg',
      '/images/products/cable-knit-bobble-hat-2.jpg',
      '/images/products/cable-knit-bobble-hat-3.jpg',
    ],
    keywords: ['bobble hat manufacturer', 'pom pom beanie OEM China', 'cable knit hat supplier'],
  },
  {
    id: 'LF-HT-03',
    slug: 'fisherman-rolled-cuff-beanie',
    name: "Fisherman Rolled-Cuff Wool Beanie",
    category: 'Accessories',
    productType: 'Hats',
    subcategory: 'Fisherman Beanie',
    description:
      'A dark navy fisherman beanie with a thick rolled brim and a shallow body that sits above the ears.',
    longDescription:
      'A fisherman beanie is a short, shallow knitted hat with a thick rolled cuff, worn pulled down just to the top of the ears rather than over them. LINFAIR produces this style in dense navy wool with a tight plain knit, which gives it the compact, structured feel the style requires — a fisherman beanie needs a firm knit to hold its shallow shape rather than slouch. The style has strong appeal in streetwear and menswear merchandising and works well in a tight colour range of navy, black, grey and ecru.',
    specs: ['Shallow Fisherman Body', 'Thick Rolled Cuff', 'Dense Firm Knit', 'Approx. 22 × 18 cm'],
    materials: ['100% Wool', 'Merino Wool', 'Wool-Acrylic Blend', 'Recycled Wool Blend'],
    construction: ['Dense Plain Knit', 'Hand-Rolled Cuff', 'Seamless Crown Shaping', 'Compact Structured Finish'],
    customization: ['Cuff depth adjustment', 'Custom body height', 'Woven logo patch', 'Tonal or contrast colourways'],
    moq: '100 pieces per colourway',
    leadTime: '20–35 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'GRS recycled option available on request', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat, reshape cuff', 'Store folded'],
    applications: ['Streetwear & menswear ranges', 'Minimalist accessory collections', 'Urban retail programs'],
    faqs: [
      {
        q: 'What is a fisherman beanie?',
        a: 'A fisherman beanie is a short knitted hat with a thick rolled cuff, worn sitting shallow on the head just above the ears rather than pulled down over them. It is denser and more structured than a slouchy beanie, and the rolled cuff is what defines the silhouette.',
      },
      {
        q: 'Why does a fisherman beanie need a denser knit?',
        a: 'The shallow body has less fabric to hold its shape, so a loose or open knit collapses and loses the intended silhouette. Fisherman beanies are therefore knitted denser, often in a plain rather than ribbed structure, so the hat stands up on the head and keeps its rolled cuff crisp.',
      },
      {
        q: 'Can you produce a colour range matched to our sweater line?',
        a: 'Yes. Accessories are usually produced from the same yarns as garments, so we can knit beanies in the exact colourways of your sweater range. This gives you matched sets and merchandising groups without a separate colour approval process.',
      },
    ],
    image: '/images/products/fisherman-rolled-cuff-beanie-1.jpg',
    gallery: [
      '/images/products/fisherman-rolled-cuff-beanie-1.jpg',
      '/images/products/fisherman-rolled-cuff-beanie-2.jpg',
      '/images/products/fisherman-rolled-cuff-beanie-3.jpg',
    ],
    keywords: ['fisherman beanie manufacturer', 'rolled cuff wool hat OEM', 'custom knit beanie supplier China'],
  },

  // ══════════════════════ 6. 手套 · Gloves ══════════════════════
  {
    id: 'LF-GL-01',
    slug: 'merino-touchscreen-gloves',
    name: 'Merino Wool Touchscreen Knit Gloves',
    category: 'Accessories',
    productType: 'Gloves',
    subcategory: 'Touchscreen Gloves',
    description:
      'Black merino knit gloves with conductive yarn at the fingertips so they work with phones and touchscreens.',
    longDescription:
      'Touchscreen knit gloves are knitted gloves with conductive yarn integrated into the fingertip and thumb area, allowing the wearer to operate a capacitive touchscreen without removing them. LINFAIR produces this style in fine-gauge black merino with ribbed cuffs, knitted on dedicated glove machines with the conductive yarn positioned during knitting rather than added as a coating. The touchscreen function is a meaningful commercial differentiator: it justifies a higher retail price than a plain knit glove and it solves a specific daily friction point, which drives repeat purchase and gift sales.',
    specs: ['Conductive Fingertip Yarn', 'Fine-Gauge Knit', 'Ribbed Wrist Cuff', 'One Size Fits Most'],
    materials: ['100% Merino Wool with Conductive Yarn', 'Wool-Acrylic Blend', 'Merino-Elastane for Stretch Fit'],
    construction: ['Dedicated Glove Knitting Machine', 'Knitted-In Conductive Fingertips', 'Ribbed Cuff', 'Seamless Finger Construction'],
    customization: ['Fingertip count (thumb + index, or all five)', 'Custom cuff length', 'Woven logo label', 'Gift packaging'],
    moq: '200 pairs per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat away from heat', 'Do not tumble dry'],
    applications: ['Winter accessory ranges', 'Tech & lifestyle gifting', 'Corporate gift programs'],
    faqs: [
      {
        q: 'How do touchscreen knit gloves work?',
        a: 'Touchscreens detect the small electrical charge from your fingertip. Wool is an insulator, so conductive yarn — typically silver-coated nylon or carbon fibre — is knitted into the fingertip and thumb areas to carry that charge through the glove to the screen. The function is built into the yarn, so it does not wash off like a topical coating.',
      },
      {
        q: 'Which fingertips need conductive yarn for touchscreen gloves?',
        a: 'At minimum the thumb and index finger, which cover the vast majority of phone interactions such as tapping, scrolling and typing. Adding conductive yarn to all five fingertips costs slightly more but removes the frustration of needing a specific finger, so we usually recommend all-five for premium positioning.',
      },
      {
        q: 'Do merino gloves provide enough warmth for winter?',
        a: 'Merino knit gloves suit mild to moderate winter conditions and are ideal where dexterity matters, since they are thinner than leather or lined gloves. For severe cold, a fleece-lined or double-layer knit glove is the better specification, and we can produce both within the same style family.',
      },
    ],
    image: '/images/products/merino-touchscreen-gloves-1.jpg',
    gallery: [
      '/images/products/merino-touchscreen-gloves-1.jpg',
      '/images/products/merino-touchscreen-gloves-2.jpg',
      '/images/products/merino-touchscreen-gloves-3.jpg',
    ],
    keywords: ['touchscreen knit gloves manufacturer', 'merino glove OEM China', 'custom winter gloves supplier'],
  },
  {
    id: 'LF-GL-02',
    slug: 'fleece-lined-cable-mittens',
    name: 'Fleece-Lined Cable Knit Mittens',
    category: 'Accessories',
    productType: 'Gloves',
    subcategory: 'Fleece-Lined Mittens',
    description:
      'Oatmeal cable knit mittens with a soft fleece lining at the cuff — maximum warmth with a handcrafted look.',
    longDescription:
      'Fleece-lined cable knit mittens combine an outer cable knit shell with an inner fleece layer, giving the warmth of an insulated glove and the handcrafted appearance of a knitted accessory. LINFAIR produces this style in oatmeal cream wool with a soft brushed fleece lining that shows slightly at the cuff. Mittens are warmer than gloves at equivalent weight because the fingers share heat in a single compartment, which makes them the correct specification for cold-climate markets. Lining a knit mitten is a value-adding construction step that supports a premium retail price.',
    specs: ['Cable Knit Outer Shell', 'Brushed Fleece Lining', 'Thumb Compartment', 'Ribbed Cuff'],
    materials: ['Wool Shell with Polyester Fleece Lining', 'Lambswool Shell with Fleece Lining', 'Acrylic-Wool Blend Shell'],
    construction: ['Cable Knit Outer Panel', 'Internal Fleece Lining', 'Hand-Linked Thumb', 'Ribbed Cuff Band'],
    customization: ['Lining thickness', 'Cable scale', 'String-and-mitten attachment', 'Gift packaging'],
    moq: '200 pairs per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat away from direct heat', 'Do not tumble dry'],
    applications: ['Cold-climate winter ranges', 'Kids & family accessory lines', 'Outdoor & ski retail'],
    faqs: [
      {
        q: 'Are mittens warmer than gloves?',
        a: 'Yes, at the same knit weight. In a mitten the fingers share a single compartment and warm each other, whereas gloves isolate each finger individually. That is why mittens are the standard recommendation for genuinely cold climates and for children, and why a lined mitten outperforms an equivalently weighted glove.',
      },
      {
        q: 'What is used to line a knitted mitten?',
        a: 'The most common lining is brushed polyester fleece, which is warm, inexpensive, dries quickly and can be sewn in as a bonded layer. Natural alternatives include brushed wool or a merino-blend lining for brands avoiding synthetics. The lining is usually visible where it meets the cuff, so we finish that join neatly.',
      },
      {
        q: 'Can mittens be connected with a string for children?',
        a: 'Yes. A knitted or braided cord can be attached between the two mittens so they stay together — a common specification for children\'s accessories. It adds a small hand-finishing cost but significantly reduces loss and is well received by parents.',
      },
    ],
    image: '/images/products/fleece-lined-cable-mittens-1.jpg',
    gallery: [
      '/images/products/fleece-lined-cable-mittens-1.jpg',
      '/images/products/fleece-lined-cable-mittens-2.jpg',
      '/images/products/fleece-lined-cable-mittens-3.jpg',
    ],
    keywords: ['fleece lined mittens manufacturer', 'cable knit mitten OEM China', 'custom winter mittens supplier'],
  },
  {
    id: 'LF-GL-03',
    slug: 'cashmere-blend-knit-gloves',
    name: 'Cashmere-Blend Ribbed Knit Gloves',
    category: 'Accessories',
    productType: 'Gloves',
    subcategory: 'Cashmere Blend Gloves',
    description:
      'Soft camel cashmere-blend gloves in a fine rib with long cuffs — a premium accessory with strong gift appeal.',
    longDescription:
      'Cashmere-blend knit gloves are fine-gauge gloves knitted from a yarn containing cashmere, which gives a noticeably softer hand-feel than pure wool at a controlled cost. LINFAIR produces this style in soft camel with a long ribbed cuff that extends over the wrist and can be worn over or under a coat sleeve. Cashmere-blend accessories are the entry point for brands wanting a luxury-tier accessory without a full cashmere price: the cashmere content delivers the softness customers feel immediately, while the wool in the blend keeps the unit cost viable.',
    specs: ['Fine Rib Knit', 'Long Extended Cuff', 'Cashmere-Blend Yarn', 'One Size Fits Most'],
    materials: ['70% Wool / 30% Cashmere', '50% Wool / 50% Cashmere', '100% Cashmere (premium tier)'],
    construction: ['Fine-Gauge Glove Knit', 'Extended Ribbed Cuff', 'Seamless Finger Knit', 'Soft-Hand Finish'],
    customization: ['Cashmere percentage', 'Cuff length', 'Woven brand label', 'Gift box & ribbon packaging'],
    moq: '200 pairs per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold', 'Do not wring', 'Dry flat in shade', 'Do not tumble dry'],
    applications: ['Premium accessory ranges', 'VIP & corporate gifting', 'Luxury gifting programs'],
    faqs: [
      {
        q: 'What cashmere percentage is worth specifying in gloves?',
        a: 'A 20–30% cashmere blend is the commercial sweet spot for most brands: enough cashmere that customers feel a clear difference in softness against the skin, without the cost of a full cashmere pair. Above 50% cashmere the gloves feel luxurious but the retail price rises sharply, which narrows the addressable market.',
      },
      {
        q: 'Do cashmere gloves pill or wear out faster than wool?',
        a: 'Cashmere is a shorter, finer fibre than wool, so pure cashmere garments do pill and abrade faster in high-friction areas. Blending cashmere with wool or a small amount of nylon improves durability meaningfully, which is why a cashmere-wool blend is often a better long-term purchase than 100% cashmere for an item worn daily.',
      },
      {
        q: 'Can you produce glove and scarf sets in the same yarn?',
        a: 'Yes. Gloves, scarves and beanies can all be produced from the same approved yarn and colour, which gives you coordinated sets that sell at a higher combined value than individual items. Producing them together also consolidates yarn purchasing and reduces waste.',
      },
    ],
    image: '/images/products/cashmere-blend-knit-gloves-1.jpg',
    gallery: [
      '/images/products/cashmere-blend-knit-gloves-1.jpg',
      '/images/products/cashmere-blend-knit-gloves-2.jpg',
      '/images/products/cashmere-blend-knit-gloves-3.jpg',
    ],
    keywords: ['cashmere blend gloves manufacturer', 'knit gloves OEM China', 'premium winter gloves supplier'],
  },

  // ══════════════════════ 7. 袜子 · Socks ══════════════════════
  {
    id: 'LF-SO-01',
    slug: 'merino-ribbed-crew-socks',
    name: 'Merino Wool Ribbed Crew Socks',
    category: 'Accessories',
    productType: 'Socks',
    subcategory: 'Merino Crew Socks',
    description:
      'Heather grey merino ribbed crew socks with a reinforced heel and toe — a repeat-purchase essential.',
    longDescription:
      'Merino wool crew socks are knitted socks that reach mid-calf, made from merino yarn that regulates temperature and resists odour without chemical treatment. LINFAIR produces this style in heather grey with a ribbed leg, a smooth knit foot and reinforced heel and toe zones. Socks are the highest-repeat accessory in any knitwear program: customers buy them in multiples, replace them regularly, and often purchase across several colours at once. Because merino socks carry a clear functional benefit over cotton, they support premium pricing and multi-pack merchandising.',
    specs: ['Ribbed Leg Structure', 'Reinforced Heel & Toe', 'Crew Height', 'Smooth Knit Foot'],
    materials: ['Merino-Nylon Blend (typical 75/25)', 'Merino-Cotton Blend', 'Merino with Elastane for Fit'],
    construction: ['Circular Sock Knitting', 'Reinforced Heel & Toe Zones', 'Linked Toe Seam', 'Ribbed Cuff & Leg'],
    customization: ['Custom cushioning zones', 'Multi-pack retail packaging', 'Jacquard logo in the leg', 'Custom size range'],
    moq: '300 pairs per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Machine wash warm', 'Tumble dry low or line dry', 'Do not bleach', 'Wash with similar colours'],
    applications: ['Essentials & basics ranges', 'Outdoor & hiking retail', 'Multi-pack retail programs'],
    faqs: [
      {
        q: 'Why are merino socks more expensive than cotton socks?',
        a: 'Merino yarn costs substantially more per kilo than cotton, and the fibre delivers performance cotton cannot: it moves moisture vapour away from the skin, resists odour naturally, and regulates temperature across a wide range. For socks — a garment worn daily against the skin — those properties justify a materially higher retail price.',
      },
      {
        q: 'Why do merino socks contain nylon?',
        a: 'Nylon is added to merino sock yarn to improve abrasion resistance, particularly in the heel and toe where friction is highest. Merino is a relatively delicate fibre in high-wear conditions, so a typical performance blend is around 75% merino and 25% nylon. Higher nylon content increases durability but reduces the natural-fibre feel.',
      },
      {
        q: 'What is the minimum order for custom knitted socks?',
        a: 'LINFAIR starts custom knitted socks at 300 pairs per colourway, higher than for scarves and beanies because sock knitting machines run smaller batches less efficiently and sock yarns are often dyed to order. Multi-pack programs can be assembled across sizes within the same colour to reach the minimum.',
      },
    ],
    image: '/images/products/merino-ribbed-crew-socks-1.jpg',
    gallery: [
      '/images/products/merino-ribbed-crew-socks-1.jpg',
      '/images/products/merino-ribbed-crew-socks-2.jpg',
      '/images/products/merino-ribbed-crew-socks-3.jpg',
    ],
    keywords: ['merino socks manufacturer', 'wool crew socks OEM China', 'custom knitted socks supplier'],
  },
  {
    id: 'LF-SO-02',
    slug: 'cashmere-blend-bed-socks',
    name: 'Cashmere-Blend Plush Bed Socks',
    category: 'Accessories',
    productType: 'Socks',
    subcategory: 'Bed Socks',
    description:
      'Plush blush pink cashmere-blend bed socks with a soft folded cuff — a natural gift and loungewear SKU.',
    longDescription:
      'Bed socks are thick, soft knitted socks designed for warmth and comfort at home rather than for wearing with shoes, typically knitted in a plush yarn with a loose cuff so they do not restrict circulation. LINFAIR produces this style in blush pink with a soft folded cuff and a cashmere blend that gives the plush hand-feel the category demands. Bed socks are a strong gifting and loungewear SKU: they carry a high perceived value relative to their production cost, they sell in gift sets, and they sit naturally alongside scarves and beanie accessories in a winter assortment.',
    specs: ['Plush Thick Knit', 'Soft Folded Cuff', 'Loose Non-Restrictive Fit', 'Cashmere-Blend Yarn'],
    materials: ['Wool-Cashmere Blend', 'Polyester-Cashmere Plush Blend', 'Chenille-Cashmere Blend'],
    construction: ['Plush Loop Knit', 'Folded Comfort Cuff', 'Smooth Foot Lining', 'Soft-Hand Finish'],
    customization: ['Gift box & ribbon packaging', 'Multi-pack gift sets', 'Custom cuff depth', 'Jacquard logo option'],
    moq: '300 pairs per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Machine wash cold, gentle cycle', 'Do not tumble dry', 'Dry flat', 'Do not bleach'],
    applications: ['Gift & holiday sets', 'Loungewear & home collections', 'Hotel & hospitality amenities'],
    faqs: [
      {
        q: 'What are bed socks and how are they different from regular socks?',
        a: 'Bed socks are thicker, softer socks designed for warmth and comfort at home rather than for wearing inside shoes. They are knitted in plush yarns with a loose, non-restrictive cuff so they stay comfortable for extended wear and do not compress the ankle — a different specification from a crew or dress sock.',
      },
      {
        q: 'Why do bed socks sell well as gifts?',
        a: 'They combine a low price point with a strong sensory appeal — softness, warmth and a plush texture — which makes them an easy purchase decision. They are also a natural addition when a customer is already buying a scarf or hat, which lifts basket value in winter assortments.',
      },
      {
        q: 'Can bed socks be supplied in gift packaging?',
        a: 'Yes. We can supply bed socks in printed gift boxes with ribbon, tissue and branded labels, either as single pairs or as multi-pair gift sets. Gift-ready packaging is specified at the sampling stage so the box dimensions and insert are designed around the actual sock.',
      },
    ],
    image: '/images/products/cashmere-blend-bed-socks-1.jpg',
    gallery: [
      '/images/products/cashmere-blend-bed-socks-1.jpg',
      '/images/products/cashmere-blend-bed-socks-2.jpg',
      '/images/products/cashmere-blend-bed-socks-3.jpg',
    ],
    keywords: ['cashmere bed socks manufacturer', 'plush lounge socks OEM China', 'gift sock supplier'],
  },
]
