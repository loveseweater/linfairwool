// 视频数据文件
// 上传视频后，在 videos 数组里添加条目即可，例如：
// {
//   id: 'video-1',
//   title: 'LINFAIR Cashmere Blend Sweater Collection',
//   description: 'Discover our premium cashmere blend sweaters - soft, durable and stylish.',
//   type: 'product',            // product=产品实拍, brand=品牌宣传
//   embedUrl: 'https://www.youtube.com/embed/VIDEO_ID',   // YouTube 嵌入链接
//   thumbnail: '/images/video-thumbnails/video-1-VIDEO_ID.jpg',  // 封面图（本地图片）
//   category: 'Product Collection',  // 产品系列或品牌主题
//   date: 'August 16, 2026',
// }

export type VideoType = 'product' | 'brand'

export interface Video {
  id: string
  title: string
  description: string
  type: VideoType
  embedUrl: string
  thumbnail: string
  category: string
  date: string
}

// 视频尚未上传，暂为空数组。
// 视频上传后把真实 YouTube 视频 ID 填入，网站视频页即自动展示。
export const videos: Video[] = [
  {
    id: 'video-1',
    title: 'Women\'s Drop Shoulder Crew Neck Short Sleeve Knit Top | Soft Casual Summer Sweater Review',
    description: 'Honest review of our Women\'s Drop Shoulder Crew Neck Short Sleeve Knit Top — soft, breathable and perfect for summer. Featuring a relaxed drop shoulder, premium knit fabric and versatile crew neck in multiple colors.',
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/V48ARUhrhDk',
    thumbnail: '/images/video-thumbnails/video-1-V48ARUhrhDk.jpg',
    category: 'Drop Shoulder Knit Top',
    date: '2026-08-17T00:00:00Z',
  },
  {
    id: 'video-2',
    title: 'Cozy & Casual! Drop Shoulder Knit Top for Women | Breathable Summer Knitwear Review',
    description: 'Another look at our Drop Shoulder Knit Top — soft, lightweight and ideal for summer and early fall. A relaxed silhouette, breathable premium knit and easy-to-style crew neck make it a wardrobe essential.',
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/L99hgeEhnDI',
    thumbnail: '/images/video-thumbnails/video-2-L99hgeEhnDI.jpg',
    category: 'Drop Shoulder Knit Top',
    date: '2026-08-17T00:00:00Z',
  },
  {
    id: 'video-3',
    title: 'Women\'s Crew Neck Long Sleeve Knit Top | Soft Cozy Fall Winter Layering Essential Review',
    description: 'Discover our Women\'s Crew Neck Long Sleeve Knit Top — an ultra-soft, cozy layering essential for fall and winter. Skin-friendly fabric, comfortable crew neck and a slim fit perfect for layering or wearing solo.',
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/cE232DKAfZk',
    thumbnail: '/images/video-thumbnails/video-3-cE232DKAfZk.jpg',
    category: 'Crew Neck Long Sleeve',
    date: '2026-08-17T00:00:00Z',
  },
  {
    id: 'video-4',
    title: 'Women\'s Cashmere Blend V-Neck Sweater | Soft Long Sleeve Knit Pullover for Work & Fall Layering',
    description: 'Review of our Women\'s Cashmere Blend V-Neck Sweater — soft, lightweight and endlessly versatile. A flattering V-neck, slim fitted silhouette and premium cashmere blend knit make it perfect for work, dates and everyday fall/winter wear.',
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/sqzngc8Ovv8',
    thumbnail: '/images/video-thumbnails/video-4-sqzngc8Ovv8.jpg',
    category: 'V-Neck Sweater',
    date: '2026-08-21T00:00:00Z',
  },
  {
    id: 'video-5',
    title: "Women's Cashmere Blend Short Sleeve Sweater Drop Shoulder Lightweight Knit Pullover Business Casual",
    description: "Soft, lightweight and endlessly versatile — our Women's Cashmere Blend Short Sleeve Sweater with a relaxed drop shoulder. A breathable, premium cashmere blend knit that layers beautifully for work, weekends and business casual looks.",
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/AvDJ4YOMLSM',
    thumbnail: '/images/video-thumbnails/video-5-AvDJ4YOMLSM.jpg',
    category: 'Cashmere Blend Short Sleeve',
    date: '2026-08-24T00:00:00Z',
  },
  {
    id: 'video-6',
    title: "Women's Cashmere Blend V Neck Sweater Long Sleeve Soft Lightweight Knit Pullover Work Fall Winter",
    description: "Polished, cozy and endlessly flattering — our Women's Cashmere Blend V Neck Sweater in a slim long sleeve silhouette. The premium cashmere blend is soft, warm and breathable, ideal for work, weekend and fall-to-winter layering.",
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/-ddmt58exeE',
    thumbnail: '/images/video-thumbnails/video-6--ddmt58exeE.jpg',
    category: 'V Neck Sweater',
    date: '2026-08-25T00:00:00Z',
  },
  {
    id: 'video-7',
    title: "Women's Fitted Crew Neck Short Sleeve Knit Top | Ribbed Summer Knit Top for Women | Short Sleeve Knit Top",
    description: "Meet your new everyday essential — Women's Fitted Crew Neck Short Sleeve Knit Top. A soft, figure-flattering ribbed knit top with a clean crew neck — breathable, comfortable and perfect for work, brunch or a summer evening out.",
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/9Pha-VhIoU4',
    thumbnail: '/images/video-thumbnails/video-7-9Pha-VhIoU4.jpg',
    category: 'Crewneck Short Sleeve',
    date: '2026-08-25T00:00:00Z',
  },
  {
    id: 'video-8',
    title: "Cozy & Cute: Crew Neck Sweater for Women | Perfect Fall Knitwear",
    description: "Cozy and cute — our Women's Crew Neck Sweater is the perfect fall knitwear essential. A soft, warm crew neck pullover that layers beautifully and keeps you stylish as the weather cools.",
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/rRItH0M3Los',
    thumbnail: '/images/video-thumbnails/video-8-rRItH0M3Los.jpg',
    category: 'Crew Neck Sweater',
    date: '2026-09-02T00:00:00Z',
  },
  {
    id: 'video-9',
    title: "This Knit Top Makes Any Outfit Look Effortless",
    description: "A soft, versatile knit top that makes any outfit look effortless — easy to style, comfortable to wear and perfect for everyday looks.",
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/J1qewaSl12g',
    thumbnail: '/images/video-thumbnails/video-9-J1qewaSl12g.jpg',
    category: 'Knit Top',
    date: '2026-09-02T00:00:00Z',
  },
]
