// 汇总"可安全使用的真实实拍图"清单
// 判定标准：
//   1) 有肉眼可见绿色乱码块（>0.5%）→ 排除
//   2) 其余即使 ffmpeg 报解码错（尾部元数据/截断标记），只要画面完整即可用
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

function greenPct(p) {
  const r = spawnSync('ffmpeg', ['-v', 'quiet', '-i', p,
    '-vf', `scale=${CW}:${CH}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024, timeout: 60000 })
  const b = r.stdout
  if (!b || b.length < CW * CH * 3) return 100
  let bad = 0
  for (let i = 0; i < CW * CH; i++) {
    const R = b[i * 3], G = b[i * 3 + 1], B = b[i * 3 + 2]
    if (G > R + 40 && G > B + 40) bad++
  }
  return (bad / (CW * CH)) * 100
}

const usable = [], excluded = []
for (const f of files) {
  const pct = greenPct(path.join(IMG, f))
  if (pct > 0.5) excluded.push({ f, pct: +pct.toFixed(1) })
  else usable.push(f)
}

console.log('=== 排除（可见损坏）===')
for (const e of excluded) console.log(`  ${e.pct}%  ${e.f}`)
console.log(`\n=== 可用实拍图 ${usable.length} 张 ===`)
for (const u of usable) console.log('  ' + u)

fs.writeFileSync(path.join(ROOT, '_products_work/usable-real-photos.json'),
  JSON.stringify({ usable, excluded }, null, 2))
console.log(`\n可用 ${usable.length} 张 | 排除 ${excluded.length} 张`)
