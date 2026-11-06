// 生成 /admin 的独立 SPA 壳（public/admin/index.html）。
//
// 背景：Cloudflare Pages 会把 /index.html 规范化 308 到 /，所以 _redirects 里
// 任何 rewrite 到 /index.html 的 /admin 规则都会把浏览器送到首页，React Router
// 拿不到 /admin 路径。改为给 /admin 一个真实静态资产（与其它 93 个预渲染页一样
// 走资产直出），/admin 自动 308 到 /admin/ 后由 CF 直出该文件。
//
// 本壳复用 dist/index.html 的内联 Tailwind CSS（构建产物），但不带首页的
// canonical / OG / JSON-LD / GA，且强制 noindex —— 管理后台不该被收录。
//
// 用法：npm run build 之后执行 `node scripts/make-admin-shell.mjs`
//       脚本会同时更新 public/（提交用）与 dist/（本地预览用）。
// Tailwind 样式有变更时重跑本脚本即可。
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const distHtml = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8')
const styles = [...distHtml.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]).join('\n')
if (!styles) throw new Error('dist/index.html 中未找到内联 <style>，请先执行 npm run build')

const jsSrc = (distHtml.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/) || [])[1]
  || '/assets/index.js'

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 由 scripts/make-admin-shell.mjs 生成；CSS 取自 dist/index.html 构建产物 -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin | LINFAIR</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
${styles}
</head>
<body>
  <div id="root"></div>
  <script type="module" crossorigin src="${jsSrc}"></script>
</body>
</html>
`

for (const target of ['public/admin/index.html', 'dist/admin/index.html']) {
  const file = path.join(root, target)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
  console.log(`wrote ${target} (${Buffer.byteLength(html)} B, CSS ${Buffer.byteLength(styles)} B)`)
}
