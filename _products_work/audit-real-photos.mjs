// 全量体检 public/images/ 下的真实拍摄图（排除 blog/ 与 products/）
// 输出：解码是否干净、尺寸、字节、是否已站上引用
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const IMG = path.join(ROOT, 'public/images')
const SRC = [
  fs.readFileSync(path.join(ROOT, 'src/data/products.ts'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'src/data/productsExt.ts'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'src/data/siteContent.ts'), 'utf8'),
  fs.readFileSync(path.join(ROOT, 'src/data/videos.ts'), 'utf8'),
].join('\n')

const SERIES = ['6006', '6007', '6008', '6009', '6034', 'kk222', 'kk968', 'kk976']
const files = fs.readdirSync(IMG)
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  .filter((f) => SERIES.some((s) => f.startsWith(s)))
  .sort()

const rows = []
for (const f of files) {
  const p = path.join(IMG, f)
  const size = fs.statSync(p).size

  let dim = '', decodeErr = ''
  try {
    dim = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p], { encoding: 'utf8' }).trim()
  } catch (e) { decodeErr = 'probe fail' }

  let errCount = 0
  try {
    const out = execFileSync('ffmpeg', ['-v', 'error', '-i', p, '-f', 'null', '-'],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    errCount = out.trim() ? out.trim().split('\n').length : 0
  } catch (e) {
    const msg = (e.stderr || e.message || '').toString()
    errCount = Math.max(1, msg.split('\n').filter(Boolean).length)
  }

  const used = SRC.includes(f)
  rows.push({ f, dim, size, errCount, used })
}

console.log('文件'.padEnd(52), '尺寸'.padEnd(11), '大小'.padEnd(9), '解码', ' 引用')
console.log('-'.repeat(92))
for (const r of rows) {
  const dec = r.errCount === 0 ? 'OK  ' : `ERR${r.errCount}`.padEnd(4)
  console.log(
    r.f.padEnd(52),
    r.dim.padEnd(11),
    `${Math.round(r.size / 1024)}KB`.padEnd(9),
    dec,
    r.used ? ' YES' : ' -'
  )
}

const bad = rows.filter((r) => r.errCount > 0)
const unused = rows.filter((r) => !r.used)
console.log('-'.repeat(92))
console.log(`总计 ${rows.length} 张 | 解码异常 ${bad.length} 张 | 未引用 ${unused.length} 张`)
if (bad.length) console.log('异常文件:', bad.map((b) => b.f).join(', '))
