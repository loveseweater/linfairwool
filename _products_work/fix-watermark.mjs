// 检测并移除产品图右下角的 AI 星标水印（白色四角星）
//
// 思路：
//  1) 裁右下角区域 → 转灰度 raw → 找最亮的孤立小团（星标）
//  2) 映射回原图坐标 → 用 ffmpeg delogo 从周边像素插值补掉
//  3) 输出到 public/images/_wm_fixed/ 供人工核对
//
// 用法: node _products_work/fix-watermark.mjs
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const SRC = path.join(ROOT, 'public/images')
const OUT = path.join(ROOT, '_products_work/wm_fixed')
const TMP = path.join(ROOT, '_products_work/_wmfix')
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(TMP, { recursive: true })

// 待处理：6008 / 6009 两个系列（已人工确认带星标）
const TARGETS = [
  '6008-LF2026008.Black1', '6008-LF2026008.Camel', '6008-LF2026008.Charcoal_Gray',
  '6008-LF2026008.Ivory', '6008-LF2026008.Navy_Blue',
  '6009-35b469c5-0713-4c92-becf-c4ec9251abd6',
  '6009-45eb7fb4-e814-4562-b3b6-ed8278d5d2e5',
  '6009-62362d63-a517-47af-84fb-43eba253809b',
  '6009-dd26e238-7553-4a85-ac58-ac05199f7a15',
  '6009-f3433b72-09ce-46a7-b8de-e57da61429a1',
]

function probe(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file], { encoding: 'utf8' })
  const [w, h] = out.trim().split(',').map(Number)
  return { w, h }
}

// 在右下 30%x30% 区域内找最亮的孤立白团，返回原图坐标
function locateSparkle(file, W, H) {
  const CW = 300, CH = 300
  const raw = path.join(TMP, 'scan.rgb')
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file,
    '-vf', `crop=iw*0.30:ih*0.30:iw*0.68:ih*0.68,scale=${CW}:${CH}`,
    '-f', 'rawvideo', '-pix_fmt', 'gray', raw], { stdio: 'pipe' })
  const g = fs.readFileSync(raw)
  if (g.length < CW * CH) return null

  // 星标 = 高亮且邻域反差大的孤立块
  let best = { score: 0, x: 0, y: 0 }
  for (let y = 4; y < CH - 4; y++) {
    for (let x = 4; x < CW - 4; x++) {
      const v = g[y * CW + x]
      if (v < 235) continue
      // 环邻域均值
      let sum = 0, n = 0
      for (const [dx, dy] of [[-5,0],[5,0],[0,-5],[0,5],[-5,-5],[5,5],[5,-5],[-5,5],[-8,0],[8,0],[0,-8],[0,8]]) {
        const nx = x + dx, ny = y + dy
        if (nx < 0 || ny < 0 || nx >= CW || ny >= CH) continue
        sum += g[ny * CW + nx]; n++
      }
      const mean = sum / n
      const score = v - mean
      if (score > best.score) best = { score, x, y }
    }
  }
  if (best.score < 30) return null

  // 映射回原图坐标：crop 起点 0.68W/0.68H，尺寸 0.30W/0.30H
  const ox = 0.68 * W + (best.x / CW) * (0.30 * W)
  const oy = 0.68 * H + (best.y / CH) * (0.30 * H)
  return { x: Math.round(ox), y: Math.round(oy), score: Math.round(best.score) }
}

const results = []
for (const name of TARGETS) {
  const src = path.join(SRC, `${name}.jpg`)
  if (!fs.existsSync(src)) { results.push({ name, err: 'missing' }); continue }

  const { w, h } = probe(src)
  const spot = locateSparkle(src, w, h)
  if (!spot) { results.push({ name, err: 'no sparkle found' }); continue }

  // delogo 需要 box 完整落在画面内且留边；星标约 70~90px，取 110 方框
  const BW = 130, BH = 130
  let bx = Math.max(1, Math.round(spot.x - BW / 2))
  let by = Math.max(1, Math.round(spot.y - BH / 2))
  if (bx + BW > w - 1) bx = w - 1 - BW
  if (by + BH > h - 1) by = h - 1 - BH

  const dst = path.join(OUT, `${name}.jpg`)
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
    '-vf', `delogo=x=${bx}:y=${by}:w=${BW}:h=${BH}`,
    '-q:v', '3', dst], { stdio: 'pipe' })

  results.push({ name, w, h, spot, box: { x: bx, y: by, w: BW, h: BH }, out: path.basename(dst) })
}

console.log(JSON.stringify(results, null, 2))
