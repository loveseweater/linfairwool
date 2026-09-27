// 生成 public/sitemap.xml —— 静态页 + 全部博客 + 全部产品详情页
// 用法：node _products_work/gen-sitemap.mjs
// 说明：产品与博客数据源为 src/data/products.ts / productsExt.ts，此处用正则解析，
//       避免为一次性脚本引入 TS 运行时依赖。新增产品后重跑本脚本即可。
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const SITE = 'https://linfairwool.cn'
const TODAY = new Date().toISOString().slice(0, 10)

const productsSrc = fs.readFileSync(path.join(ROOT, 'src/data/products.ts'), 'utf-8')
const extSrc = fs.readFileSync(path.join(ROOT, 'src/data/productsExt.ts'), 'utf-8')
const realSrc = fs.readFileSync(path.join(ROOT, 'src/data/productsReal.ts'), 'utf-8')

// ── 采集产品 slug（优先 slug，回退 id）＋ 是否新品（带完整详情）──
const collect = (src) => {
  const out = []
  // 以 { id: '...' 为块起点，向后找到该块内的 slug
  const re = /\{\s*\n\s*id:\s*'([^']+)'([\s\S]*?)(?=\n  \{|\n\]|\n\/\/ ═)/g
  let m
  while ((m = re.exec(src))) {
    const id = m[1]
    const body = m[2]
    const slugMatch = body.match(/slug:\s*'([^']+)'/)
    if (slugMatch) out.push(slugMatch[1])
  }
  return out
}

const productSlugs = [...new Set([...collect(productsSrc), ...collect(extSrc), ...collect(realSrc)])]

// ── 采集博客 id ──
const blogIds = [...new Set([...productsSrc.matchAll(/id:\s*'(blog-\d+)'/g)].map((m) => m[1]))]
  .sort((a, b) => Number(a.replace('blog-', '')) - Number(b.replace('blog-', '')))

const url = (loc, lastmod, priority, changefreq) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`

const HREFLANG = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'zh']
const homeAlternates = HREFLANG.map(
  (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}/" />`
).join('\n')

const parts = []
parts.push(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
${homeAlternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/" />
  </url>`)

parts.push(url(`${SITE}/about`, TODAY, '0.8', 'monthly'))
parts.push(url(`${SITE}/products`, TODAY, '0.9', 'weekly'))

// 产品详情页
for (const slug of productSlugs) {
  parts.push(url(`${SITE}/products/${slug}`, TODAY, '0.8', 'monthly'))
}

// 博客列表
parts.push(url(`${SITE}/blog`, TODAY, '0.8', 'weekly'))

// 博客详情
for (const id of blogIds) {
  parts.push(url(`${SITE}/blog/${id}`, TODAY, '0.7', 'monthly'))
}

parts.push(url(`${SITE}/contact`, TODAY, '0.6', 'monthly'))
parts.push(url(`${SITE}/videos`, TODAY, '0.6', 'monthly'))

const xml = parts.join('\n') + '\n</urlset>\n'
fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml, 'utf-8')

console.log(`[sitemap] written. products=${productSlugs.length} blogs=${blogIds.length} totalUrls=${parts.length}`)
console.log(`[sitemap] product slugs:\n  ${productSlugs.join('\n  ')}`)
