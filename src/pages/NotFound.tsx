import { useEffect } from 'react'
import Button from '../components/ui/Button'

/**
 * SPA 内部兜底路由（客户端导航到未知路径时显示）。
 * 注意：线上真实 404 由 Cloudflare Pages 的 public/404.html 提供（真实 404 状态码），
 * 本组件只是防止客户端路由漏网；必须注入 noindex，避免被收录。
 */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | LINFAIR'
    // 复用模板已有的 robots meta（没有才新建），避免出现两个 robots meta
    const existed = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const meta = existed || (() => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'robots')
      document.head.appendChild(m)
      return m
    })()
    const prev = existed?.getAttribute('content') || null
    meta.setAttribute('content', 'noindex, nofollow')
    // 移除 SPA 模板残留的首页 canonical，避免错误自指
    const canonical = document.querySelector('link[rel="canonical"]')
    const prevCanonical = canonical?.getAttribute('href') || null
    canonical?.remove()
    return () => {
      if (existed && prev) meta.setAttribute('content', prev)
      else if (!existed) meta.remove()
      if (prevCanonical) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        link.setAttribute('href', prevCanonical)
        document.head.appendChild(link)
      }
    }
  }, [])

  return (
    <section className="py-32 bg-warm">
      <div className="container-custom text-center">
        <p className="text-accent font-semibold tracking-widest uppercase">404</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-display font-bold text-primary">
          Page Not Found
        </h1>
        <p className="mt-6 text-text-light text-lg max-w-xl mx-auto">
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button to="/" variant="accent">Back to Home</Button>
          <Button to="/products" variant="outline">View Products</Button>
        </div>
      </div>
    </section>
  )
}
