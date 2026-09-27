// 用固定相对位置批量去除 6008/6009 系列的 AI 星标水印
//
// 依据：这些图出自同一 AI 工具、同一构图模板（1050x1400 与 ~920x1152），
// 星标位于右下角固定相对位置（实测约 91.5% W, 94% H）。
// 用 ffmpeg delogo 从周边像素插值填补。
//
// 用法: node _products_work/fix-watermark2.mjs
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const SRC = path.join(ROOT, 'public/images')
const OUT = path.join(ROOT, '_products_work/wm_fixed2')
fs.mkdirSync(OUT, { recursive: true })

const TARGETS = [
  '6008-LF2026008.Black1', '6008-LF2026008.Camel', '6008-LF2026008.Charcoal_Gray',
  '6008-LF2026008.Ivory', '6008-LF2026008.Navy_Blue',
  '6009-35b469c5-0713-4c92-becf-c4ec9251abd6',
  '6009-45eb7fb4-e814-4562-b3b6-ed8278d5d2e5',
  '6009-62362d63-a517-47af-84fb-43eba253809b',
  '6009-dd26e238-7553-4a85-ac58-ac05199f7a15',
  '6009-f3433b72-09ce-46a7-b8de-e57da61429a1',
]

// 水印中心相对位置 + 覆盖框尺寸（相对图宽/高）
const CX = 0.915, CY = 0.940
const BW_FRAC = 0.115, BH_FRAC = 0.085

function probe(f) {
  const o = execFileSync('ffprobe', ['-v','error','-select_streams','v:0',
    '-show_entries','stream=width,height','-of','csv=p=0', f], { encoding: 'utf8' })
  const [w,h] = o.trim().split(',').map(Number)
  return { w, h }
}

const log = []
for (const name of TARGETS) {
  const src = path.join(SRC, `${name}.jpg`)
  if (!fs.existsSync(src)) { log.push({ name, err: 'missing' }); continue }
  const { w, h } = probe(src)

  let bw = Math.round(w * BW_FRAC)
  let bh = Math.round(h * BH_FRAC)
  let bx = Math.round(w * CX - bw / 2)
  let by = Math.round(h * CY - bh / 2)
  // delogo 要求框整体在画面内
  bx = Math.min(Math.max(1, bx), w - bw - 2)
  by = Math.min(Math.max(1, by), h - bh - 2)

  const dst = path.join(OUT, `${name}.jpg`)
  execFileSync('ffmpeg', ['-y','-loglevel','error','-i',src,
    '-vf', `delogo=x=${bx}:y=${by}:w=${bw}:h=${bh}:show=0`,
    '-q:v','2', dst], { stdio: 'pipe' })

  log.push({ name, size: `${w}x${h}`, box: `${bx},${by} ${bw}x${bh}` })
}
console.log(JSON.stringify(log, null, 2))
