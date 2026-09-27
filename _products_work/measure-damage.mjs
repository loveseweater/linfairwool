// 量化 JPEG 可见损坏比例
// 原理：文件名看"绿色乱码"区域 —— 损坏区块解码为高饱和度的绿/品红色块，
//       正常照片里几乎不会出现这种色相，可据此估算损坏面积占比。
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const IMG = path.join(ROOT, 'public/images')

const SERIES = ['6006', '6007', '6008', '6009', '6034', 'kk222', 'kk968', 'kk976']
const files = fs.readdirSync(IMG)
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  .filter((f) => SERIES.some((s) => f.startsWith(s)))
  .sort()

const CW = 160, CH = 200

function analyze(f) {
  const p = path.join(IMG, f)
  const r = spawnSync('ffmpeg', ['-v', 'quiet', '-i', p,
    '-vf', `scale=${CW}:${CH}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024, timeout: 60000 })
  const b = r.stdout
  if (!b || b.length < CW * CH * 3) return null

  let bad = 0
  for (let i = 0; i < CW * CH; i++) {
    const R = b[i * 3], G = b[i * 3 + 1], B = b[i * 3 + 2]
    // 绿色乱码：G 明显高于 R 和 B，且饱和度高
    const isGreen = G > R + 40 && G > B + 40
    if (isGreen) bad++
  }
  return { badPct: (bad / (CW * CH)) * 100 }
}

const rows = []
for (const f of files) {
  const a = analyze(f)
  rows.push({ f, ...(a || { badPct: -1 }) })
}

rows.sort((x, y) => y.badPct - x.badPct)

console.log('文件'.padEnd(52), '绿色乱码占比')
console.log('-'.repeat(72))
for (const r of rows) {
  const pct = r.badPct < 0 ? 'N/A' : `${r.badPct.toFixed(1)}%`
  const flag = r.badPct > 0.5 ? '  ← 可见损坏' : ''
  console.log(r.f.padEnd(52), String(pct).padEnd(12), flag)
}
console.log('-'.repeat(72))
const visible = rows.filter((r) => r.badPct > 0.5)
console.log(`总计 ${rows.length} 张 | 可见损坏 ${visible.length} 张`)
