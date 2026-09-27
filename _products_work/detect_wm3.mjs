// 精准检测 AI 星标水印：检查图片右下角固定位置 (约 88-96% W, 88-96% H)
// 星标特征：一个白色四角星，中心亮、四角尖，背景通常较暗
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const BASE = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool/public/images'
const TMP = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool/_products_work/_wm3'
fs.mkdirSync(TMP, { recursive: true })

const CW = 200, CH = 160
const files = fs.readdirSync(BASE).filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !f.startsWith('.'))

function scan(file) {
  const src = path.join(BASE, file)
  const raw = path.join(TMP, 'z.rgb')
  // 精确瞄准右下角：从 78% 宽 / 78% 高 起，取 22% x 22%
  try {
    execFileSync('ffmpeg', ['-y','-loglevel','error','-i',src,
      '-vf',`crop=iw*0.22:ih*0.22:iw*0.78:ih*0.78,scale=${CW}:${CH}`,
      '-f','rawvideo','-pix_fmt','rgb24',raw], {stdio:'pipe'})
  } catch { return null }
  const b = fs.readFileSync(raw)
  if (b.length < CW*CH*3) return null

  // 统计"纯白"像素（>245）——星标是纯白
  let white = 0
  const idx = []
  for (let i=0;i<CW*CH;i++){
    const r=b[i*3],g=b[i*3+1],bl=b[i*3+2]
    if (r>245&&g>245&&bl>245){white++;idx.push(i)}
  }
  if (!white) return {white:0, ratio:0, spread:0, bgDark:false}

  // 白块的空间分布（星标集中在中心区域，而不是整片背景）
  let minX=1e9,maxX=-1,minY=1e9,maxY=-1
  for(const i of idx){
    const x=i%CW,y=(i/CW)|0
    if(x<minX)minX=x; if(x>maxX)maxX=x
    if(y<minY)minY=y; if(y>maxY)maxY=y
  }
  const w=maxX-minX+1,h=maxY-minY+1
  const spread=(w*h)/(CW*CH)
  // 星标包围盒接近方形且不太大
  const squareness = w/h

  // 中心区域 vs 外围亮度，判断是否有暗背景衬托
  let centerWhite=0
  for(const i of idx){
    const x=i%CW,y=(i/CW)|0
    if(x>CW*0.25&&x<CW*0.75&&y>CH*0.25&&y<CH*0.75) centerWhite++
  }

  return { white, ratio: white/(CW*CH), spread, squareness:+squareness.toFixed(2), centerWhite,
           box:{w,h} }
}

const hits=[]
for (const f of files.sort()){
  const r=scan(f)
  if(!r) continue
  // 星标：中心集中 + 包围盒方形 + 白像素占比合理
  if (r.white>60 && r.white<3000 && r.squareness>0.6 && r.squareness<1.7 && r.centerWhite/r.white>0.5){
    hits.push({f, ...r})
  }
}
console.log('=== 疑似 AI 星标水印 ===')
for(const h of hits) console.log(`  white=${String(h.white).padStart(4)} box=${h.box.w}x${h.box.h} sq=${h.squareness}  ${h.f}`)
console.log(`\n扫描 ${files.length} | 命中 ${hits.length}`)
fs.writeFileSync('_products_work/wm-hits3.json', JSON.stringify(hits,null,2))
