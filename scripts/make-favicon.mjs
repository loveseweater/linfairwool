// 生成 public/favicon.ico（32×32 + 48×48 双 PNG 载荷）
// 背景：/favicon.ico 一直 404（返回 HTML），且部分环境/爬虫不请求 HTML 里声明的
// favicon.svg 而是硬要 /favicon.ico —— 返回 200 的真实图标文件（周检 L8 修复）。
// 依赖 ffmpeg 先产出 32/48 尺寸 PNG，再手工打包 ICO 容器（ICO 允许内嵌 PNG）。
// 运行：ffmpeg -y -i public/logo.png -vf scale=32:32:flags=lanczos scripts/tmp/favicon32.png
//       ffmpeg -y -i public/logo.png -vf scale=48:48:flags=lanczos scripts/tmp/favicon48.png
//       node scripts/make-favicon.mjs
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')
const TMP = path.join(ROOT, 'scripts', 'tmp')
const OUT = path.join(ROOT, 'public', 'favicon.ico')

function iconEntry(size, png, offset) {
  const e = Buffer.alloc(16)
  e[0] = size; e[1] = size          // width/height（0 表示 256）
  e[2] = 0                          // 调色板数
  e[3] = 0                          // 保留
  e.writeUInt16LE(1, 4)             // 平面数
  e.writeUInt16LE(32, 6)            // 位深
  e.writeUInt32LE(png.length, 8)    // 数据大小
  e.writeUInt32LE(offset, 12)       // 数据偏移
  return e
}

const png32 = fs.readFileSync(path.join(TMP, 'favicon32.png'))
const png48 = fs.readFileSync(path.join(TMP, 'favicon48.png'))

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)          // 保留
header.writeUInt16LE(1, 2)          // 类型：ICO
header.writeUInt16LE(2, 4)          // 图像数

const off1 = 6 + 16 * 2
const off2 = off1 + png32.length
const ico = Buffer.concat([
  header,
  iconEntry(32, png32, off1),
  iconEntry(48, png48, off2),
  png32,
  png48,
])

fs.writeFileSync(OUT, ico)
console.log('written', OUT, ico.length, 'bytes')
