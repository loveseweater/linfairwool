// 批量生成新品图片（针织毛衣 / 打底衫 / 羊毛衫 / 围巾 / 帽子 / 手套 / 袜子）
// 走本机 image 服务（127.0.0.1:8765）→ 星河 images/generations
// 用法：node _products_work/gen.mjs
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool'
const OUT = path.join(ROOT, '_products_work/raw')
const PORT = 8765
const SIZE = '1024x1536'
const CONCURRENCY = Number(process.env.CONC || 5)
const TIMEOUT_MS = 900000
const FORCE = process.env.FORCE === '1'

fs.mkdirSync(OUT, { recursive: true })

// 统一风格：无人物 / 无手 / 无可见模特 —— 规避 AI 手部伪影，保持电商目录级干净质感
const BG = 'on a seamless pale warm-grey studio background'
const STYLE =
  'professional e-commerce catalog product photograph, soft diffused studio lighting, gentle natural contact shadow, crisp focus, fine knit stitch texture clearly visible, premium quality'
const NEG = 'no text, no logo, no watermark, no person, no hands, no mannequin, no props, no clutter'

const products = [
  // ── 针织毛衣 Knit Sweaters ──
  {
    slug: 'cable-knit-crewneck-sweater',
    shots: [
      "a women's chunky cable-knit crewneck sweater in oatmeal cream wool, displayed on an invisible ghost mannequin so the garment holds its natural three-dimensional shape, sleeves gently curved, front view",
      "the same women's chunky cable-knit crewneck sweater in oatmeal cream, neatly folded into a soft rectangular stack, three-quarter top-down view, ribbed collar visible",
      'extreme close-up macro of chunky cable braid stitch structure and the ribbed crewneck collar edge on a cream wool sweater',
    ],
  },
  {
    slug: 'mens-ribbed-crewneck-sweater',
    shots: [
      "a men's ribbed knit crewneck sweater in deep charcoal grey merino wool, displayed on an invisible ghost mannequin holding its natural shape, front view, clean straight silhouette",
      "the same men's charcoal ribbed knit sweater neatly folded into a flat rectangular stack, three-quarter top-down view, ribbed hem visible",
      'extreme close-up macro of vertical rib knit stitch pattern and shoulder seam on a dark charcoal wool sweater',
    ],
  },
  {
    slug: 'fuzzy-mohair-blend-sweater',
    shots: [
      "a women's fuzzy mohair-blend knit sweater in soft dusty pink with a fluffy brushed halo surface, displayed on an invisible ghost mannequin holding its natural shape, front view",
      "the same women's dusty pink fuzzy mohair sweater loosely folded into a soft cloud-like stack, three-quarter top-down view showing the brushed texture",
      'extreme close-up macro of fluffy brushed mohair fibre texture with individual fuzzy hairs catching soft light on pale pink knitwear',
    ],
  },
  {
    slug: 'fishermans-ribbed-sweater',
    shots: [
      "a women's fisherman ribbed knit sweater in natural undyed ivory wool with deep horizontal rib texture and a rolled crewneck, displayed on an invisible ghost mannequin holding its natural shape",
      "the same ivory fisherman rib sweater neatly folded into a chunky soft stack, three-quarter top-down view showing deep rib ridges",
      'extreme close-up macro of deep fisherman rib horizontal ridges and the rolled neckline edge on natural ivory wool knitwear',
    ],
  },

  // ── 打底衫 Base Layers ──
  {
    slug: 'merino-base-layer-top',
    shots: [
      "a women's fine-gauge merino wool base layer top in soft heather grey, thin lightweight smooth knit, displayed on an invisible ghost mannequin holding a slim fitted shape, front view",
      "the same women's heather grey fine-gauge merino base layer top neatly folded into a thin compact flat rectangle, three-quarter top-down view",
      'extreme close-up macro of fine-gauge smooth jersey knit surface with subtle heather yarn flecks on lightweight grey merino knitwear',
    ],
  },
  {
    slug: 'ribbed-thermal-turtleneck',
    shots: [
      "a women's ribbed knit thermal turtleneck top in black, slim second-skin fit with a high folded collar, displayed on an invisible ghost mannequin holding its narrow silhouette, front view",
      "the same women's black ribbed thermal turtleneck neatly folded into a slim compact rectangle, three-quarter top-down view, tall ribbed collar visible",
      'extreme close-up macro of fine vertical rib knit and the folded turtleneck collar edge on black thermal knitwear',
    ],
  },
  {
    slug: 'mens-merino-thermal-crew',
    shots: [
      "a men's merino wool thermal base layer crew neck top in dark navy, smooth lightweight fine-gauge knit, displayed on an invisible ghost mannequin holding a fitted athletic shape, front view",
      "the same men's navy merino thermal base layer top neatly folded into a thin compact flat rectangle, three-quarter top-down view",
      'extreme close-up macro of fine smooth jersey knit surface and flatlocked shoulder seam on navy blue lightweight merino knitwear',
    ],
  },

  // ── 羊毛衫 Wool Sweaters ──
  {
    slug: 'merino-wool-crewneck-sweater',
    shots: [
      "a women's 100 percent merino wool crewneck sweater in rich camel tan, medium-gauge smooth knit, displayed on an invisible ghost mannequin holding its natural shape, front view",
      "the same women's camel merino wool crewneck sweater neatly folded into a soft rectangular stack, three-quarter top-down view, ribbed trims visible",
      'extreme close-up macro of medium-gauge smooth merino knit with fine ribbed cuff edge on warm camel tan wool sweater',
    ],
  },
  {
    slug: 'lambswool-vneck-sweater',
    shots: [
      "a men's lambswool v-neck sweater in forest green, classic medium-gauge knit with ribbed v-neckline and ribbed trims, displayed on an invisible ghost mannequin holding its natural shape, front view",
      "the same men's forest green lambswool v-neck sweater neatly folded into a flat rectangular stack, three-quarter top-down view, ribbed v-neckline visible",
      'extreme close-up macro of the ribbed v-neckline trim and lambswool knit surface on deep green wool sweater',
    ],
  },
  {
    slug: 'lambswool-button-cardigan',
    shots: [
      "a women's lambswool button-front cardigan in soft dove grey with a round neckline and small tonal buttons, displayed on an invisible ghost mannequin holding its natural shape, front view, fully buttoned",
      "the same women's dove grey lambswool cardigan laid open flat showing the front placket and buttons, three-quarter top-down view",
      'extreme close-up macro of small round buttons on a knitted front placket band with lambswool knit surface in soft grey',
    ],
  },

  // ── 围巾 Scarves ──
  {
    slug: 'chunky-ribbed-merino-scarf',
    shots: [
      'a chunky ribbed merino wool scarf in cream ivory, loosely folded into a soft layered stack with long twisted fringe at the ends, three-quarter top-down flat lay view',
      'the same chunky cream ribbed merino scarf arranged in a relaxed loop showing both drape and fringe detail, top-down flat lay view from above',
      'extreme close-up macro of thick rib knit ridges and hand-twisted yarn fringe ends on a cream merino wool scarf',
    ],
  },
  {
    slug: 'cashmere-blend-woven-scarf',
    shots: [
      'a cashmere-blend woven winter scarf in soft taupe with a subtle herringbone weave and clean hand-rolled hem, folded into a neat flat rectangle, three-quarter top-down flat lay view',
      'the same taupe cashmere-blend woven scarf gently draped in loose soft folds showing fluid drape, top-down flat lay view from above',
      'extreme close-up macro of subtle herringbone twill weave structure and hand-rolled hem edge on a taupe cashmere-blend scarf',
    ],
  },
  {
    slug: 'cable-knit-fringed-scarf',
    shots: [
      'a cable knit winter scarf in deep burgundy wool with a bold centre cable braid and fringed ends, folded into a soft stack, three-quarter top-down flat lay view',
      'the same deep burgundy cable knit scarf arranged in a loose relaxed loop showing the cable pattern running its full length, top-down flat lay view from above',
      'extreme close-up macro of a bold cable braid stitch column and fringed end on deep burgundy wool scarf',
    ],
  },

  // ── 帽子 Hats ──
  {
    slug: 'ribbed-merino-beanie',
    shots: [
      'a ribbed merino wool beanie hat in mid grey, lightly stuffed to stand upright in its natural cuffed shape, front view, centre-frame',
      'the same mid grey ribbed merino beanie laid flat with the cuff folded up, three-quarter top-down view',
      'extreme close-up macro of vertical rib knit ridges and the folded cuff edge on a mid grey merino wool beanie',
    ],
  },
  {
    slug: 'cable-knit-bobble-hat',
    shots: [
      'a cable knit bobble hat in cream ivory wool with a large fluffy yarn pom-pom on top, lightly stuffed to stand upright in natural shape, front view, centre-frame',
      'the same cream cable knit bobble hat laid flat showing the cable pattern and pom-pom, three-quarter top-down view',
      'extreme close-up macro of cable stitch structure and the fluffy yarn pom-pom fibres on a cream wool bobble hat',
    ],
  },
  {
    slug: 'fisherman-rolled-cuff-beanie',
    shots: [
      'a fisherman style rolled-cuff beanie in dark navy wool with a short shallow body and a thick rolled brim, lightly stuffed to stand upright in natural shape, front view, centre-frame',
      'the same dark navy fisherman beanie laid flat showing the thick rolled cuff, three-quarter top-down view',
      'extreme close-up macro of dense plain knit structure and the thick rolled brim edge on a navy wool fisherman beanie',
    ],
  },

  // ── 手套 Gloves ──
  {
    slug: 'merino-touchscreen-gloves',
    shots: [
      'a pair of merino wool knit gloves in soft black, laid flat side by side with fingers gently relaxed, one glove showing the back of the hand and the other showing the palm, top-down flat lay view',
      'the same pair of black merino knit gloves neatly overlapped and stacked together, three-quarter top-down flat lay view showing the ribbed cuffs',
      'extreme close-up macro of fine knit stitch and ribbed cuff with conductive touchscreen yarn at the fingertip on black merino wool gloves',
    ],
  },
  {
    slug: 'fleece-lined-cable-mittens',
    shots: [
      'a pair of cable knit mittens in oatmeal cream wool with a soft fleece lining visible at the cuffs, laid flat side by side with thumbs angled outward, top-down flat lay view',
      'the same pair of cream cable knit mittens laid one on top of the other in a neat stack, three-quarter top-down flat lay view showing the cable pattern',
      'extreme close-up macro of cable braid stitch on the back of a mitten and the plush fleece lining peeking out at the cuff, cream wool',
    ],
  },
  {
    slug: 'cashmere-blend-knit-gloves',
    shots: [
      'a pair of cashmere-blend ribbed knit gloves in soft camel tan, laid flat side by side with fingers gently relaxed, one glove showing the back of the hand and the other showing the palm, top-down flat lay view',
      'the same pair of camel cashmere-blend knit gloves neatly overlapped in a soft stack, three-quarter top-down flat lay view showing long ribbed cuffs',
      'extreme close-up macro of fine rib knit surface and long ribbed cuff on soft camel tan cashmere-blend gloves',
    ],
  },

  // ── 袜子 Socks ──
  {
    slug: 'merino-ribbed-crew-socks',
    shots: [
      'a pair of merino wool ribbed crew socks in heather grey, laid flat side by side with toes pointing upward-right, top-down flat lay view, ribbed leg and smooth foot visible',
      'the same pair of heather grey merino ribbed crew socks folded neatly together into a compact pair, three-quarter top-down flat lay view showing the ribbed cuff',
      'extreme close-up macro of fine rib knit on the sock leg and the smooth reinforced heel and toe knit on heather grey merino wool socks',
    ],
  },
  {
    slug: 'cashmere-blend-bed-socks',
    shots: [
      'a pair of plush cashmere-blend bed socks in soft blush pink, laid flat side by side with toes pointing upward-right, top-down flat lay view, thick cosy knit and folded cuff visible',
      'the same pair of blush pink cashmere-blend bed socks folded neatly together into a soft compact pair, three-quarter top-down flat lay view',
      'extreme close-up macro of plush thick knit surface and the softly folded ribbed cuff on blush pink cashmere-blend bed socks',
    ],
  },
]

