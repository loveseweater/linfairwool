// 检测产品图右下角是否有 AI 生成器的白色星标水印
// 方法：裁右下角区域 → 转 raw RGB → 统计"高亮且与局部背景反差大"的连通白块
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const BASE = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool/public/images'
const TMP = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool/_products_work/_wm'

fs.mkdirSync(TMP, { recursive: true })

const files = fs.readdirSync(BASE).filter((f) => /\.(jpg|jpeg|png)$/i.test(f) && !f.startsWith('.'))

const CW = 220, CH = 140  // 采样区域尺寸

function analyze(file) {
  const src = path.join(BASE, file)
  const raw = path.join(TMP, 'x.rgb')
  // 取右下角 22% x 16% 区域，缩放到固定尺寸
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
      '-vf', `crop=iw*0.25:ih*0.18:iw*0.75:ih*0.82,scale=${CW}:${CH}`,
      '-f', 'rawvideo', '-pix_fmt', 'rgb24', raw], { stdio: 'pipe' })
  } catch { return null }
  const buf = fs.readFileSync(raw)
  if (buf.length < CW * CH * 3) return null

  // 逐像素：找"亮"像素（所有通道 >230）
  let bright = 0
  const mask = new Uint8Array(CW * CH)
  for (let i = 0; i < CW * CH; i++) {
    const r = buf[i * 3], g = buf[i * 3 + 1], b = buf[i * 3 + 2]
    if (r > 232 && g > 232 && b > 232) { mask[i] = 1; bright++ }
  }
  // 找最大连通亮块
  const seen = new Uint8Array(CW * CH)
  let maxBlob = 0
  for (let i = 0; i < CW * CH; i++) {
    if (!mask[i] || seen[i]) continue
    let n = 0
    const stack = [i]
    seen[i] = 1
    while (stack.length) {
      const p = stack.pop(); n++
      const x = p % CW, y = (p / CW) | 0
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) {
        const nx = x + dx, ny = y + dy
        if (nx < 0 || ny < 0 || nx >= CW || ny >= CH) continue
        const q = ny * CW + nx
        if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q) }
      }
    }
    if (n > maxBlob) maxBlob = n
  }
  return { bright, total: CW * CH, maxBlob }
}

const results = []
for (const f of files.sort()) {
  const r = analyze(f)
  if (!r) { results.push({ f, err: true }); continue }
  // 星标特征：区域里存在一个中等大小的独立白块（约占区域 1.5%~12%）
  const ratio = r.maxBlob / r.total
  results.push({ f, blob: r.maxBlob, ratio, brightRatio: r.bright / r.total })
}

const suspicious = results.filter((r) => !r.err && r.ratio > 0.012 && r.ratio < 0.15 && r.brightRatio < 0.5)
console.log('=== 疑似带星标水印（右下角独立白色块）===')
for (const s of suspicious) {
  console.log(`  blob=${String(s.blob).padStart(5)} ratio=${(s.ratio * 100).toFixed(2)}%  ${s.f}`)
}
console.log(`\n扫描 ${results.length} 张，疑似 ${suspicious.length} 张`)
fs.writeFileSync(path.join(TMP, '..', 'wm-suspect.json'), JSON.stringify(suspicious, null, 2))
