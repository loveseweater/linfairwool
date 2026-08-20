// Cloudflare API + localStorage fallback data management
import { products as staticProducts, blogPosts as staticBlogPosts } from '../data/products'
import { defaultSiteContent, type SiteContent } from '../data/siteContent'

const STORAGE_KEY_DATA = 'linfair_data'
const STORAGE_KEY_CONTENT = 'linfair_siteContent'
const STORAGE_KEY_AUTH = 'linfair_admin_auth'

const ADMIN_PASSWORD = 'linfair2026'

export interface Product {
  id: string
  name: string
  category: 'Men' | 'Women'
  subcategory: string
  description: string
  specs: string[]
  image: string
  gallery: string[]
  video?: string
  amazonUrl?: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  image: string
}

// API base URL - use relative path for Cloudflare Pages
const API_BASE = '/api'

// === Auth ===
export async function login(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY_AUTH, 'true')
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(STORAGE_KEY_AUTH)
}

export function isLoggedIn(): boolean {
  return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true'
}

// === API helpers ===
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function getAuthHeader(): Record<string, string> {
  return { 'Authorization': `Bearer ${ADMIN_PASSWORD}` }
}

// === Products & Blog Data ===
function getStoredData(): { products: Product[]; blogPosts: BlogPost[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToLocalStorage(data: { products: Product[]; blogPosts: BlogPost[] }) {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data))
  } catch { /* ignore */ }
}

export async function fetchData(): Promise<{ products: Product[]; blogPosts: BlogPost[] }> {
  // Try API first
  const apiData = await apiFetch<{ products: Product[]; blogPosts: BlogPost[] }>('/data')
  if (apiData && apiData.products) {
    // Cache to localStorage as backup
    saveToLocalStorage(apiData)
    return apiData
  }

  // Fallback to localStorage
  const stored = getStoredData()
  if (stored) return stored

  // Fallback to defaults
  const data = { products: staticProducts as Product[], blogPosts: staticBlogPosts as BlogPost[] }
  saveToLocalStorage(data)
  return data
}

export async function saveData(data: { products?: Product[]; blogPosts?: BlogPost[] }): Promise<boolean> {
  // Save to localStorage first (always works)
  try {
    const current = getStoredData() || { products: staticProducts, blogPosts: staticBlogPosts }
    if (data.products) current.products = data.products
    if (data.blogPosts) current.blogPosts = data.blogPosts
    saveToLocalStorage(current)
  } catch { return false }

  // Try API save to Cloudflare KV (data available to all visitors instantly)
  try {
    const fullData = getStoredData() || { products: staticProducts, blogPosts: staticBlogPosts }
    const content = getStoredSiteContent() || defaultSiteContent
    await apiFetch('/data', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ ...fullData, siteContent: content }),
    })
  } catch { /* API save is optional */ }

  return true
}

export async function resetData(): Promise<boolean> {
  try {
    localStorage.removeItem(STORAGE_KEY_DATA)
    // Also try to reset on server
    await apiFetch('/data', {
      method: 'PUT',
      headers: getAuthHeader(),
    })
    return true
  } catch { return false }
}

// === Site Content ===
function getStoredSiteContent(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTENT)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export async function fetchSiteContent(): Promise<SiteContent> {
  // Try API first
  const apiData = await apiFetch<{ siteContent: SiteContent }>('/data')
  if (apiData && apiData.siteContent) {
    // Cache to localStorage
    try { localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(apiData.siteContent)) } catch {}
    return apiData.siteContent
  }

  // Fallback to localStorage
  const stored = getStoredSiteContent()
  if (stored) return stored

  // Fallback to defaults
  try { localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(defaultSiteContent)) } catch {}
  return defaultSiteContent
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  // Save to localStorage first
  try {
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(content))
  } catch { return false }

  // Try API save (data available to all visitors instantly)
  try {
    const fullData = getStoredData() || { products: staticProducts, blogPosts: staticBlogPosts }
    await apiFetch('/data', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ ...fullData, siteContent: content }),
    })
  } catch { /* API save is optional */ }

  return true
}

export async function resetSiteContent(): Promise<boolean> {
  try {
    localStorage.removeItem(STORAGE_KEY_CONTENT)
    return true
  } catch { return false }
}

// === Export / Import for Publishing ===
export function downloadDataFile() {
  const data = getStoredData() || { products: staticProducts, blogPosts: staticBlogPosts }
  const content = getStoredSiteContent() || defaultSiteContent
  const payload = { products: data.products, blogPosts: data.blogPosts, siteContent: content }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'linfair-data-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importDataFile(file: File): Promise<{ products: Product[]; blogPosts: BlogPost[]; siteContent: SiteContent } | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.products && data.blogPosts && data.siteContent) {
          // Restore to localStorage
          saveToLocalStorage({ products: data.products, blogPosts: data.blogPosts })
          try { localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(data.siteContent)) } catch {}
          resolve(data)
        } else {
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    }
    reader.onerror = () => resolve(null)
    reader.readAsText(file)
  })
}
