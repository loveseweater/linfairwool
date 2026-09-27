// 建立真实拍摄素材 ↔ 产品款式 的映射表
//
// 数据来源：肉眼核对 8 个款号系列（共 60 张，其中 5 张损坏需排除）
// 输出：结构化清单，供后续把 AI 产品图替换为实拍图使用
import fs from 'node:fs'

const BASE = '/images'

// 每个系列的真实拍摄内容（已逐张肉眼确认）
const SERIES = {
  '6006': {
    style: "Women's Short-Sleeve Crew Neck Knit Top",
    type: 'Knit Tops / Short Sleeve',
    colors: {
      BK: 'Black', CG: 'Charcoal Grey', CM: 'Camel', IV: 'Ivory', NV: 'Navy Blue',
    },
    // 文件名后缀 → 角度/场景
    shots: {
      'MAIN': '主图（白底棚拍，正面全身）',
      'camel-1': '场景（户外泳池边，正面）',
      'camel-2': '场景（户外，侧身抬手）',
      'camel-3': '场景（户外，背面）',
      'camel-4': '场景（户外，半身）',
      'camel-5': '特写（领口/面料细节）',
    },
    damaged: ['camel-2', 'camel-3', 'camel-5'],
  },
  '6007': {
    style: "Women's Short-Sleeve Crew Neck Knit Top (variant)",
    type: 'Knit Tops / Short Sleeve',
    colors: { Black: 'Black', Camel: 'Camel', Charcoal_Gray: 'Charcoal Grey', Ivory: 'Ivory', Navy_Blue: 'Navy Blue' },
    shots: {
      '1': '主图（白底棚拍，正面全身）',
      'camel-1': '场景（室内，正面）',
      'camel-2': '场景（室内，侧身）',
      'camel-3': '场景（室内，背面）',
      'camel-4': '场景（室内，半身）',
      'camel-5': '特写（面料细节）',
    },
    damaged: ['Ivory_1', 'Navy_Blue_1', 'camel-2', 'camel-4', 'camel-5'],
  },
  '6008': {
    style: "Women's Short-Sleeve Crew Neck Knit Top",
    type: 'Knit Tops / Short Sleeve',
    colors: { Black1: 'Black', Camel: 'Camel', Charcoal_Gray: 'Charcoal Grey', Ivory: 'Ivory', Navy_Blue: 'Navy Blue' },
    shots: {
      'LF2026008': '主图（白底棚拍，正面全身）',
      'camel-1': '场景（户外，正面）',
      'camel-2': '场景（户外，侧身）',
      'camel-3': '场景（户外，背面）',
      'camel-4': '场景（户外，半身）— 严重损坏',
      'camel-5': '特写（面料细节）',
    },
    damaged: ['camel-2', 'camel-3', 'camel-4', 'camel-5'],
  },
  '6009': {
    style: "Women's V-Neck Long Sleeve Knit Sweater",
    type: 'Sweaters / V-Neck Long Sleeve',
    colors: { Black: 'Black', Camel: 'Camel', Charcoal_Gray: 'Charcoal Grey', Navy_Blue: 'Navy Blue', Ivory: 'Ivory' },
    shots: {
      'camel-1': '穿搭场景（风衣+牛仔裤，全身）',
      'camel-2': '细节/组合图',
      'camel-3': '穿搭场景（背面/侧面）',
      'camel-4': '穿搭场景（半身）',
      'camel-5': '特写（V 领与面料）',
      '<uuid>': '配色组合图（含 4 个颜色穿搭）',
    },
    damaged: ['camel-4'],
  },
  '6034': {
    style: "Women's Short-Sleeve Crew Neck Knit Top",
    type: 'Knit Tops / Short Sleeve',
    colors: { '1': 'Ivory / Cream' },
    shots: {
      '1': '场景（地中海泳池边，全身）',
      '2': '场景（近景）',
      '3': '细节（面料/袖子）',
      '4': '细节（肩部/领口）',
      '5': '特写（袖口罗纹）',
    },
    damaged: ['2', '3', '4', '5'],
  },
  'kk222': {
    style: "Women's Crew Neck Long Sleeve Knit Top",
    type: 'Knit Tops / Long Sleeve',
    colors: { '1': 'Ivory / Cream' },
    shots: {
      '1': '场景（建筑台阶前，正面半身）',
      '2': '场景（挎包，侧面）',
      '3': '场景（背面）',
      '4': '细节（肩袖）',
      '5': '细节（面料）',
    },
    note: '原图横躺 90°，已用 transpose=2 修正',
    damaged: [],
  },
  'kk968': {
    style: "Women's Mock Neck Long Sleeve Knit Top",
    type: 'Knit Tops / Long Sleeve',
    colors: { '1': 'Ivory / Cream', '2': 'Ivory', '3': 'Ivory', '4': 'Black', '5': 'Black' },
    shots: {
      '1': '场景（室内，正面）',
      '2': '场景（室内，侧面）',
      '3': '场景（室内，背面）',
      '4': '场景（黑色款，正面）',
      '5': '场景（黑色款，侧面）',
    },
    note: '原图横躺 90°，已修正',
    damaged: ['2', '3', '4', '5'],
  },
  'kk976': {
    style: "Women's Crew Neck Long Sleeve Knit Top",
    type: 'Knit Tops / Long Sleeve',
    colors: { '1': 'Ivory / Cream' },
    shots: {
      '1': '主图（竖版，正面全身）',
      '2': '场景（建筑台阶，半身）',
      '3': '场景（室内，正面）',
      '4': '场景（室内，侧面）',
      '5': '细节（面料）',
    },
    note: '原图横躺 90°，已修正',
    damaged: ['2', '3', '5'],
  },
}

console.log(JSON.stringify(SERIES, null, 2))

const totalShots = Object.values(SERIES).reduce((s, v) => s + Object.keys(v.shots).length, 0)
const totalDamaged = Object.values(SERIES).reduce((s, v) => s + v.damaged.length, 0)
console.log(`\n系列: ${Object.keys(SERIES).length}`)
console.log(`镜头描述条目: ${totalShots}`)
console.log(`已标记损坏(需排除): ${totalDamaged}`)
