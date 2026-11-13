// Cloudflare Pages Function: /api/subscribe
// POST 公开：订阅邮箱写入 KV（去重 + 每 IP 限频）；GET 管理端：读取订阅者列表
//
// 背景（2026-11-13 修复周检 M7）：
// 旧实现只在浏览器 localStorage 里 push 一条记录就提示"订阅成功"——
// 站点方永远收不到线索，用户清缓存即丢失，属静默丢数据的业务级缺陷。
// 现在改为服务端落库：KV 键 `subscriber:<小写邮箱>`，值含来源与时间；
// 只有真正写入成功才告诉用户成功，失败则明确报错（不再假成功）。
//
// 隐私：只存邮箱、来源、时间与 Cloudflare 提供的国家码，不存 IP / UA 原文。
// 滥用：同一 IP 每小时最多 10 次提交，超过返回 429（KV 计数器，TTL 1 小时）。

interface Env {
  LINFAIR_KV: KVNamespace
  ADMIN_PASSWORD?: string
  ADMIN_PASSWORD_HASH?: string
}

const LEAKED_HASH = '73073736437356429c9d71236fbd377592d7e2b6c83e758bc80a1b7e1fefb65e'
const PREFIX = 'subscriber:'
const RL_PREFIX = 'sub:rl:'
const RL_LIMIT = 10          // 每 IP 每小时最多提交次数
const RL_TTL = 60 * 60       // 秒
const enc = new TextEncoder()

const jsonHeaders = { 'Content-Type': 'application/json' }

// ── 与 functions/api/auth.ts 保持一致的会话校验（Pages Functions 每文件一路由，故不抽公共模块）
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

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

// ── 邮箱校验：长度上限 254（RFC 5321），只做结构校验，不做 MX 探测
function normalizeEmail(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const email = input.trim().toLowerCase()
  if (email.length < 6 || email.length > 254) return null
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return null
  return email
}

function clientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 'unknown'
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    // 同源站点不需要 CORS；不返回任何 Access-Control 头
    return new Response(null, { status: 204 })
  }

  // ─── GET：管理端读取订阅者列表（需 /api/auth 签发的 token）───
  if (request.method === 'GET') {
    if (isLeaked(env) || !sessionSecret(env)) {
      return new Response(JSON.stringify({ error: 'Admin auth is not configured' }), {
        status: 503, headers: jsonHeaders,
      })
    }
    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/, '')
    if (!token || !(await isValidSession(env, token))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: jsonHeaders })
    }

    const subscribers: any[] = []
    let cursor: string | undefined
    // KV list 单页上限 1000，分页拉全
    do {
      const page = await env.LINFAIR_KV.list({ prefix: PREFIX, cursor, limit: 1000 })
      for (const key of page.keys) {
        const raw = await env.LINFAIR_KV.get(key.name, 'text')
        if (raw) {
          try { subscribers.push(JSON.parse(raw)) } catch { /* 跳过损坏记录 */ }
        }
      }
      cursor = page.list_complete ? undefined : page.cursor
    } while (cursor)

    subscribers.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
    return new Response(JSON.stringify({ count: subscribers.length, subscribers }), {
      status: 200, headers: jsonHeaders,
    })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: jsonHeaders })
  }

  // ─── POST：公开订阅 ───
  try {
    const body: any = await request.json().catch(() => ({}))
    const email = normalizeEmail(body?.email)
    if (!email) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: jsonHeaders })
    }
    const source = typeof body?.source === 'string' && /^[a-z0-9_-]{1,40}$/i.test(body.source) ? body.source : 'unknown'

    // 每 IP 每小时限频
    const ip = clientIp(request)
    const rlKey = `${RL_PREFIX}${ip}:${Math.floor(Date.now() / 3600000)}`
    const used = Number(await env.LINFAIR_KV.get(rlKey, 'text') || '0')
    if (used >= RL_LIMIT) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...jsonHeaders, 'Retry-After': '3600' },
      })
    }
    await env.LINFAIR_KV.put(rlKey, String(used + 1), { expirationTtl: RL_TTL })

    const key = PREFIX + email
    const existing = await env.LINFAIR_KV.get(key, 'text')
    if (existing) {
      // 已订阅：幂等返回成功，不覆盖原始时间，避免被重复提交"刷新"日期
      return new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200, headers: jsonHeaders })
    }

    const cf: any = (request as any).cf || {}
    const record = {
      email,
      source,
      createdAt: new Date().toISOString(),
      country: typeof cf.country === 'string' ? cf.country : undefined,
    }
    await env.LINFAIR_KV.put(key, JSON.stringify(record))

    return new Response(JSON.stringify({ ok: true, duplicate: false }), { status: 200, headers: jsonHeaders })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers: jsonHeaders })
  }
}
