// ════════════════════════════════════════════════════════════════════════════
// LINFAIR 自有实拍产品线（真实照片，非 AI 生成）
//
// 与 productsExt.ts 的区别：
//   - productsExt.ts 是 AI 生成的「能力展示款」，图无人物、用于说明工艺
//   - 本文件是**真实拍摄**的量产款，每款都有多色 + 多角度实拍图
//
// 素材来源：工厂实拍样衣照（6006/6007/6008/6009/6034/kk222/kk968/kk976 八个系列）
// 领型与款式已逐张肉眼核对确认：
//   6006/6007/6008/6034 → 圆领短袖针织上衣（多色）
//   6009               → V 领长袖针织毛衣（多色）
//   kk222/kk976        → 圆领长袖针织上衣
//   kk968              → 半高领（mock neck）长袖针织上衣
//
// 图片可用性：60 张中 55 张可用，5 张因 JPEG 损坏（绿色乱码块）已排除，
//             排除清单见 _products_work/usable-real-photos.json
// ════════════════════════════════════════════════════════════════════════════

import type { Product } from './products'

export const productsReal: Product[] = [
  // ═══════════════ 1. 圆领短袖针织上衣（实拍四色） ═══════════════
  {
    id: 'LF-R-01',
    slug: 'short-sleeve-crew-neck-knit-top',
    name: "Women's Short-Sleeve Crew Neck Knit Top",
    category: 'Women',
    productType: 'Knit Sweaters',
    subcategory: 'Short Sleeve Crew Neck',
    description:
      'A fine-gauge short-sleeve crew neck knit top, photographed in five colourways on our production samples — the workhorse layering piece for spring and autumn ranges.',
    longDescription:
      'This short-sleeve crew neck knit top is a fine-gauge knitted pullover with a round neckline and set-in sleeves, cut to a slim-but-not-tight silhouette that reads as polished for workwear and relaxed for weekends. LINFAIR produces this style on 14gg and 16gg computerized flat knitting machines, which gives a smooth, low-bulk fabric that layers under a jacket without adding shoulder volume. It is one of the most commercially reliable silhouettes in womenswear knitwear: it carries across spring and autumn, it is simple to reorder in multiple colours, and its low fabric weight keeps unit cost and freight volume favourable. The photographs on this page are our own production samples in five colourways.',
    specs: ['14–16gg Fine Gauge', 'Crew (Round) Neckline', 'Set-In Short Sleeve', 'Slim Regular Fit'],
    materials: ['Merino-Modal Blend', 'Cotton-Merino Blend', 'Viscose-Nylon Blend (soft-touch)', '100% Merino Wool'],
    construction: ['14–16gg Computerized Flat Knit', 'Fully Fashioned Panels', 'Tubular Rib Neckline', 'Ribbed Cuffs & Hem'],
    customization: ['Pantone colour matching', 'Custom neckline depth', 'Sleeve length adjustment', 'Woven brand label & hangtag'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or machine wool cycle', 'Do not tumble dry', 'Dry flat in shade', 'Cool iron if needed'],
    applications: ['Spring/autumn womenswear', 'Workwear & smart-casual ranges', 'Multi-colour basic programmes'],
    faqs: [
      {
        q: 'What gauge is a short-sleeve knit top usually knitted at?',
        a: 'Short-sleeve knit tops are typically knitted at 14gg or 16gg. This is a fine gauge that produces a smooth, lightweight fabric around 160–200 gsm — thin enough to sit flat under a blazer, but with enough body to hold the neckline and hem shape. Heavier gauges make the silhouette bulky and defeat the purpose of a layering top.',
      },
      {
        q: 'What is the minimum order quantity for a multi-colour knit top programme?',
        a: 'LINFAIR starts at 100 pieces per colourway. Because the style uses one knitted body pattern, adding colourways does not add development cost — the minimum applies per colour, and the same approved sample covers every colour, so a five-colour programme is five colour deliveries of the same style.',
      },
      {
        q: 'Which fibre blends work best for this style?',
        a: 'For a smooth drape and soft hand-feel, a merino-modal or cotton-merino blend is the most common choice. Viscose-nylon blends give the softest touch at the lowest cost, and 100% merino is the premium option with the best breathability and odour resistance. We can knit the same body in several blends so you can compare hand-feel against your target retail price.',
      },
      {
        q: 'Can the neckline depth and sleeve length be adjusted?',
        a: 'Yes. Neckline depth, neckline rib width, sleeve length and body length are all adjustable on the same pattern. Send us a reference garment or a tech pack and our knitwear technicians will produce a digitized pattern and a physical sample for approval before bulk production.',
      },
    ],
    image: '/images/6006-L2026006-IV.MAIN.jpg',
    gallery: [
      '/images/6006-L2026006-IV.MAIN.jpg',
      '/images/6006-L2026006-BK.MAIN.jpg',
      '/images/6006-L2026006-CG.MAIN.jpg',
      '/images/6006-L2026006-CM.MAIN.jpg',
      '/images/6006-L2026006-NV.MAIN.jpg',
      '/images/6034-1.jpg',
      '/images/6034-2.jpg',
    ],
    colorOptions: ['Ivory', 'Black', 'Charcoal Grey', 'Camel', 'Navy Blue'],
    keywords: ['short sleeve knit top manufacturer', 'fine gauge knit top OEM China', 'crew neck knit top supplier'],
  },

  // ═══════════════ 2. V 领长袖针织毛衣（实拍多色） ═══════════════
  {
    id: 'LF-R-02',
    slug: 'v-neck-long-sleeve-knit-sweater',
    name: "Women's V-Neck Long Sleeve Knit Sweater",
    category: 'Women',
    productType: 'Wool Sweaters',
    subcategory: 'V-Neck Sweater',
    description:
      'A clean V-neck long sleeve sweater in soft knits, photographed on our samples in five colourways with styling and detail shots.',
    longDescription:
      'This V-neck long sleeve knit sweater is a fine-gauge pullover with a ribbed V neckline and long set-in sleeves, cut slim through the body for a neat layered line. LINFAIR produces this style at 12gg and 14gg, which gives a smooth surface and enough drape to sit cleanly over a shirt without bulk at the shoulder. The V-neck is a strong commercial silhouette because it flatters across a wide range of body shapes and it merchandises well as a layering piece — shoppers buy it to wear under a coat or over a collared shirt, which drives repeat purchase across colours rather than a single novelty purchase.',
    specs: ['12–14gg Medium Gauge', 'Ribbed V-Neckline', 'Set-In Long Sleeve', 'Slim Regular Fit'],
    materials: ['Merino-Acrylic Blend', '100% Merino Wool', 'Wool-Cashmere Blend', 'Viscose-Nylon Blend'],
    construction: ['12–14gg Computerized Flat Knit', 'Hand-Linked V-Neck Trim', 'Fully Fashioned Panels', 'Ribbed Cuffs & Hem'],
    customization: ['Pantone colour matching', 'Neck depth adjustment', 'Cashmere blend upgrade', 'Custom size grading US / EU / UK'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'RWS available on request', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or dry clean', 'Do not tumble dry', 'Dry flat in shade', 'Store folded'],
    applications: ['Autumn/winter womenswear', 'Smart-casual layering ranges', 'Premium wool sweater programmes'],
    faqs: [
      {
        q: 'What neck depth should a V-neck sweater have?',
        a: 'The commercial sweet spot is a V that ends roughly 12–16 cm below the collarbone for womenswear. A shallower V reads as a crew neck and loses the flattery benefit; a deeper V looks dated and creates coverage problems. We sample the neck depth against the intended layering garment so the proportion works in wear.',
      },
      {
        q: 'Is a V-neck sweater better in merino or a wool blend?',
        a: 'Merino gives the softest hand-feel and the best breathability, which suits a sweater worn against the skin. A merino-acrylic or viscose blend lowers unit cost and improves shape retention for a style that will be washed frequently. If the retail price point is premium, 100% merino or a wool-cashmere blend justifies the higher ticket.',
      },
      {
        q: 'Can you produce this style in a coordinated colour range?',
        a: 'Yes. A single approved sample covers every colourway, so we can produce the full colour range from one pattern with no extra development cost. We hold bulk yarn to a colour standard so a reorder in a later season matches the original delivery.',
      },
      {
        q: 'What is the lead time for a V-neck sweater order?',
        a: 'Standard lead time is 30–45 days after sample approval for sweaters, with sampling itself taking 7–15 days depending on yarn availability. For autumn/winter delivery we recommend placing the order by June or early July, because machine time concentrates across all buyers in August and September.',
      },
    ],
    image: '/images/6009-camel-1.jpg',
    gallery: [
      '/images/6009-camel-1.jpg',
      '/images/6009-camel-5.jpg',
      '/images/6009-35b469c5-0713-4c92-becf-c4ec9251abd6.jpg',
      '/images/6009-45eb7fb4-e814-4562-b3b6-ed8278d5d2e5.jpg',
      '/images/6009-62362d63-a517-47af-84fb-43eba253809b.jpg',
      '/images/6009-dd26e238-7553-4a85-ac58-ac05199f7a15.jpg',
      '/images/6009-f3433b72-09ce-46a7-b8de-e57da61429a1.jpg',
    ],
    colorOptions: ['Camel', 'Black', 'Navy Blue', 'Ivory'],
    keywords: ['v neck sweater manufacturer', 'long sleeve knit sweater OEM China', 'wool v neck supplier'],
  },

  // ═══════════════ 3. 圆领长袖针织上衣（实拍） ═══════════════
  {
    id: 'LF-R-03',
    slug: 'crew-neck-long-sleeve-knit-top',
    name: "Women's Crew Neck Long Sleeve Knit Top",
    category: 'Women',
    productType: 'Base Layers',
    subcategory: 'Crew Neck Long Sleeve',
    description:
      'A fine-gauge crew neck long sleeve knit top in soft ivory — a smooth, low-bulk base layer or standalone top.',
    longDescription:
      'This crew neck long sleeve knit top is a fine-gauge knitted pullover with a round ribbed neckline and long sleeves, knitted thin enough to layer flat under a jacket or sweater while still reading as a finished top on its own. LINFAIR produces this style on 14gg and 16gg machines in a smooth knit that resists the bulk that makes heavier long-sleeve tops difficult to layer. It is a high-repeat SKU: customers replace these tops regularly and buy across multiple colours, so colour fastness and repeatable fit across production runs matter more than novelty.',
    specs: ['14–16gg Fine Gauge', 'Crew (Round) Ribbed Neckline', 'Long Set-In Sleeve', 'Slim Layering Fit'],
    materials: ['Merino-Modal Blend', 'Viscose-Nylon Blend', 'Cotton-Merino Blend', '100% Merino Wool'],
    construction: ['14–16gg Computerized Flat Knit', 'Tubular Rib Neckline', 'Fully Fashioned Panels', 'Ribbed Cuffs & Hem'],
    customization: ['Pantone colour matching', 'Body & sleeve length', 'Elastane blend for stretch recovery', 'Branded neck label'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or machine wool cycle', 'Do not tumble dry', 'Dry flat in shade', 'Do not bleach'],
    applications: ['Layering ranges & winter basics', 'Workwear & uniform programmes', 'Multi-colour basic programmes'],
    faqs: [
      {
        q: 'What makes a knit top suitable for layering?',
        a: 'Two things: gauge and seam construction. A 14–16gg knit produces a thin fabric that adds warmth without shoulder bulk, and flat or tubular seams lie flat so they do not create ridges under an outer layer. Heavier gauges and raised seams are what make a garment feel bulky when layered.',
      },
      {
        q: 'Do fine-gauge knit tops hold their shape after washing?',
        a: 'They do, if the yarn has adequate elasticity and the garment is dried flat rather than hung. Adding a small percentage of elastane improves recovery further, which is worth specifying for markets where customers will machine wash frequently.',
      },
      {
        q: 'Can this style be produced as a base layer programme?',
        a: 'Yes — this silhouette works well as a base layer. For base-layer use we typically specify 16gg and an 18.5 micron merino, with flatlock seams if the garment is designed to sit against the skin. We can also add thumbhole cuffs for outdoor and performance positioning.',
      },
    ],
    image: '/images/kk976-1-r.jpg',
    gallery: [
      '/images/kk976-1-r.jpg',
      '/images/kk976-2.jpg',
      '/images/kk976-3.jpg',
      '/images/kk976-4.jpg',
      '/images/kk222-1-r.jpg',
      '/images/kk222-2.jpg',
      '/images/kk222-3.jpg',
    ],
    colorOptions: ['Ivory / Cream'],
    keywords: ['long sleeve knit top manufacturer', 'fine gauge knit top OEM', 'layering knit top supplier China'],
  },

  // ═══════════════ 4. 半高领长袖针织上衣（实拍双色） ═══════════════
  {
    id: 'LF-R-04',
    slug: 'mock-neck-long-sleeve-knit-top',
    name: "Women's Mock Neck Long Sleeve Knit Top",
    category: 'Women',
    productType: 'Base Layers',
    subcategory: 'Mock Neck',
    description:
      'A mock neck long sleeve knit top in ivory and black — the neck covering without the bulk of a full turtleneck.',
    longDescription:
      'This mock neck long sleeve knit top is a fine-gauge pullover with a short stand collar that sits just below the jawline, covering the neck without the folded volume of a full turtleneck. LINFAIR produces this style at 14gg in a smooth knit that holds the collar upright through wear and washing. The mock neck is a useful commercial style because it addresses the same need as a turtleneck — neck warmth and a clean line under a jacket — while being easier to wear for customers who find a full turtleneck too warm or too close-fitting.',
    specs: ['14gg Fine Gauge', 'Mock Neck (Short Stand Collar)', 'Long Set-In Sleeve', 'Slim Regular Fit'],
    materials: ['Merino-Modal Blend', 'Merino-Elastane (collar recovery)', 'Viscose-Nylon Blend', '100% Merino Wool'],
    construction: ['14gg Computerized Flat Knit', 'Double-Layer Stand Collar', 'Fully Fashioned Panels', 'Ribbed Cuffs & Hem'],
    customization: ['Collar height adjustment', 'Elastane blend for collar recovery', 'Pantone colour matching', 'Custom size grading'],
    moq: '100 pieces per colourway',
    leadTime: '30–45 days after sample approval',
    certifications: ['OEKO-TEX certified production', 'BSCI / Sedex audit support on request'],
    careInstructions: ['Hand wash cold or machine wool cycle', 'Do not tumble dry', 'Dry flat, reshaping collar', 'Cool iron collar if needed'],
    applications: ['Autumn/winter layering', 'Workwear & smart-casual', 'Neck-warming basic programmes'],
    faqs: [
      {
        q: 'What is the difference between a mock neck and a turtleneck?',
        a: 'A mock neck has a short stand collar that ends just below the jaw and does not fold over. A turtleneck has a taller collar that folds down on itself. The mock neck gives neck coverage with less fabric and less warmth, which makes it easier to wear indoors and simpler to layer under a jacket.',
      },
      {
        q: 'Does a mock neck collar lose its shape?',
        a: 'A stand collar can relax over time, especially in softer yarns. We control this two ways: knitting the collar double-layer so it has structure of its own, and adding a small percentage of elastane to the blend for recovery. A double-layer collar with elastane holds its stand through repeated washing.',
      },
      {
        q: 'Can mock necks be made without elastane for natural-fibre-only ranges?',
        a: 'Yes. A double-layer ribbed collar in 100% merino holds its shape reasonably well without elastane, particularly if the yarn is spun with good twist. If your brand avoids synthetic content entirely, we will specify a firmer-spun merino and knit the collar with a tighter rib for structure.',
      },
    ],
    image: '/images/kk968-1.jpg',
    gallery: [
      '/images/kk968-1.jpg',
      '/images/kk968-4.jpg',
      '/images/kk968-2.jpg',
      '/images/kk968-3.jpg',
    ],
    colorOptions: ['Ivory', 'Black'],
    keywords: ['mock neck knit top manufacturer', 'stand collar knit top OEM China', 'half turtleneck supplier'],
  },
]
