// Cloudflare Pages Function: /api/data
// Handles GET (fetch data) and POST (save data with admin auth)
// Data is stored in LINFAIR_KV, instantly available to all visitors

interface Env {
  LINFAIR_KV: KVNamespace
  ADMIN_PASSWORD_HASH?: string
}

const KV_KEY = 'app_data'
// 管理端认证只存密码的 SHA-256 哈希（不落明文）。
// 轮换密码：在 Cloudflare Pages 环境变量设置 ADMIN_PASSWORD_HASH 即可覆盖内置回退值；
// 或同步替换此处与 src/utils/api.ts 中的哈希。
const FALLBACK_ADMIN_PASSWORD_HASH = '73073736437356429c9d71236fbd377592d7e2b6c83e758bc80a1b7e1fefb65e'

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context
  const url = new URL(request.url)

  // CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // ─── GET: Fetch data from KV ───
    if (request.method === 'GET') {
      const raw = await env.LINFAIR_KV.get(KV_KEY, 'text')
      if (raw) {
        return new Response(raw, {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }
      // No data in KV yet
      return new Response(JSON.stringify({ products: null, blogPosts: null, siteContent: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // ─── POST: Save data to KV ───
    if (request.method === 'POST') {
      // Verify admin token (client sends SHA-256 hash of the password)
      const authHeader = request.headers.get('Authorization') || ''
      const token = authHeader.replace('Bearer ', '')
      const expectedHash = env.ADMIN_PASSWORD_HASH || FALLBACK_ADMIN_PASSWORD_HASH
      if (token !== expectedHash) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
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
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}
