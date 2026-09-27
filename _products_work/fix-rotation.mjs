// 修正 kk 系列的 90° 旋转问题
//
// 背景：kk222 / kk968 / kk976 三个系列共 15 张图，物理像素是横躺的
//       （画面里人物躺倒），但宽高是 1050x1400 竖版，浏览器按竖版显示 → 看起来是横的。
//       实测逆时针 90°（transpose=2）后方向正确。
//
// 缓存处理：被站上引用的图改用新文件名（-r 后缀），避免 /images/* 的 86400s 缓存
//           让老访客继续看到横躺版本。未被引用的直接原地覆盖。
//
// 用法: node _products_work/fix-rotation.mjs
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const IMG = path.join(ROOT, 'public/images')
const OUT = path.join(ROOT, '_products_work/rotated')
const BAK = path.join(ROOT, '_image_backup/rotated_originals')
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(BAK, { recursive: true })

const KK = [
  'kk222-1', 'kk222-2', 'kk222-3', 'kk222-4', 'kk222-5',
  'kk968-1', 'kk968-2', 'kk968-3', 'kk968-4', 'kk968-5',
  'kk976-1', 'kk976-2', 'kk976-3', 'kk976-4', 'kk976-5',
]

// 站上引用了的（需改名破缓存）
const REFERENCED = new Set(['kk222-1', 'kk976-1'])

const log = []
let installed = 0
for (const name of KK) {
  const src = path.join(IMG, `${name}.jpg`)
  if (!fs.existsSync(src)) { log.push({ name, err: 'missing' }); continue }

  // 备份原图
  fs.copyFileSync(src, path.join(BAK, `${name}.jpg`))

  const dst = path.join(OUT, `${name}.jpg`)
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', src,
    '-vf', 'transpose=2',            // 逆时针 90°
    '-q:v', '3', dst], { encoding: 'utf8', timeout: 120000 })

  if (r.status !== 0) { log.push({ name, err: (r.stderr || '').slice(0, 120) }); continue }

  // 安装：站上引用了的换新名（破缓存），其余原地覆盖
  const finalName = REFERENCED.has(name) ? `${name}-r.jpg` : `${name}.jpg`
  fs.copyFileSync(dst, path.join(IMG, finalName))
  installed++

  const dim = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0',
    path.join(IMG, finalName)], { encoding: 'utf8' }).stdout.trim()

  log.push({ name, installed: finalName, dim, renamed: REFERENCED.has(name) })
}

console.log(JSON.stringify(log, null, 2))
console.log(`\n旋转并安装 ${installed}/${KK.length}`)
console.log('原图备份:', BAK)
if (REFERENCED.size) {
  console.log('\n⚠ 需同步更新引用（旧名 → 新名）:')
  for (const n of REFERENCED) console.log(`   /images/${n}.jpg  →  /images/${n}-r.jpg`)
}
