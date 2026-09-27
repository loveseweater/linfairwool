// 正确检测 JPEG 解码完整性
// 修正：execFileSync 只返回 stdout，而 ffmpeg -v error 输出到 stderr，
//       必须用 spawnSync 同时拿 stderr，否则会把所有文件误判为 OK。
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

console.log('文件'.padEnd(52), '尺寸'.padEnd(11), '大小'.padEnd(9), 'stderr行', '解码')
console.log('-'.repeat(95))

const bad = []
for (const f of files) {
  const p = path.join(IMG, f)
  const size = fs.statSync(p).size

  // 用 -f null - 完整解码一遍，捕获 stderr
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', p, '-f', 'null', '-'],
    { encoding: 'utf8', timeout: 60000 })
  const errLines = (r.stderr || '').split('\n').map((s) => s.trim()).filter(Boolean)
  const isErr = errLines.some((l) => /error|corrupt|invalid|overread|truncat/i.test(l))

  const dim = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p],
    { encoding: 'utf8' }).stdout.trim()

  const status = isErr ? 'BROKEN' : 'OK'
  if (isErr) bad.push({ f, errLines: errLines.slice(0, 2) })

  console.log(
    f.padEnd(52),
    dim.padEnd(11),
    `${Math.round(size / 1024)}KB`.padEnd(9),
    String(errLines.length).padEnd(7),
    status
  )
}

console.log('-'.repeat(95))
console.log(`总计 ${files.length} 张 | 解码异常 ${bad.length} 张`)
for (const b of bad) {
  console.log(`\n  ${b.f}`)
  b.errLines.forEach((l) => console.log('    ' + l.slice(0, 110)))
}
