// Cloudflare API + localStorage fallback data management
import { products as staticProducts, blogPosts as staticBlogPosts } from '../data/products'
import { defaultSiteContent, type SiteContent } from '../data/siteContent'

const STORAGE_KEY_DATA = 'linfair_data'
const STORAGE_KEY_CONTENT = 'linfair_siteContent'
const STORAGE_KEY_AUTH = 'linfair_admin_auth'

// 管理端认证（2026-11-06 重构，修复周检 S1）：
// 前端 bundle 不再包含任何口令哈希。登录时把「密码的 SHA-256」作为 Bearer token
// 发给 /api/auth 由服务端验证；服务端哈希存于 Cloudflare Pages 环境变量
// ADMIN_PASSWORD_HASH（详见 functions/api/data.ts 与 functions/api/auth.ts）。
// ⚠️ 旧版把哈希硬编码在此文件中（已泄露），部署本版后必须轮换密码并设置新的
//    ADMIN_PASSWORD_HASH 环境变量。

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// Product 复用数据层定义，避免两处 interface 漂移
// （曾因 category 联合类型不同步导致 tsc 构建失败）
export type { Product } from '../data/products'
import type { Product } from '../data/products'

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
export type LoginResult = 'ok' | 'invalid' | 'unconfigured' | 'network'

export async function login(password: string): Promise<LoginResult> {
  const hash = await sha256Hex(password)
  try {
    // 由服务端验证哈希（/api/auth），前端不持有正确答案
    const res = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${hash}` },
    })
    if (res.ok) {
      sessionStorage.setItem(STORAGE_KEY_AUTH, hash)
      return 'ok'
    }
    if (res.status === 503) return 'unconfigured'
    return 'invalid'
  } catch {
    return 'network'
  }
}

export function logout() {
  sessionStorage.removeItem(STORAGE_KEY_AUTH)
}

export function isLoggedIn(): boolean {
  // 本地只判断是否持有 token；token 是否有效由服务端在每次写入时校验
  return !!sessionStorage.getItem(STORAGE_KEY_AUTH)
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
  // 客户端持哈希作为令牌；服务端比对同一哈希（或 env.ADMIN_PASSWORD_HASH 覆盖值）
  return { 'Authorization': `Bearer ${sessionStorage.getItem(STORAGE_KEY_AUTH) || ''}` }
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
