// 检测 AI 星标水印（白色四角星）—— 特征：局部背景为暗/中调时，中心存在高亮白块，
// 且该白块是"孤立"的（不是大面积高亮背景的一部分）。
// 关键改进：对每个像素算 3x3 邻域反差，星标中心反差极大且形状比接近 1:1。
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const BASE = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool/public/images'
const TMP = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool/_products_work/_wm2'
fs.mkdirSync(TMP, { recursive: true })

const CW = 240, CH = 160
const files = fs.readdirSync(BASE).filter((f) => /\.(jpg|jpeg|png)$/i.test(f) && !f.startsWith('.'))

function scan(file) {
  const src = path.join(BASE, file)
  const raw = path.join(TMP, 'y.rgb')
  // 右下角 28% x 20%
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
      '-vf', `crop=iw*0.28:ih*0.20:iw*0.72:ih*0.80,scale=${CW}:${CH}`,
      '-f', 'rawvideo', '-pix_fmt', 'rgb24', raw], { stdio: 'pipe' })
  } catch { return null }
  const b = fs.readFileSync(raw)
  if (b.length < CW * CH * 3) return null

  const lum = new Float32Array(CW * CH)
  for (let i = 0; i < CW * CH; i++) {
    lum[i] = 0.299 * b[i*3] + 0.587 * b[i*3+1] + 0.114 * b[i*3+2]
  }
  // 局部反差：像素亮度 - 环邻域中位数亮度
  let best = { contrast: 0, x: 0, y: 0 }
  for (let y = 3; y < CH - 3; y++) {
    for (let x = 3; x < CW - 3; x++) {
      const c = lum[y * CW + x]
      if (c < 235) continue                    // 必须是高亮
      const neigh = []
      for (const [dx, dy] of [[-3,0],[3,0],[0,-3],[0,3],[-3,-3],[3,3],[3,-3],[-3,3]]) {
        neigh.push(lum[(y+dy) * CW + (x+dx)])
      }
      neigh.sort((p,q)=>p-q)
      const med = neigh[4]
      const contrast = c - med
      if (contrast > best.contrast) best = { contrast, x, y }
    }
  }
  return best
}

const out = []
for (const f of files.sort()) {
  const r = scan(f)
  if (!r) { out.push({ f, err: 1 }); continue }
  if (r.contrast > 45) out.push({ f, contrast: Math.round(r.contrast), at: `${r.x},${r.y}` })
}

const hits = out.filter(o => !o.err)
console.log('=== 右下角检测到高反差白色孤立块（疑似星标）===')
for (const h of hits) console.log(`  contrast=${String(h.contrast).padStart(4)}  @${h.at}  ${h.f}`)
console.log(`\n扫描 ${files.length} 张 | 命中 ${hits.length} 张`)
fs.writeFileSync('_products_work/wm-hits.json', JSON.stringify(hits, null, 2))
