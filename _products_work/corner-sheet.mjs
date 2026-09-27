// 生成指定图片"右下角"裁剪并拼成一张横排图，用于人工核对 AI 星标水印
// 用法: node _products_work/corner-sheet.mjs <outName> <img1> <img2> ...
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const SRC = path.join(ROOT, 'public/images')
const TMP = path.join(ROOT, '_products_work/_cs')
fs.mkdirSync(TMP, { recursive: true })

const [outName, ...imgs] = process.argv.slice(2)
if (!outName || !imgs.length) {
  console.error('usage: node corner-sheet.mjs <outName> <img1> [img2 ...]')
  process.exit(1)
}

const made = []
for (const f of imgs) {
  const src = path.join(SRC, `${f}.jpg`)
  if (!fs.existsSync(src)) { console.warn('skip missing:', f); continue }
  const out = path.join(TMP, `${f}.png`)
  // 右下角 26% x 26%，缩放到统一尺寸——星标位于这里
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
    '-vf', 'crop=iw*0.26:ih*0.26:iw*0.72:ih*0.72,scale=220:220,setsar=1',
    '-frames:v', '1', '-update', '1', out], { stdio: 'pipe' })
  made.push(out)
}

const listFile = path.join(TMP, `${outName}.txt`)
fs.writeFileSync(listFile, made.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'))

const sheet = path.join(TMP, `${outName}.png`)
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
  '-i', listFile, '-vf', `tile=${made.length}x1:padding=4:color=yellow`,
  '-frames:v', '1', '-update', '1', sheet], { stdio: 'pipe' })

console.log('sheet:', sheet)
console.log('order:')
made.forEach((p, i) => console.log(`  ${i + 1}. ${path.basename(p, '.png')}`))
