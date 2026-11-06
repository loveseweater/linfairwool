// Cloudflare Pages Function: /api/data
// Handles GET (fetch data) and POST (save data with admin auth)
// Data is stored in LINFAIR_KV, instantly available to all visitors
//
// 安全设计（2026-11-06 重构，修复周检 S1）：
// 1. 口令哈希只存在于 Cloudflare Pages 环境变量 ADMIN_PASSWORD_HASH，
//    绝不出现在前端 bundle（旧版本曾把哈希硬编码进 src/utils/api.ts，导致
//    任何人可取哈希 pass-the-hash 覆写 KV——已修复，务必轮换密码）。
// 2. 不再返回 Access-Control-Allow-Origin: *：站点内所有请求都是同源，
//    无需 CORS；去掉后第三方页面无法跨域读写本接口。
// 3. token 比对使用常数时间比较，避免时序侧信道。

interface Env {
  LINFAIR_KV: KVNamespace
  ADMIN_PASSWORD_HASH?: string
}

const KV_KEY = 'app_data'

// 常数时间字符串比较（避免逐字符短路造成的时序差异）
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

const jsonHeaders = { 'Content-Type': 'application/json' }

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  // 同源站点不需要 CORS 预检；不返回任何 Access-Control 头，
  // 使第三方站点的跨域 fetch（含 preflight）直接失败。
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
      // No data in KV yet
      return new Response(JSON.stringify({ products: null, blogPosts: null, siteContent: null }), {
        status: 200,
        headers: jsonHeaders,
      })
    }

    // ─── POST: Save data to KV（管理端专用）───
    if (request.method === 'POST') {
      const expectedHash = env.ADMIN_PASSWORD_HASH
      if (!expectedHash) {
        // 未配置服务端口令哈希：拒绝一切写入（fail closed），绝不回退到内置值
        return new Response(JSON.stringify({ error: 'Admin auth is not configured (ADMIN_PASSWORD_HASH env missing)' }), {
          status: 503,
          headers: jsonHeaders,
        })
      }

      const authHeader = request.headers.get('Authorization') || ''
      const token = authHeader.replace('Bearer ', '')
      if (!token || !timingSafeEqual(token, expectedHash)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: jsonHeaders,
        })
      }

      const body = await request.json()
      const { products, blogPosts, siteContent } = body

      // Build data object
      const data: Record<string, any> = {}
      if (products !== undefined) data.products = products
      if (blogPosts !== undefined) data.blogPosts = blogPosts
      if (siteContent !== undefined) data.siteContent = siteContent

      // Read existing data and merge
      const existingRaw = await env.LINFAIR_KV.get(KV_KEY, 'text')
      let existing: Record<string, any> = {}
      if (existingRaw) {
        try { existing = JSON.parse(existingRaw) } catch {}
      }

      const merged = { ...existing, ...data }

      // Save to KV
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
