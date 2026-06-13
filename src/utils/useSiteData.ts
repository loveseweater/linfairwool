import { useState, useEffect } from 'react'
import { fetchData, fetchSiteContent } from './api'
import type { Product, BlogPost } from './api'
import type { SiteContent } from '../data/siteContent'
import { products as fallbackProducts, blogPosts as fallbackBlogPosts } from '../data/products'
import { defaultSiteContent } from '../data/siteContent'

export { type Product, type BlogPost }

// Load user-edited data from localStorage
function loadLocalData() {
  try {
    const raw = localStorage.getItem('linfair_data')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        products: parsed.products || null,
        blogPosts: parsed.blogPosts || null,
      }
    }
  } catch {}
  return { products: null, blogPosts: null }
}

function loadLocalContent(): SiteContent | null {
  try {
    const raw = localStorage.getItem('linfair_siteContent')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function useSiteData() {
  // Start with localStorage data if available, otherwise fallback to static
  const localData = loadLocalData()
  const localContent = loadLocalContent()

  const [products, setProducts] = useState<Product[]>(
    localData.products || fallbackProducts
  )
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(
    localData.blogPosts || fallbackBlogPosts
  )
  const [siteContent, setSiteContent] = useState<SiteContent>(
    localContent || defaultSiteContent
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [data, content] = await Promise.all([
          fetchData(),
          fetchSiteContent(),
        ])
        if (cancelled) return
        // Only override if we don't have localStorage data
        if (!localData.products) setProducts(data.products)
        if (!localData.blogPosts) setBlogPosts(data.blogPosts)
        if (!localContent) setSiteContent(content)
      } catch {
        // fallback to what we already have
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => { cancelled = true }
  }, [])

  return { products, blogPosts, siteContent, loading }
}
