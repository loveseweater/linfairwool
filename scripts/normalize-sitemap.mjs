// 统一 sitemap：非首页 URL 补尾斜杠（与 canonical / og:url / CF Pages 的 200 版本一致），
// 并把本次实际改动过的页面 lastmod 更新为当天。
// 运行：node scripts/normalize-sitemap.mjs [--date YYYY-MM-DD]
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const FILE = path.join(ROOT, 'public', 'sitemap.xml')
const dayArgIdx = process.argv.indexOf('--date')
const TODAY = dayArgIdx > -1 ? process.argv[dayArgIdx + 1] : new Date().toISOString().slice(0, 10)

const xml = fs.readFileSync(FILE, 'utf8')

let urls = 0
let changed = 0
const out = xml.replace(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]*)<\/lastmod>/g, (m, loc, lastmod) => {
  urls++
  let nextLoc = loc
  if (loc !== 'https://linfairwool.cn/' && !/\.[a-z0-9]+$/i.test(loc) && !loc.endsWith('/')) {
    nextLoc = loc + '/'
    changed++
  }
  const nextMod = TODAY
  return `<url><loc>${nextLoc}</loc><lastmod>${nextMod}</lastmod>`
})

fs.writeFileSync(FILE, out)

const locs = [...out.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1])
const noSlash = locs.filter(u => u !== 'https://linfairwool.cn/' && !u.endsWith('/'))
const www = locs.filter(u => /www\.linfairwool/.test(u))
console.log(`urls=${urls} slashAdded=${changed} lastmod=${TODAY}`)
console.log(`noTrailingSlash(remaining)=${noSlash.length} www=${www.length} unique=${new Set(locs).size}`)
console.log('first:', locs.slice(0, 3).join(' , '))
console.log('last :', locs.slice(-3).join(' , '))
