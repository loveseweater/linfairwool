// 把一组图片拼成网格总览图，便于快速核对内容
// 用法: node _products_work/montage.mjs <输出名> <列数> <图1> [图2 ...]
// 图名可省略 .jpg 后缀（默认在 public/images/ 下查找）
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const SRC = path.join(ROOT, 'public/images')
const TMP = path.join(ROOT, '_products_work/_montage')
fs.mkdirSync(TMP, { recursive: true })

const [outName, colsArg, ...names] = process.argv.slice(2)
const cols = Number(colsArg) || 5
if (!outName || !names.length) {
  console.error('usage: node montage.mjs <outName> <cols> <img1> [img2 ...]')
  process.exit(1)
}

// 先逐个规范化为统一尺寸（避免 concat+tile 在尺寸不一时只输出一格）
const CW = 320, CH = 400
const norm = []
for (const n of names) {
  const candidates = [
    path.join(SRC, n),
    path.join(SRC, `${n}.jpg`),
    path.join(SRC, `${n}.png`),
  ]
  const src = candidates.find((p) => fs.existsSync(p))
  if (!src) { console.warn('skip missing:', n); continue }
  const base = path.basename(src).replace(/\.[a-z]+$/i, '')
  const dst = path.join(TMP, `${base}.png`)
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
    '-vf', `scale=${CW}:${CH}:force_original_aspect_ratio=decrease,pad=${CW}:${CH}:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1`,
    '-frames:v', '1', '-update', '1', dst], { stdio: 'pipe' })
  norm.push(dst)
}

if (!norm.length) { console.error('no images'); process.exit(1) }

const rows = Math.ceil(norm.length / cols)
for (let r = 0; r < rows; r++) {
  const slice = norm.slice(r * cols, (r + 1) * cols)
  // 补齐最后一行，保证 tile 输出完整网格
  while (slice.length < cols) {
    const blank = path.join(TMP, `_blank_${slice.length}.png`)
    if (!fs.existsSync(blank)) {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
        '-f', 'lavfi', '-i', `color=white:s=${CW}x${CH}`,
        '-frames:v', '1', '-update', '1', blank], { stdio: 'pipe' })
    }
    slice.push(blank)
  }
  const listFile = path.join(TMP, `${outName}_r${r}.txt`)
  fs.writeFileSync(listFile, slice.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'))
  const out = path.join(TMP, `${outName}_r${r}.png`)
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
    '-i', listFile, '-vf', `tile=${cols}x1:padding=4:color=yellow`,
    '-frames:v', '1', '-update', '1', out], { stdio: 'pipe' })
  console.log(`row ${r}: ${out}`)
}
console.log('\norder:')
names.forEach((n, i) => console.log(`  ${i + 1}. ${n}`))
