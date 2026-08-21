// 视频数据文件
// 上传视频后，在 videos 数组里添加条目即可，例如：
// {
//   id: 'video-1',
//   title: 'LINFAIR Cashmere Blend Sweater Collection',
//   description: 'Discover our premium cashmere blend sweaters - soft, durable and stylish.',
//   type: 'product',            // product=产品实拍, brand=品牌宣传
//   embedUrl: 'https://www.youtube.com/embed/VIDEO_ID',   // YouTube 嵌入链接
//   thumbnail: 'https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg',  // 封面图（自动生成）
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
    thumbnail: 'https://img.youtube.com/vi/V48ARUhrhDk/hqdefault.jpg',
    category: 'Drop Shoulder Knit Top',
    date: 'August 17, 2026',
  },
  {
    id: 'video-2',
    title: 'Cozy & Casual! Drop Shoulder Knit Top for Women | Breathable Summer Knitwear Review',
    description: 'Another look at our Drop Shoulder Knit Top — soft, lightweight and ideal for summer and early fall. A relaxed silhouette, breathable premium knit and easy-to-style crew neck make it a wardrobe essential.',
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/L99hgeEhnDI',
    thumbnail: 'https://img.youtube.com/vi/L99hgeEhnDI/hqdefault.jpg',
    category: 'Drop Shoulder Knit Top',
    date: 'August 17, 2026',
  },
  {
    id: 'video-3',
    title: 'Women\'s Crew Neck Long Sleeve Knit Top | Soft Cozy Fall Winter Layering Essential Review',
    description: 'Discover our Women\'s Crew Neck Long Sleeve Knit Top — an ultra-soft, cozy layering essential for fall and winter. Skin-friendly fabric, comfortable crew neck and a slim fit perfect for layering or wearing solo.',
    type: 'product',
    embedUrl: 'https://www.youtube.com/embed/cE232DKAfZk',
    thumbnail: 'https://img.youtube.com/vi/cE232DKAfZk/hqdefault.jpg',
    category: 'Crew Neck Long Sleeve',
    date: 'August 17, 2026',
  },
]
