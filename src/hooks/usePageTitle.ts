import { useEffect } from 'react'

const SITE_URL = 'https://linfairwool.cn'

/**
 * URL 规范化：Cloudflare Pages 会把所有非首页路由的**无斜杠形式 308** 到带斜杠版本
 * （实测 /about → 308 → /about/、/blog/blog-1 → 308 → /blog/blog-1/）。
 * 因此 canonical / og:url 必须指向带斜杠的 200 版本，否则每爬一页多一跳，
 * 且 canonical 指向的是一个重定向 URL（2026-11-13 周检修复）。
 */
export function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  const clean = path.split('?')[0].split('#')[0]
  return clean.endsWith('/') ? clean : clean + '/'
}

function pageType(path: string): string {
  if (/^\/blog\/blog-/.test(path)) return 'article'
  if (/^\/products\/.+/.test(path)) return 'product'
  return 'website'
}

/** 统一维护 robots meta：正常页 index, follow；空态页 noindex, nofollow。
 * 旧逻辑直接 remove() 会把模板里的 robots meta 从预渲染 DOM 里删掉（2026-11-13 修复）。 */
export function setRobotsMeta(content: 'index, follow' | 'noindex, nofollow') {
  let el = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', 'robots')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * 同步 OG / Twitter 卡片。
 * 修复前所有内页的 og:url 都指向首页、og:title 用首页通用文案——
 * 任何一次社交分享看到的都是"首页"而不是当前文章/产品。
 */
export function syncSocialMeta(opts: { url: string; title?: string; description?: string; type?: string; image?: string }) {
  const setMeta = (key: string, attr: 'property' | 'name', value?: string) => {
    if (!value) return
    let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', value)
  }
  setMeta('og:url', 'property', opts.url)
  setMeta('og:type', 'property', opts.type || pageType(opts.url))
  setMeta('og:title', 'property', opts.title)
  setMeta('og:description', 'property', opts.description)
  // 内页必须带自己的分享图，否则社交平台抓到的是全站统一的 logo
  setMeta('og:image', 'property', opts.image)
  setMeta('twitter:url', 'name', opts.url)
  setMeta('twitter:title', 'name', opts.title)
  setMeta('twitter:description', 'name', opts.description)
  setMeta('twitter:image', 'name', opts.image)
}

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
export function usePageTitle(title: string, path = '/', description?: string, noindex = false, image?: string) {
  useEffect(() => {
    document.title = title
    if (noindex) {
      setRobotsMeta('noindex, nofollow')
      document.querySelector('link[rel="canonical"]')?.remove()
      return
    }
    const normalized = normalizePath(path)
    const url = `${SITE_URL}${normalized}`
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url)
    // 从 noindex 空态导航回正常页时，恢复可索引状态
    setRobotsMeta('index, follow')
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
    // hreflang 只在首页有意义：SPA 内页会继承首页模板里的 hreflang，
    // 那等于把每一篇内页都声明成"首页的语言版本"，属错误标注。
    if (normalized !== '/') {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove())
    }
    syncSocialMeta({ url, title, description, type: pageType(normalized), image: image ? `${SITE_URL}${image}` : undefined })
  }, [title, path, description, noindex, image])
}
