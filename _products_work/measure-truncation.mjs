// 量化每张 JPEG 的损坏程度：能解出多少行像素（相对总高度）
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

const rows = []
for (const f of files) {
  const p = path.join(IMG, f)

  const h = Number(spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=height', '-of', 'csv=p=0', p], { encoding: 'utf8' }).stdout.trim())

  // 解码到 rawvideo，测量实际解出多少字节
  const r = spawnSync('ffmpeg', ['-v', 'quiet', '-i', p, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { encoding: 'buffer', maxBuffer: 200 * 1024 * 1024, timeout: 120000 })
  const w = Number(spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width', '-of', 'csv=p=0', p], { encoding: 'utf8' }).stdout.trim())

  const gotBytes = r.stdout ? r.stdout.length : 0
  const gotRows = w ? Math.round(gotBytes / (w * 3)) : 0
  const pct = h ? Math.round((gotRows / h) * 100) : 0

  rows.push({ f, h, gotRows, pct })
}

console.log('文件'.padEnd(52), '总高'.padEnd(7), '可解码'.padEnd(8), '完整度')
console.log('-'.repeat(80))
let truncated = 0
for (const r of rows) {
  const mark = r.pct >= 99 ? 'OK' : `${r.pct}%  ← 截断`
  if (r.pct < 99) truncated++
  console.log(r.f.padEnd(52), String(r.h).padEnd(7), String(r.gotRows).padEnd(8), mark)
}
console.log('-'.repeat(80))
console.log(`总计 ${rows.length} 张 | 不完整 ${truncated} 张`)
