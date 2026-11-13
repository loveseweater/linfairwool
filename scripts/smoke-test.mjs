// 本地冒烟测试：静态服务 dist 后用真实浏览器抽查关键页面
// 检查：console 错误、标题、canonical、H1 文本、水合后交互（语言切换/导航）
import { createRequire } from 'module'
const require2 = createRequire(import.meta.url)
const puppeteer = require2('puppeteer-core')
import http from 'http'
import fs from 'fs'
import path from 'path'

const DIST = path.join(import.meta.dirname, '..', 'dist')
const PORT = 8801
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.md': 'text/markdown' }

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p === '/') p = '/index.html'
  let f = path.join(DIST, p)
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(f, 'index.html')
  if (!fs.existsSync(f)) { res.writeHead(404); res.end('nf'); return }
  res.writeHead(200, { 'Content-Type': mime[path.extname(f).toLowerCase()] || 'application/octet-stream' })
  res.end(fs.readFileSync(f))
})
await new Promise(r => server.listen(PORT, r))

const browser = await puppeteer.launch({
  executablePath: (process.env.LOCALAPPDATA || 'C:/Users/lds20/AppData/Local') + '/ms-playwright/chromium-1208/chrome-win64/chrome.exe',
  headless: true, args: ['--no-sandbox'],
})
const page = await browser.newPage()
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)) })
page.on('pageerror', e => errors.push('PAGEERROR ' + String(e).slice(0, 120)))

const checks = [
  { url: '/', title: 'LINFAIR | Premium Knitwear Manufacturer', expect: '首页' },
  { url: '/blog/blog-1/', title: 'Why Choose a Chinese Knitwear Manufacturer', expect: '文章页' },
  { url: '/contact/', title: 'Contact Us | LINFAIR', expect: '联系页' },
  { url: '/products/cable-knit-crewneck-sweater/', title: 'Cable Knit Crewneck', expect: '商品页' },
  { url: '/admin/', title: 'Admin | LINFAIR', expect: '后台' },
]

for (const c of checks) {
  const errsBefore = errors.length
  await page.goto(`http://127.0.0.1:${PORT}${c.url}`, { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1200))
  const info = await page.evaluate(() => ({
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    h1: document.querySelector('h1')?.textContent?.trim().slice(0, 60) || null,
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || null,
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
    bodyLen: document.body.innerText.length,
  }))
  const pageErrors = errors.slice(errsBefore)
  console.log(`--- ${c.url} (${c.expect})`)
  console.log('   title   :', info.title.slice(0, 60))
  console.log('   canonical:', info.canonical, info.canonical === `https://linfairwool.cn${c.url === '/' ? '/' : c.url}` ? '✓' : '(local-vs-prod diff, 见备注)')
  console.log('   h1      :', info.h1)
  console.log('   ogUrl   :', info.ogUrl, '| ogImage:', (info.ogImage || '').slice(-40))
  console.log('   body    :', info.bodyLen, 'chars | console errors:', pageErrors.length ? pageErrors : '0')
}

// 交互冒烟：从首页点击导航到 Blog（验证水合与路由正常）
await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 800))
const clicked = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find(x => x.getAttribute('href') === '/blog' || x.getAttribute('href') === '/blog/')
  if (a) { a.click(); return true }
  return false
})
await new Promise(r => setTimeout(r, 1500))
const afterNav = await page.evaluate(() => ({ url: location.pathname, h1: document.querySelector('h1')?.textContent?.trim().slice(0, 50) }))
console.log('--- SPA 导航点击 /blog ->', JSON.stringify(afterNav), clicked ? '' : '(未找到链接)')

await browser.close()
server.close()
