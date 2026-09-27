// 列出每张博客封面被哪些文章使用（标题 + 分类）
import fs from 'node:fs'

const SRC = 'G:/LINFAIR_独立站项目/20260605-00-39-35-746/linfariwool/src/data/products.ts'
const src = fs.readFileSync(SRC, 'utf-8')

// blogPostsChronological 里每个对象：id / title / category / image
const re = /\{\s*\n\s*id:\s*'(blog-\d+)',\s*\n\s*title:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*excerpt:\s*'(?:[^'\\]|\\.)*',[\s\S]*?category:\s*'([^']*)',\s*\n\s*image:\s*'([^']+)'/g

const byCover = new Map()
let m
while ((m = re.exec(src))) {
  const [, id, title, category, image] = m
  const cover = image.replace('/images/blog/', '')
  if (!byCover.has(cover)) byCover.set(cover, [])
  byCover.get(cover).push({ id, title: title.replace(/\\'/g, "'"), category })
}

for (const [cover, arts] of [...byCover.entries()].sort()) {
  console.log(`\n${cover}  (${arts.length} 篇)`)
  for (const a of arts) console.log(`   ${a.id}  [${a.category}] ${a.title}`)
}
console.log(`\n共 ${byCover.size} 张封面，${[...byCover.values()].reduce((s, a) => s + a.length, 0)} 篇文章`)
