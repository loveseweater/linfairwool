// 压缩新品图片：PNG(1024x1536, ~2.5MB) → JPEG q82 800x1200（对齐站内现有产品图 ~100-200KB）
// 用法：node _products_work/compress.mjs
// 依赖 ffmpeg（已在 PATH）。输出到 public/images/products/
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const SRC = path.join(ROOT, '_products_work/raw')
const DEST = path.join(ROOT, 'public/images/products')

fs.mkdirSync(DEST, { recursive: true })

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.png'))
if (!files.length) {
  console.error('[compress] no source PNGs found in', SRC)
  process.exit(1)
}

let ok = 0
let failed = []
for (const f of files.sort()) {
  const src = path.join(SRC, f)
  // 产品图统一输出 .jpg（前台引用同步改为 .jpg）
  const outName = f.replace(/\.png$/i, '.jpg')
  const dest = path.join(DEST, outName)
  try {
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-i', src,
      '-vf', 'scale=800:1200:flags=lanczos',
      '-q:v', '4',
      '-f', 'mjpeg',
      dest,
    ], { stdio: 'pipe' })
    const before = fs.statSync(src).size
    const after = fs.statSync(dest).size
    ok++
    console.log(`OK   ${outName}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`)
  } catch (e) {
    failed.push(f)
    console.error(`FAIL ${f}: ${(e.stderr || e.message).toString().slice(0, 200)}`)
  }
}

console.log(`\n[compress] done. ok=${ok} failed=${failed.length}`)
if (failed.length) console.log('failed:', failed.join(', '))
