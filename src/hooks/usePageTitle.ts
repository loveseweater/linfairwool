import { useEffect } from 'react'

/**
 * 设置当前页面的 document.title（SEO 优化）
 * 预渲染时也会生效（puppeteer 渲染后 document.title 更新）
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
