import { useState, useEffect } from 'react'
import { fetchSiteContent } from './api'
import type { SiteContent } from '../data/siteContent'
import { products as fallbackProducts, blogPosts as fallbackBlogPosts } from '../data/products'
import { defaultSiteContent } from '../data/siteContent'

export { type Product, type BlogPost } from './api'

export function useSiteData() {
  // Always use static data as source of truth for products and blog posts
  const [products] = useState(fallbackProducts)
  const [blogPosts] = useState(fallbackBlogPosts)
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const content = await fetchSiteContent()
        if (!cancelled) {
          setSiteContent(content)
        }
      } catch {
        // Fallback handled inside fetchSiteContent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { products, blogPosts, siteContent, loading }
}
