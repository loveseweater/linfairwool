// Cloudflare Pages Function: /api/data
// GET  公开只读：返回 LINFAIR_KV 中的内容
// POST 管理端写入：校验 /api/auth 签发的会话 token 后合并写入 KV
//
// 安全设计（2026-11-06 重构，修复周检 S1）：
// 1. 凭据只存在于 Cloudflare Pages 环境变量（推荐 ADMIN_PASSWORD 明文，
//    兼容 ADMIN_PASSWORD_HASH 哈希）。前端 bundle 不含任何密码或哈希。
//    旧版曾把哈希硬编码进 src/utils/api.ts，任何人可取哈希 pass-the-hash
//    覆写 KV——已修复；已泄露的那串哈希会被服务端主动拒绝。
// 2. 不再返回 Access-Control-Allow-Origin: *：站点内所有请求都是同源，
//    去掉后第三方页面无法跨域读写本接口。
// 3. 写入凭据是带过期时间的 HMAC 会话 token，而非密码本身；比对为常数时间。
// 4. 未配置环境变量时拒绝一切写入（fail-closed，503），绝不回退到内置值。

interface Env {
  LINFAIR_KV: KVNamespace
  ADMIN_PASSWORD?: string
  ADMIN_PASSWORD_HASH?: string
}

const KV_KEY = 'app_data'
const LEAKED_HASH = '73073736437356429c9d71236fbd377592d7e2b6c83e758bc80a1b7e1fefb65e'
const enc = new TextEncoder()

const jsonHeaders = { 'Content-Type': 'application/json' }

// 常数时间字符串比较（避免逐字符短路造成的时序差异）
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

// 与 functions/api/auth.ts 的 sessionSecret / hmacHex 保持一致
// （Pages Functions 每个文件映射一个路由，故不抽取共享模块，避免生成额外端点）
function sessionSecret(env: Env): string | null {
  if (env.ADMIN_PASSWORD) return 'pw:' + env.ADMIN_PASSWORD
  if (env.ADMIN_PASSWORD_HASH) return 'hash:' + env.ADMIN_PASSWORD_HASH
  return null
}

function isLeaked(env: Env): boolean {
  return !!env.ADMIN_PASSWORD_HASH && env.ADMIN_PASSWORD_HASH.toLowerCase() === LEAKED_HASH
}

async function hmacHex(key: string, message: string): Promise<string> {
  const k = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(message))
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
}

async function isValidSession(env: Env, token: string): Promise<boolean> {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [exp, sig] = parts
  if (!/^\d+$/.test(exp) || !sig) return false
  if (Number(exp) < Date.now()) return false
  const secret = sessionSecret(env)
  if (!secret) return false
  return timingSafeEqual(sig, await hmacHex(secret, exp))
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  // 同源站点不需要 CORS 预检；不返回任何 Access-Control 头
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  try {
    // ─── GET: Fetch data from KV（公开只读）───
    if (request.method === 'GET') {
      const raw = await env.LINFAIR_KV.get(KV_KEY, 'text')
      if (raw) {
        return new Response(raw, { status: 200, headers: jsonHeaders })
      }
      return new Response(JSON.stringify({ products: null, blogPosts: null, siteContent: null }), {
        status: 200,
        headers: jsonHeaders,
      })
    }

    // ─── POST: Save data to KV（管理端专用）───
    if (request.method === 'POST') {
      if (isLeaked(env)) {
        return new Response(JSON.stringify({ error: 'Configured hash was publicly leaked; set a fresh ADMIN_PASSWORD instead' }), {
          status: 503,
          headers: jsonHeaders,
        })
      }
      if (!sessionSecret(env)) {
        return new Response(JSON.stringify({ error: 'Admin auth is not configured (set ADMIN_PASSWORD in Cloudflare Pages)' }), {
          status: 503,
          headers: jsonHeaders,
        })
      }

      const authHeader = request.headers.get('Authorization') || ''
      const token = authHeader.replace(/^Bearer\s+/, '')
      if (!token || !(await isValidSession(env, token))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: jsonHeaders,
        })
      }

      const body: any = await request.json()
      const { products, blogPosts, siteContent } = body

      const data: Record<string, any> = {}
      if (products !== undefined) data.products = products
      if (blogPosts !== undefined) data.blogPosts = blogPosts
      if (siteContent !== undefined) data.siteContent = siteContent

      const existingRaw = await env.LINFAIR_KV.get(KV_KEY, 'text')
      let existing: Record<string, any> = {}
      if (existingRaw) {
        try { existing = JSON.parse(existingRaw) } catch {}
      }

      const merged = { ...existing, ...data }
      await env.LINFAIR_KV.put(KV_KEY, JSON.stringify(merged))

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: jsonHeaders,
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: jsonHeaders,
    })
  }
}
