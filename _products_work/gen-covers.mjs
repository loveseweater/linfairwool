// 替换 5 张内容不当的博客封面
//
// 问题清单（已人工确认）：
//   cover-factory-knitting.jpg — 健身房仰卧起坐女性 + Nike 商标（应为针织工厂/OEM 主题）
//   cover-knit-detail.jpg      — Levi's 牛仔裤吊牌梭织平铺（应为针织短袖上衣）
//   cover-knit-fabric.jpg      — 厨房做饭的男女（应为针织面料特写）
//   cover-quality-check.jpg    — 红色碎花夏裙（应为针织质检场景）
//   cover-winter-knit.jpg      — 海滩百褶裙（应为冬季保暖针织）
//
// 统一约束：no text / no logo / no watermark / no brand marks / no person's face
//
// 用法: node _products_work/gen-covers.mjs
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const OUT = path.join(ROOT, '_products_work/covers_raw')
fs.mkdirSync(OUT, { recursive: true })

const PORT = 8765
const TIMEOUT_MS = 900000
const SIZE = '1024x1024'

const NEG = 'absolutely no text, no letters, no words, no numbers, no captions, no labels, no logos, ' +
  'no brand marks, no watermarks, no signatures, no sparkle icon, no stars, no signage, no packaging print'

const STYLE = 'clean professional editorial photograph, soft natural light, shallow depth of field, ' +
  'warm neutral palette, premium quality, high detail'

const COVERS = [
  {
    file: 'cover-factory-knitting.jpg',
    // blog-3 OEM vs ODM —— 针织工厂生产场景
    prompt: `Interior of a modern knitwear factory: a long row of computerized flat knitting machines in a clean bright production hall, ` +
      `cones of yarn on creels above the machines, freshly knitted sweater panels emerging from the machine bed, ` +
      `polished floor, industrial ceiling lights, no workers visible, ${STYLE}, ${NEG}`,
  },
  {
    file: 'cover-knit-detail.jpg',
    // blog-19 短袖针织上衣
    prompt: `Overhead flat lay of a single women's fine-gauge short-sleeve knit top in soft oatmeal cream, ` +
      `neatly arranged on a pale linen surface, ribbed crewneck and sleeve edges clearly visible, cotton-knit texture in sharp detail, ` +
      `one small sprig of dried eucalyptus as the only prop, ${STYLE}, ${NEG}`,
  },
  {
    file: 'cover-knit-fabric.jpg',
    // blog-1/8/10/22/27 针织面料与制造
    prompt: `Extreme close-up macro of premium knit fabric: interlocking wool stitches in oatmeal and camel tones filling the frame, ` +
      `visible yarn ply and stitch structure, soft raking side light revealing the three-dimensional texture, ` +
      `shallow depth of field, ${STYLE}, ${NEG}`,
  },
  {
    file: 'cover-quality-check.jpg',
    // blog-4 针织质检
    prompt: `Knitwear quality inspection scene: a folded cream wool sweater on a clean light table with a wooden-handled measuring tape ` +
      `and a small stainless steel ruler laid beside it, a metal needle gauge resting on the knit surface, ` +
      `bright even overhead light, no hands, no people, ${STYLE}, ${NEG}`,
  },
  {
    file: 'cover-winter-knit.jpg',
    // blog-16 冬季保暖针织
    prompt: `Cosy winter knitwear still life: a chunky cream cable-knit sweater folded in a soft stack with a matching ribbed beanie ` +
      `and a pair of knitted gloves arranged beside it, on a pale grey surface, soft window light falling from the left, ` +
      `warm inviting mood, no people, ${STYLE}, ${NEG}`,
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
  const dest = path.join(OUT, task.file)
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
    console.log('OK  ', task.file, fs.statSync(dest).size, 'bytes')
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
