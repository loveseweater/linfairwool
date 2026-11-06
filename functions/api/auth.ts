// Cloudflare Pages Function: /api/auth
// 管理端登录：客户端提交明文密码（HTTPS 加密传输），服务端与环境变量比对后
// 签发一个 8 小时有效的会话 token。前端 bundle 不含任何密码或哈希。
//
// 环境变量（二选一，推荐前者）：
//   ADMIN_PASSWORD      = 自己定的明文密码（最简单：Cloudflare 里填什么，登录框就输什么）
//   ADMIN_PASSWORD_HASH = 该密码的 SHA-256（兼容 2026-11-06 早前的指引）
// 两者都未配置时一律 503（fail-closed），绝不回退到内置值。
//
// ⚠️ 绝不可把 730737...fb65e 这串旧哈希填进任一变量：它曾硬编码在公开的
//    /assets/index.js 中长达 10 周。服务端会主动拒绝该值。

interface Env {
  ADMIN_PASSWORD?: string
  ADMIN_PASSWORD_HASH?: string
}

// 已泄露的历史哈希（旧版前端硬编码值），禁止再次作为凭据使用
const LEAKED_HASH = '73073736437356429c9d71236fbd377592d7e2b6c83e758bc80a1b7e1fefb65e'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000
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

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// 会话 token = "<过期时间戳>.<HMAC-SHA256(secret, 过期时间戳)>"
// secret 只来自环境变量；公开的旧哈希不参与签发。
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

async function passwordMatches(env: Env, password: string): Promise<boolean> {
  if (env.ADMIN_PASSWORD) return timingSafeEqual(password, env.ADMIN_PASSWORD)
  if (env.ADMIN_PASSWORD_HASH) {
    return timingSafeEqual(await sha256Hex(password), env.ADMIN_PASSWORD_HASH.toLowerCase())
  }
  return false
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  // 同源站点不需要 CORS 预检；不返回任何 Access-Control 头
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    })
  }

  if (isLeaked(env)) {
    return new Response(JSON.stringify({ error: 'Configured hash was publicly leaked; set a fresh ADMIN_PASSWORD instead' }), {
      status: 503,
      headers: jsonHeaders,
    })
  }

  const secret = sessionSecret(env)
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Admin auth is not configured (set ADMIN_PASSWORD in Cloudflare Pages)' }), {
      status: 503,
      headers: jsonHeaders,
    })
  }

  let password = ''
  try {
    const body: any = await request.json()
    if (typeof body?.password === 'string') password = body.password
  } catch { /* 空 body 视为错误密码 */ }

  if (!password || !(await passwordMatches(env, password))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: jsonHeaders,
    })
  }

  const exp = String(Date.now() + SESSION_TTL_MS)
  const sig = await hmacHex(secret, exp)
  return new Response(JSON.stringify({ ok: true, token: `${exp}.${sig}` }), {
    status: 200,
    headers: jsonHeaders,
  })
}
