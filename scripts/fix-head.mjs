// 一次性修补已提交的预渲染 HTML head 元信息（2026-11-13）
// 问题：所有内页的 og:url 都指向 https://linfairwool.cn/，og:title/og:description
// 也是首页通用文案；hreflang 也在每页都指向首页。社交分享与搜索引擎看到的
// 都是"首页"，页面自身的标题/摘要完全没生效。
// 本脚本按页面自身已有的 <title> / meta description / canonical 重写 OG 与
// Twitter 卡片，并把 canonical 统一为带尾斜杠的 200 URL（无斜杠会 308 一跳）。
//
// 运行：node scripts/fix-head.mjs          干跑，只打印不写
//      node scripts/fix-head.mjs --write   实际写入
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const SITE = 'https://linfairwool.cn'
const WRITE = process.argv.includes('--write')

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const p = path.join(dir, e.name)
    if (e.name === 'admin') continue          // 后台是 noindex，不需要 OG
    walk(p, acc)
    if (fs.existsSync(path.join(p, 'index.html'))) acc.push(p)
  }
  return acc
}

const escAttr = (s) => s.replace(/&(?!#?\w+;)/g, '&amp;').replace(/"/g, '&quot;')

// ── 长度裁剪（2026-11-13 第二批）：SERP 展示 title≈60ch / description≈160ch ──
const decodeEnt = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
const encodeEnt = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// 按词边界截断，去掉结尾残标点，避免半截实体
function trimSeg(s, max) {
  if (s.length <= max) return s
  let c = s.slice(0, max)
  const sp = c.lastIndexOf(' ')
  if (sp > max * 0.5) c = c.slice(0, sp)
  return c.replace(/[\s,;:.\-–—&/|]+$/, '')
}
// title：按 " | " 分段贪心拼接；放不下的最后一段截词而非整个丢弃
function capTitle(raw, max = 60) {
  const dec = decodeEnt(raw)
  if (dec.length <= max) return raw
  const segs = dec.split(' | ')
  let out = segs[0]
  for (let i = 1; i < segs.length; i++) {
    const cand = out + ' | ' + segs[i]
    if (cand.length <= max) { out = cand; continue }
    const room = max - out.length - 3
    if (room >= 15 && i === segs.length - 1) out = out + ' | ' + trimSeg(segs[i], room)
    break
  }
  return encodeEnt(trimSeg(out, max))
}
// description：整体词边界截断
function capDesc(raw, max = 160) {
  const dec = decodeEnt(raw)
  if (dec.length <= max) return raw
  return encodeEnt(trimSeg(dec, max))
}

function expectedUrl(route) {
  if (route === '/') return SITE + '/'
  return SITE + route + '/'
}

function pageType(route) {
  if (/^\/blog\/blog-\d+$/.test(route)) return 'article'
  if (/^\/products\/.+/.test(route)) return 'product'
  return 'website'
}

const dirs = walk(PUBLIC)
const rows = []
let changedCount = 0

for (const dir of dirs) {
  const file = path.join(dir, 'index.html')
  const route = '/' + path.relative(PUBLIC, dir).split(path.sep).join('/')
  let html = fs.readFileSync(file, 'utf8')
  const before = html

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1]
  if (!title || !desc) {
    rows.push({ route, note: 'SKIP 缺少 title/description' })
    continue
  }

  const url = expectedUrl(route)
  const type = pageType(route)
  const titleCapped = capTitle(title)
  const descCapped = capDesc(desc)

  // title / description 超长则就地重写（SERP 只展示前 60/160 字符）
  if (titleCapped !== title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleCapped}</title>`)
  }
  if (descCapped !== desc) {
    html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${descCapped}"`)
  }
  const titleUse = titleCapped
  const descUse = descCapped

  const ogImage = (html.match(/"image":\s*"(https:\/\/linfairwool\.cn\/[^"]+\.(?:jpg|jpeg|png|webp))"/) || [])[1]
    || (html.match(/<meta property="og:image" content="([^"]*)"/) || [])[1]

  const setLink = (rel, href) => {
    html = html.replace(new RegExp(`<link rel="${rel}" href="[^"]*">`), `<link rel="${rel}" href="${href}">`)
  }
  const setMeta = (key, attr, value) => {
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`)
    if (re.test(html)) html = html.replace(re, `<meta ${attr}="${key}" content="${escAttr(value)}">`)
    return re.test(html)
  }

  setLink('canonical', url)
  setMeta('og:title', 'property', titleUse)
  setMeta('og:description', 'property', descUse)
  setMeta('og:url', 'property', url)
  setMeta('og:type', 'property', type)
  if (ogImage) setMeta('og:image', 'property', ogImage)
  setMeta('twitter:title', 'name', titleUse)
  setMeta('twitter:description', 'name', descUse)
  if (ogImage) setMeta('twitter:image', 'name', ogImage)

  // hreflang 只在首页有意义；内页保留会把每页都声明成首页语言版本
  if (route !== '/') {
    html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '')
  }

  if (html !== before) {
    changedCount++
    if (WRITE) fs.writeFileSync(file, html)
  }

  const canonicalNow = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]
  rows.push({
    route,
    canonical: canonicalNow,
    ok: canonicalNow === url,
    og: (html.match(/<meta property="og:url" content="([^"]*)"/) || [])[1],
    type,
  })
}

const bad = rows.filter(r => r.ok === false)

// ── 首页（prerender-home.html，构建时注入 dist/index.html）同样做长度裁剪 ──
{
  const file = path.join(ROOT, 'prerender-home.html')
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8')
    const before = html
    const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1]
    if (title && desc) {
      const titleCapped = capTitle(title)
      const descCapped = capDesc(desc)
      if (titleCapped !== title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleCapped}</title>`)
      if (descCapped !== desc) html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${descCapped}"`)
      html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escAttr(titleCapped)}">`)
      html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escAttr(descCapped)}">`)
      html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escAttr(titleCapped)}">`)
      html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escAttr(descCapped)}">`)
      if (html !== before && WRITE) fs.writeFileSync(file, html)
      if (titleCapped !== title || descCapped !== desc) changedCount++
      rows.push({ route: '/(prerender-home)', title: titleCapped.length + 'ch', desc: descCapped.length + 'ch' })
    }
  }
}

console.log(`pages=${rows.length} changed=${changedCount} write=${WRITE}`)
rows.slice(0, 6).forEach(r => console.log(' ', r.route, '|', r.canonical, '|', r.type, r.ok === false ? '❌' : ''))
if (bad.length) {
  console.log('\n❌ canonical 不一致：')
  bad.forEach(r => console.log('  ', r.route, '->', r.canonical))
} else {
  console.log('\n✅ 所有页面 canonical 均自指（带斜杠 200 版本）')
}
