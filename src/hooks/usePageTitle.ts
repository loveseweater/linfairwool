import { useEffect } from 'react'

const SITE_URL = 'https://linfairwool.cn'

/**
 * 设置当前页面的 document.title、canonical 链接与 meta description（SEO/GEO 优化）
 * @param title 页面标题（如 "About Us | LINFAIR"）
 * @param path 页面路径（如 "/about"、"/blog/blog-30"，首页传 "/"）
 * @param description 可选：本页专属 meta description（预渲染时同样生效；不传则保留全局默认）
 * 预渲染时也会生效（puppeteer 渲染后 title 与 canonical 更新）
 */
export function usePageTitle(title: string, path = '/', description?: string) {
  useEffect(() => {
    document.title = title
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', `${SITE_URL}${path}`)
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, path, description])
}
