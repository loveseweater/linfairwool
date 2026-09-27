// 追加替换 3 张错配博客封面
//
// 问题：
//   cover-pilling-fabric.jpg  — 夜景豪宅泳池（应为毛衣起球特写）→ blog-20
//   cover-capsule-wardrobe.jpg — 尼龙飞行员夹克（应为针织胶囊衣橱）→ blog-15
//   cover-knitwear-stack.jpg  — 带第三方 'urbane' 吊牌的毛线帽（应无品牌）→ 4 篇
//
// 用法: node _products_work/gen-covers2.mjs
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const OUT = path.join(ROOT, '_products_work/covers_raw2')
fs.mkdirSync(OUT, { recursive: true })

const PORT = 8765
const TIMEOUT_MS = 900000
const SIZE = '1024x1024'

const NEG = 'absolutely no text, no letters, no words, no numbers, no captions, no labels, no hangtags, ' +
  'no logos, no brand marks, no watermarks, no signatures, no sparkle icon, no stars, no packaging print'

const STYLE = 'clean professional editorial photograph, soft natural light, shallow depth of field, ' +
  'warm neutral palette, premium quality, high detail'

const COVERS = [
  {
    file: 'cover-pilling-fabric.png',
    // blog-20 毛衣起球成因与处理
    prompt: `Extreme close-up macro of a wool knit sweater surface showing fibre pills and small fuzz balls ` +
      `clustered along a worn area, individual loose fibres catching raking side light, ` +
      `the knit structure still visible beneath the pilling, neutral oatmeal colour, ` +
      `shallow depth of field so the pills are sharply focused, ${STYLE}, ${NEG}`,
  },
  {
    file: 'cover-capsule-wardrobe.png',
    // blog-15 秋季针织胶囊衣橱：5 件 15 套
    prompt: `Flat lay of a coordinated autumn knitwear capsule wardrobe: five folded knit pieces arranged in a neat grid — ` +
      `a cream cable sweater, a camel crewneck, a charcoal cardigan, a fine grey knit top and a rust knit scarf, ` +
      `folded neatly side by side on a pale linen surface, ` +
      `no mannequin, no hands, no tags, ${STYLE}, ${NEG}`,
  },
  {
    file: 'cover-knitwear-stack.png',
    // blog-5/9/12/25 针织趋势与选购（需无品牌吊牌）
    prompt: `A tidy stack of folded knitted beanies and sweaters in soft autumn tones — oatmeal, camel, charcoal and dusty rose — ` +
      `arranged on a pale grey concrete surface, ribbed cuffs and cable textures clearly visible, ` +
      `one small potted succulent beside the stack, ` +
      `plain unlabelled garments with no tags visible, ${STYLE}, ${NEG}`,
  },
]

function ensureService() {
  try {
    execFileSync('powershell', ['-NoProfile', '-Command',
      "& 'C:\\Users\\lds20\\AppData\\Local\\ApiCodexOneClick\\tools\\ensure-image-service.ps1'"],
      { stdio: 'ignore', timeout: 60000 })
  } catch (e) { console.warn('ensure-image-service:', e.message) }
}

async function gen(task, attempt = 1) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: task.prompt,
        referenceImages: [],
        outputDir: OUT,
        size: SIZE,
        fileName: task.file,
        timeoutMs: TIMEOUT_MS,
      }),
      signal: controller.signal,
    })
    const json = await res.json()
    if (!json.ok) throw new Error(String(json.error || 'unknown'))
    console.log('OK  ', task.file)
    return true
  } catch (e) {
    if (attempt < 3) {
      console.warn(`RETRY(${attempt}) ${task.file}: ${e.message}`)
      await new Promise((r) => setTimeout(r, 5000 * attempt))
      return gen(task, attempt + 1)
    }
    console.error('FAIL', task.file, e.message)
    return false
  } finally {
    clearTimeout(timer)
  }
}

ensureService()
const results = []
for (const c of COVERS) results.push([c.file, await gen(c)])
console.log('\n=== 汇总 ===')
results.forEach(([f, ok]) => console.log(ok ? '✔' : '✘', f))
