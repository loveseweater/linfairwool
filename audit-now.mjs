// LINFAIR 全站复检（68 URL）— 安全约束：仅 http/https；host 校验拒绝内网；XML 拒绝 DOCTYPE/ENTITY
import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'https://linfairwool.cn'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
const MUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
function assertHost(u) {
  const x = new URL(u)
  if (x.protocol !== 'http:' && x.protocol !== 'https:') throw new Error('protocol_not_allowed:' + x.protocol)
  if (/^(localhost$|localhost\.|.*\.local$|.*\.internal$|127\.|0\.0\.0\.0$|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?$|fd[0-9a-f]{2}:|fe80:)/i.test(x.hostname)) throw new Error('private_or_reserved_host:' + x.hostname)
}
function safeLocs(x) { if (/<!DOCTYPE|<!ENTITY/i.test(x)) throw new Error('xml_doctype_rejected'); return [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]) }
assertHost(BASE)
const o = { www: null, home: null, robots: null, sitemap: null, dead: [], canon: [], wwwRefs: [], descDup: 0, titleDup: 0, spot: {}, sec: null, mobile: null, perf: null, imgBroken: [], pages: 0 }
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] })

// www 跳转
{
  const p = await b.newPage(); await p.setUserAgent(UA)
  try { assertHost('https://www.linfairwool.cn/'); const r = await p.goto('https://www.linfairwool.cn/', { waitUntil: 'domcontentloaded', timeout: 45000 }); o.www = { final: p.url(), status: r ? r.status() : null, toApex: p.url().startsWith('https://linfairwool.cn') } } catch (e) { o.www = { error: e.message.slice(0, 60) } }
  await p.close()
}
const page = await b.newPage(); await page.setUserAgent(UA); await page.setViewport({ width: 1280, height: 900 })
assertHost(BASE)
// 记录破图
page.on('requestfailed', req => { if (/image/i.test(req.resourceType())) o.imgBroken.push(req.url().slice(0, 100)) })
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 45000 })
o.home = await page.evaluate(async () => { const r = await fetch(location.href, { cache: 'no-store' }); const h = await r.text(); return { status: r.status, mixed: [...h.matchAll(/(?:src|href)="(http:\/\/[^"]+)"/g)].length, isWww: h.includes('www.linfairwool.cn') } })
// robots + sitemap
{
  const rb = await page.evaluate(async () => (await fetch('/robots.txt', { cache: 'no-store' })).text())
  const sm = await page.evaluate(async () => (await fetch('/sitemap.xml', { cache: 'no-store' })).text())
  let locs = [], err = null; try { locs = safeLocs(sm) } catch (e) { err = e.message }
  o.robots = { sitemap: (rb.match(/Sitemap:\s*(\S+)/) || [])[1] || null, www: /www\.linfairwool/.test(rb) }
  o.sitemap = { n: locs.length, hosts: [...new Set(locs.map(u => { try { return new URL(u).host } catch { return 'BAD' } }))], www: locs.some(u => u.includes('www.linfairwool')), err }
  globalThis.__l = locs
}
// 全页扫描
const locs = globalThis.__l || []
const seenD = new Set(), seenT = new Set()
for (const url of locs) {
  try {
    assertHost(url)
    const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); const st = r ? r.status() : null
    if (st >= 400) { o.dead.push({ url, st }); continue }
    const m = await page.evaluate(() => ({ c: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null, d: document.querySelector('meta[name="description"]')?.getAttribute('content') || null, t: document.title }))
    const up = url.replace(BASE, '') || '/', cp = (m.c || '').replace(BASE, '') || '/'
    if (!m.c || cp !== up) o.canon.push({ url, c: m.c })
    if (m.c && m.c.includes('www.linfairwool')) o.wwwRefs.push(url)
    if (m.d) { if (seenD.has(m.d)) o.descDup++; seenD.add(m.d) }
    if (m.t) { if (seenT.has(m.t)) o.titleDup++; seenT.add(m.t) }
    o.pages++
  } catch (e) { o.dead.push({ url, e: e.message.slice(0, 40) }) }
}
// 抽查（含最新一篇 blog-62）
for (const id of ['blog-1', 'blog-20', 'blog-62']) {
  try { const u = `${BASE}/blog/${id}`; assertHost(u); const r = await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 30000 })
    const ld = await page.evaluate(() => { const s = document.querySelector('script#blogpost-jsonld')?.textContent; if (!s) return null; try { const j = JSON.parse(s); const f = j['@graph'].find(x => x['@type'] === 'FAQPage'); return { types: j['@graph'].map(x => x['@type']).join('+'), faq: f ? f.mainEntity.length : 0 } } catch { return 'BAD' } })
    o.spot[id] = { s: r ? r.status() : null, t: (await page.title()).slice(0, 40), c: await page.$eval('link[rel="canonical"]', e => e.getAttribute('href')).catch(() => null), ld }
  } catch (e) { o.spot[id] = { e: e.message.slice(0, 40) } }
}
// 安全头
{
  const p = await b.newPage(); await p.setUserAgent(UA); assertHost(BASE)
  const r = await p.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 45000 }); const h = r.headers()
  o.sec = { csp: h['content-security-policy'] ? 'ENFORCED' : (h['content-security-policy-report-only'] ? 'RO' : null), hsts: !!h['strict-transport-security'], xfo: h['x-frame-options'] || null, xcto: !!h['x-content-type-options'], rp: !!h['referrer-policy'], pp: !!h['permissions-policy'] }
  await p.close()
}
// 移动端
{
  const p = await b.newPage(); await p.setUserAgent(MUA); await p.setViewport({ width: 375, height: 812 }); assertHost(BASE)
  await p.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 }); await new Promise(r => setTimeout(r, 2000))
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await new Promise(r => setTimeout(r, 1200))
  await p.evaluate(() => window.scrollTo(0, 0)); await new Promise(r => setTimeout(r, 600))
  o.mobile = await p.evaluate(() => { window.scrollTo(9999, 0); const sx = scrollX; window.scrollTo(0, 0); return { vw: innerWidth, scrollW: document.documentElement.scrollWidth, canScroll: sx > 0 } })
  await p.close()
}
// 性能 + 资源体积
{
  const p = await b.newPage(); await p.setUserAgent(UA); await p.setViewport({ width: 1280, height: 900 }); assertHost(BASE)
  await p.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 })
  o.perf = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0] || {}; const rs = performance.getEntriesByType('resource'); let t = 0; const big = []; rs.forEach(e => { const s = e.transferSize || e.encodedBodySize || 0; t += s; if (/\.(png|jpe?g|webp|gif)(\?|$)/i.test(e.name) && s > 204800) big.push({ u: e.name.replace('https://linfairwool.cn', ''), s }) }); return { html: n.transferSize || n.encodedBodySize || 0, ttfb: Math.round(n.responseStart || 0), load: Math.round(n.loadEventEnd || 0), total: t, big } })
  await p.close()
}
console.log(JSON.stringify(o, null, 2))
await b.close()
