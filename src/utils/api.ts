// Cloudflare API + localStorage fallback data management
import { products as staticProducts, blogPosts as staticBlogPosts } from '../data/products'
import { defaultSiteContent, type SiteContent } from '../data/siteContent'

const STORAGE_KEY_DATA = 'linfair_data'
const STORAGE_KEY_CONTENT = 'linfair_siteContent'
const STORAGE_KEY_AUTH = 'linfair_admin_auth'

// 管理端认证（2026-11-06 二次重构，最简配置）：
// 登录时把明文密码经 HTTPS 提交给 /api/auth，服务端与 Cloudflare Pages 环境变量
// ADMIN_PASSWORD 比对，成功后签发 8 小时会话 token。前端 bundle 不含任何密码或
// 哈希，sessionStorage 里存的是会话 token 而非密码本身。
// 详见 functions/api/auth.ts 与 functions/api/data.ts。

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
  try {
    // 明文密码只在 HTTPS 请求体里出现一次，服务端验证后返回短期会话 token
    const res = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      const data = await res.json().catch(() => null)
      if (data?.token) {
        sessionStorage.setItem(STORAGE_KEY_AUTH, data.token)
        return 'ok'
      }
      return 'network'
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
  // 客户端持 /api/auth 签发的会话 token（8 小时有效），不是密码、也不是哈希
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

  // 只有成功写入 Cloudflare KV 才算真正发布给所有访客。API 失败必须如实返回
  // false，避免后台显示「保存成功」而内容其实只在管理员本机 localStorage 里。
  try {
    const fullData = getStoredData() || { products: staticProducts, blogPosts: staticBlogPosts }
    const content = getStoredSiteContent() || defaultSiteContent
    const result = await apiFetch<{ success?: boolean }>('/data', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ ...fullData, siteContent: content }),
    })
    return result?.success === true
  } catch {
    return false
  }
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

  // 同 saveData：KV 写入失败时如实返回 false，不再伪装成发布成功
  try {
    const fullData = getStoredData() || { products: staticProducts, blogPosts: staticBlogPosts }
    const result = await apiFetch<{ success?: boolean }>('/data', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ ...fullData, siteContent: content }),
    })
    return result?.success === true
  } catch {
    return false
  }
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

// === Newsletter Subscription ===
// 2026-11-13 修复周检 M7：订阅必须落到服务端 KV，否则线索只存在访客自己的
// 浏览器里（清缓存即丢，站点方永远拿不到）。这里如实返回三态：
//   'ok'       服务端已写入（或该邮箱已订阅）
//   'invalid'  邮箱格式不合法（前端已先校验，服务端二次校验兜底）
//   'error'    网络/服务端异常——调用方必须显示失败，不得提示成功
export type SubscribeResult = 'ok' | 'invalid' | 'error'

export async function subscribeEmail(email: string, source: 'popup' | 'footer' = 'footer'): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })
    if (res.ok) return 'ok'
    if (res.status === 400) return 'invalid'
    return 'error'
  } catch {
    return 'error'
  }
}

export interface SubscriberRecord {
  email: string
  source?: string
  createdAt: string
  country?: string
}

export async function fetchSubscribers(): Promise<SubscriberRecord[] | null> {
  try {
    const res = await fetch(`${API_BASE}/subscribe`, { headers: getAuthHeader() })
    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    return Array.isArray(data?.subscribers) ? data.subscribers : null
  } catch {
    return null
  }
}
