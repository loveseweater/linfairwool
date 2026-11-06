// Cloudflare Pages Function: /api/auth
// 管理端登录验证端点（2026-11-06 新增，配合周检 S1 修复）。
// 客户端把「密码的 SHA-256」作为 Bearer token 提交；本端点只做验证、不写数据。
// 哈希本身存于 Cloudflare Pages 环境变量 ADMIN_PASSWORD_HASH，前端 bundle 不含任何哈希。

interface Env {
  ADMIN_PASSWORD_HASH?: string
}

// 常数时间字符串比较
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

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    })
  }

  const expectedHash = env.ADMIN_PASSWORD_HASH
  if (!expectedHash) {
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

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: jsonHeaders,
  })
}
