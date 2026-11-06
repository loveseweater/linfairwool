import { useEffect } from 'react'

const SITE_URL = 'https://linfairwool.cn'

/**
 * 设置当前页面的 document.title、canonical 链接与 meta description（SEO/GEO 优化）
 * @param title 页面标题（如 "About Us | LINFAIR"）
 * @param path 页面路径（如 "/about"、"/blog/blog-30"，首页传 "/"）
 * @param description 可选：本页专属 meta description（预渲染时同样生效；不传则保留全局默认）
 * @param noindex 可选：为 true 时注入 <meta name="robots" content="noindex, nofollow">
 *                并移除 canonical（用于 "Post/Product Not Found" 等 200 空态页，
 *                配合周检 M1 修复，避免搜索引擎收录无意义页面）
 * 预渲染时也会生效（puppeteer 渲染后 title 与 canonical 更新）
 */
export function usePageTitle(title: string, path = '/', description?: string, noindex = false) {
  useEffect(() => {
    document.title = title
    if (noindex) {
      let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex, nofollow')
      document.querySelector('link[rel="canonical"]')?.remove()
      return
    }
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', `${SITE_URL}${path}`)
    // 从 noindex 空态导航回正常页时，清除残留的 noindex
    document.querySelector('meta[name="robots"]')?.remove()
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, path, description, noindex])
}