const tasks = []
for (const p of products) {
  p.shots.forEach((s, i) => {
    tasks.push({ file: `${p.slug}-${i + 1}.png`, prompt: `${s}, ${BG}, ${STYLE}, ${NEG}` })
  })
}

console.log(`[gen] planned images: ${tasks.length} (${products.length} products x3)`)

// 确保本机 image 服务在线
function ensureService() {
  try {
    execFileSync('powershell', [
      '-NoProfile', '-Command',
      "& 'C:\\Users\\lds20\\AppData\\Local\\ApiCodexOneClick\\tools\\ensure-image-service.ps1'",
    ], { stdio: 'ignore', timeout: 60000 })
  } catch (e) {
    console.warn('[gen] ensure-image-service warning:', e.message)
  }
}

async function generateOne(task, attempt = 1) {
  const dest = path.join(OUT, task.file)
  if (fs.existsSync(dest) && !FORCE) {
    console.log(`SKIP ${task.file}`)
    return { ok: true, skipped: true }
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: task.prompt,
        referenceImages: [],
        outputDir: OUT,
        size: SIZE,
        fileName: task.file,
        timeoutMs: TIMEOUT_MS,
      }),
      signal: controller.signal,
    })
    const json = await res.json()
    if (!json.ok) throw new Error(String(json.error || 'unknown error'))
    console.log(`OK   ${task.file}`)
    return { ok: true }
  } catch (e) {
    if (attempt < 3) {
      console.warn(`RETRY(${attempt}) ${task.file}: ${e.message}`)
      await new Promise((r) => setTimeout(r, 4000 * attempt))
      return generateOne(task, attempt + 1)
    }
    console.error(`FAIL ${task.file}: ${e.message}`)
    return { ok: false, error: e.message }
  } finally {
    clearTimeout(timer)
  }
}

async function run() {
  ensureService()
  const queue = [...tasks]
  const failures = []
  let done = 0
  async function worker(id) {
    while (queue.length) {
      const task = queue.shift()
      if (!task) break
      const r = await generateOne(task)
      if (!r.ok) failures.push(task.file)
      done++
      console.log(`[gen] progress ${done}/${tasks.length} (worker ${id})`)
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, (_, i) => worker(i + 1)))
  fs.writeFileSync(
    path.join(ROOT, '_products_work/gen-result.json'),
    JSON.stringify({ total: tasks.length, failures }, null, 2)
  )
  console.log(`\n[gen] DONE. total=${tasks.length} failed=${failures.length}`)
  if (failures.length) console.log('failed:', failures.join(', '))
}

run()
