// LINFAIR 独立站 SPA 预渲染脚本
// 用 puppeteer-core + 本机 Chrome 渲染所有路由，生成静态 HTML 到 dist/<route>/index.html
// 运行：node prerender.mjs
import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = 8799
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

// 从 sitemap 读取所有路由
const sitemap = fs.readFileSync(path.join(__dirname, 'public', 'sitemap.xml'), 'utf-8')
const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.linfairwool\.cn([^<]*)<\/loc>/g)].map((m) => m[1])
console.log('total routes:', routes.length)

// 启动静态服务器（SPA fallback 到 index.html）
const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2', '.gif': 'image/gif',
}
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (urlPath === '/') urlPath = '/index.html'
  let filePath = path.join(DIST, urlPath)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html')
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('404'); return }
    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
    res.end(data)
  })
})
await new Promise((r) => server.listen(PORT, r))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})

let ok = 0, fail = 0
for (const route of routes) {
  const url = `http://127.0.0.1:${PORT}${route}`
  const page = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    // 等待动画/字体/懒加载完成
    await new Promise((r) => setTimeout(r, 1800))
    const html = await page.content()
    const outPath = path.join(DIST, route === '/' ? '' : route, 'index.html')
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, html)
    ok++
    console.log('OK  ', route, '->', html.length, 'bytes')
  } catch (e) {
    fail++
    console.log('FAIL', route, e.message)
  }
  await page.close()
}

await browser.close()
server.close()

// 将预渲染 HTML 同步到 public/（作为构建源，供 Cloudflare Pages 云端构建复制进 dist）
// 注意：仅排除根目录 index.html（首页，vite 会与项目根 index.html 冲突），首页暂保持 SPA 空壳
// 内联 CSS：消除渲染阻塞的 index.css 请求（index.css 无 url() 引用，可安全内联）
const inlineCss = (html) => {
  const cssPath = path.join(DIST, 'assets', 'index.css')
  if (!fs.existsSync(cssPath)) return html
  const css = fs.readFileSync(cssPath, 'utf-8')
  let out = html.replace(
    /<link rel="stylesheet"[^>]*href="\/assets\/index\.css"[^>]*>/,
    `<style>\n${css}\n</style>`
  )
  // 修复：预渲染后 Google Fonts 的 onload 已把 rel 改为 stylesheet（渲染阻塞）。
  // 删除所有 fonts.googleapis 的 CSS link（含 stylesheet/preload/noscript），统一重插为异步 preload + noscript
  out = out.replace(
    /<link rel="(?:stylesheet|preload)"[^>]*href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>/g,
    ''
  )
  out = out.replace(/<noscript><link[^>]*fonts\.googleapis[^>]*><\/noscript>/g, '')
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap'
  out = out.replace(
    /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>/,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="${FONT_URL}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${FONT_URL}"></noscript>`
  )
  return out
}
let copied = 0
function syncToPublic(dir) {
  const absDir = path.join(DIST, dir)
  if (!fs.existsSync(absDir)) return
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      syncToPublic(rel)
    } else if (!(dir === '' && entry.name === 'index.html')) {
      const dst = path.join(__dirname, 'public', rel)
      fs.mkdirSync(path.dirname(dst), { recursive: true })
      let content = fs.readFileSync(path.join(absDir, entry.name))
      if (entry.name.endsWith('.html')) content = Buffer.from(inlineCss(content.toString('utf-8')), 'utf-8')
      fs.writeFileSync(dst, content)
      copied++
    }
  }
}
for (const sub of ['about', 'products', 'contact', 'blog', 'videos']) {
  syncToPublic(sub)
}
console.log(`PUBLIC sync done. copied files: ${copied}`)

// 同步首页预渲染（供 vite.config.ts 的 injectPrerenderedHome 插件在构建时注入），同样内联 CSS
const homePre = path.join(__dirname, 'prerender-home.html')
const homeContent = inlineCss(fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8'))
fs.writeFileSync(homePre, homeContent, 'utf-8')
console.log(`HOME prerender synced -> prerender-home.html (${fs.statSync(homePre).size} bytes, CSS inlined)`)
console.log(`\nDONE. ok=${ok} fail=${fail}`)
