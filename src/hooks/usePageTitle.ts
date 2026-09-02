import { useEffect } from 'react'

const SITE_URL = 'https://www.linfairwool.cn'

/**
 * 设置当前页面的 document.title 和 canonical 链接（SEO 优化）
 * @param title 页面标题（如 "About Us | LINFAIR"）
 * @param path 页面路径（如 "/about"、"/blog/blog-30"，首页传 "/"）
 * 预渲染时也会生效（puppeteer 渲染后 title 与 canonical 更新）
 */
export function usePageTitle(title: string, path = '/') {
  useEffect(() => {
    document.title = title
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', `${SITE_URL}${path}`)
  }, [title, path])
}
