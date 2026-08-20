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
export const videos: Video[] = []
