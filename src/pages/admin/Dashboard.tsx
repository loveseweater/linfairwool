import { useState, useEffect, useRef } from 'react'
import { fetchData, saveData, resetData, logout, downloadDataFile, importDataFile, fetchSiteContent, saveSiteContent, resetSiteContent } from '../../utils/api'
import { motion } from 'framer-motion'
import type { SiteContent } from '../../data/siteContent'
import { useLang } from '../../context/LanguageContext'
import { getEmailConfig, saveEmailConfig, hasEmailConfig, sendNotification } from '../../utils/emailService'
import type { NotificationPayload } from '../../utils/emailService'

interface Product {
  id: string
  name: string
  category: 'Men' | 'Women'
  subcategory: string
  description: string
  specs: string[]
  image: string
  gallery: string[]
  video?: string
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  image: string
}

type Tab = 'products' | 'blog' | 'siteContent' | 'inquiries' | 'social' | 'navigation' | 'analytics' | 'subscriptions' | 'email'
type SiteContentTab = 'home' | 'about' | 'contact'

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState<Tab>('products')
  const [siteContentTab, setSiteContentTab] = useState<SiteContentTab>('home')
  const [products, setProducts] = useState<Product[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [notifySubscribers, setNotifySubscribers] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [data, content] = await Promise.all([
        fetchData(),
        fetchSiteContent(),
      ])
      setProducts(data.products)
      setBlogPosts(data.blogPosts)
      setSiteContent(content)
    } catch (err: any) {
      setMessage(t('admin.loadFailed') + ': ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      // Always save to localStorage first (works offline)
      const dataOk = await saveData({ products, blogPosts })
      let contentOk = true
      if (siteContent) contentOk = await saveSiteContent(siteContent)
      
      if (dataOk && contentOk) {
        setMessage(t('admin.saveSuccess'))
      } else {
        setMessage(t('admin.saveLocal'))
      }

      // Send email notification if enabled
      if (notifySubscribers && hasEmailConfig()) {
        const notification: NotificationPayload = {
          type: (activeTab === 'products' ? 'product' : 'blog') as 'product' | 'blog',
          title: activeTab === 'products' ? 'New products updated' : 'New blog post published',
          summary: activeTab === 'products'
            ? `${products.length} products available on LINFAIR Wool`
            : `Check out our latest blog post on LINFAIR Wool`,
          url: activeTab === 'products' ? 'https://www.linfairwool.cn/products' : 'https://www.linfairwool.cn/blog',
        }
        const result = await sendNotification(notification)
        if (result.success) {
          setMessage(prev => prev + ' | ' + result.message)
        }
        setNotifySubscribers(false)
      }

      setTimeout(() => setMessage(''), 5000)
    } catch (err: any) {
      setMessage('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    try {
      await resetData()
      await resetSiteContent()
      await loadData()
      setMessage(t('admin.saveLocal'))
      setShowResetConfirm(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage('Reset failed: ' + err.message)
    }
  }

  const handleExport = () => {
    downloadDataFile()
    setMessage('Data exported to file!')
    setTimeout(() => setMessage(''), 5000)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await importDataFile(file)
    if (result) {
      setProducts(result.products)
      setBlogPosts(result.blogPosts)
      setSiteContent(result.siteContent)
      setMessage('Data imported successfully!')
    } else {
      setMessage('Invalid file format')
    }
    // Reset input so same file can be re-imported
    if (importInputRef.current) importInputRef.current.value = ''
    setTimeout(() => setMessage(''), 5000)
  }

  const handleLogout = () => {
    logout()
    onLogout()
  }

  // Product CRUD
  const addProduct = () => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: 'New Product',
      category: 'Men',
      subcategory: 'Crew Neck',
      description: 'Product description',
      specs: ['Spec 1', 'Spec 2'],
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80',
      gallery: [],
      video: '',
    }
    setProducts([...products, newProduct])
  }

  const deleteProduct = (id: string) => {
    if (confirm(t('admin.confirmDeleteProduct'))) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const updateProduct = (id: string, field: string, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  // Blog CRUD
  const addBlog = () => {
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title: 'New Blog Post',
      excerpt: 'Write a brief excerpt here...',
      content: 'Write your full article content here...',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      category: 'Fabric Guide',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    }
    setBlogPosts([...blogPosts, newBlog])
  }

  const deleteBlog = (id: string) => {
    if (confirm(t('admin.confirmDeletePost'))) {
      setBlogPosts(blogPosts.filter(b => b.id !== id))
    }
  }

  const updateBlog = (id: string, field: string, value: any) => {
    setBlogPosts(blogPosts.map(b => b.id === id ? { ...b, [field]: value } : b))
  }

  // Site Content helpers
  const updateSiteContent = (path: string, value: any) => {
    if (!siteContent) return
    const newContent = JSON.parse(JSON.stringify(siteContent))
    const keys = path.split('.')
    let obj: any = newContent
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]]
    }
    obj[keys[keys.length - 1]] = value
    setSiteContent(newContent)
  }

  const updateArrayItem = (path: string, index: number, field: string, value: string) => {
    if (!siteContent) return
    const newContent = JSON.parse(JSON.stringify(siteContent))
    const keys = path.split('.')
    let obj: any = newContent
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]]
    }
    obj[index][field] = value
    setSiteContent(newContent)
  }

  const addArrayItem = (path: string, template: any) => {
    if (!siteContent) return
    const newContent = JSON.parse(JSON.stringify(siteContent))
    const keys = path.split('.')
    let obj: any = newContent
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]]
    }
    obj.push({ ...template })
    setSiteContent(newContent)
  }

  const removeArrayItem = (path: string, index: number) => {
    if (!siteContent) return
    const newContent = JSON.parse(JSON.stringify(siteContent))
    const keys = path.split('.')
    let obj: any = newContent
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]]
    }
    obj.splice(index, 1)
    setSiteContent(newContent)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-lg">{t('admin.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a0f0a]">
      {/* Header */}
      <header className="bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif text-[#D4A574] font-bold">{t('admin.title')}</h1>
            <a href="/" target="_blank" className="text-gray-400 text-sm hover:text-[#D4A574] transition-colors">
              {t('admin.viewSite')} →
            </a>
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <span className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </span>
            )}
            <input
              ref={importInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => importInputRef.current?.click()}
              className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-[#D4A574] hover:border-[#D4A574]/30 transition-colors text-sm"
              title={t('admin.titleImport')}
            >
              {t('admin.import')}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-[#D4A574] hover:border-[#D4A574]/30 transition-colors text-sm"
              title={t('admin.titleExport')}
            >
              {t('admin.export')}
            </button>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={notifySubscribers}
                onChange={e => setNotifySubscribers(e.target.checked)}
                className="w-4 h-4 accent-[#D4A574]"
              />
              <span className="text-xs text-gray-400">通知订阅用户</span>
            </label>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#D4A574] text-[#1a0f0a] font-semibold rounded-lg hover:bg-[#c49564] transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? t('admin.saving') : t('admin.save')}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-[#D4A574]/10 border-b border-[#D4A574]/20">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-[#D4A574] text-xs">
            💡 {t('admin.saveSuccess')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'products' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('admin.tabProducts')}
              {activeTab === 'products' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'blog' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('admin.tabBlog')}
              {activeTab === 'blog' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('siteContent')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'siteContent' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('admin.tabContent')}
              {activeTab === 'siteContent' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'inquiries' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('admin.tabInquiries')}
              {activeTab === 'inquiries' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'social' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              社媒链接
              {activeTab === 'social' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('navigation')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'navigation' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              导航管理
              {activeTab === 'navigation' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'analytics' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              流量统计
              {activeTab === 'analytics' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'subscriptions' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              订阅通知
              {activeTab === 'subscriptions' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'email' ? 'text-[#D4A574]' : 'text-gray-400 hover:text-white'
              }`}
            >
              邮件通知
              {activeTab === 'email' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A574]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-white font-medium">{t('admin.tabProducts')} ({products.length})</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-red-400 hover:border-red-400/30 transition-colors text-sm"
                >
                  {t('admin.reset')}
                </button>
                <button
                  onClick={addProduct}
                  className="px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-sm"
                >
                  {t('admin.addProduct')}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Image' }}
                        />
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.productName')}</label>
                          <input
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.category')}</label>
                          <select
                            value={product.category}
                            onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          >
                            {(siteContent?.categories || ['Women', 'Men']).map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.subcategory')}</label>
                          <input
                            value={product.subcategory}
                            onChange={(e) => updateProduct(product.id, 'subcategory', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          />
                        </div>
                        <div>
                          <ImageUpload label="Product Image" value={product.image} onChange={(v) => updateProduct(product.id, 'image', v)} />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-2">{t('admin.galleryImages', { count: product.gallery?.length || 0 })}</label>
                          <div className="flex flex-wrap gap-2">
                            {(product.gallery || []).map((img, gi) => (
                              <div key={gi} className="relative group">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                                  <img src={img} alt={`Gallery ${gi + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                </div>
                                <button
                                  onClick={() => {
                                    const newGallery = [...(product.gallery || [])]
                                    newGallery.splice(gi, 1)
                                    updateProduct(product.id, 'gallery', newGallery)
                                  }}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                            {(product.gallery?.length || 0) < 5 && (
                              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-[#D4A574]/50 transition-colors">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const reader = new FileReader()
                                    reader.onload = (ev) => {
                                      const result = ev.target?.result as string
                                      const newGallery = [...(product.gallery || []), result]
                                      updateProduct(product.id, 'gallery', newGallery)
                                    }
                                    reader.readAsDataURL(file)
                                    e.target.value = ''
                                  }}
                                />
                              </label>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{t('admin.galleryHint')}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.description')}</label>
                          <textarea
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] resize-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.specs')}</label>
                          <textarea
                            value={product.specs.join('\n')}
                            onChange={(e) => updateProduct(product.id, 'specs', e.target.value.split('\n').filter(s => s.trim()))}
                            rows={2}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] resize-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.videoUrl')}</label>
                          <input
                            value={product.video || ''}
                            onChange={(e) => updateProduct(product.id, 'video', e.target.value)}
                            placeholder={t('admin.placeholderVideoUrl')}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="self-start p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title={t('admin.titleDelete')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-white font-medium">{t('admin.tabBlog')} ({blogPosts.length})</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-red-400 hover:border-red-400/30 transition-colors text-sm"
                >
                  {t('admin.reset')}
                </button>
                <button
                  onClick={addBlog}
                  className="px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-sm"
                >
                  {t('admin.addBlog')}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Image' }}
                        />
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.title')}</label>
                          <input
                            value={post.title}
                            onChange={(e) => updateBlog(post.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.excerpt')}</label>
                          <textarea
                            value={post.excerpt}
                            onChange={(e) => updateBlog(post.id, 'excerpt', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.category')}</label>
                          <input
                            value={post.category}
                            onChange={(e) => updateBlog(post.id, 'category', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.date')}</label>
                          <input
                            value={post.date}
                            onChange={(e) => updateBlog(post.id, 'date', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          />
                        </div>
                        <div className="col-span-2">
                          <ImageUpload label="Image" value={post.image} onChange={(v) => updateBlog(post.id, 'image', v)} />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">{t('admin.content')}</label>
                          <textarea
                            value={post.content || ''}
                            onChange={(e) => updateBlog(post.id, 'content', e.target.value)}
                            rows={12}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] resize-y font-mono leading-relaxed"
                            placeholder={t('admin.placeholderBlogContent')}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => deleteBlog(post.id)}
                        className="self-start p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title={t('admin.titleDelete')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'siteContent' && siteContent && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-white font-medium">{t('admin.tabContent')}</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-red-400 hover:border-red-400/30 transition-colors text-sm"
                >
                  {t('admin.reset')}
                </button>
              </div>
            </div>

            {/* Sub-tabs for site content */}
            <div className="flex gap-2 mb-6">
              {(['home', 'about', 'contact'] as SiteContentTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSiteContentTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    siteContentTab === tab
                      ? 'bg-[#D4A574] text-[#1a0f0a]'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {tab === 'home' ? 'Home' : tab === 'about' ? 'About' : 'Contact'}
                </button>
              ))}
            </div>

            {/* Home Page Editor */}
            {siteContentTab === 'home' && (
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.homeHero')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Subtitle" value={siteContent.home.hero.subtitle} onChange={(v) => updateSiteContent('home.hero.subtitle', v)} />
                    <InputField label="Title" value={siteContent.home.hero.title} onChange={(v) => updateSiteContent('home.hero.title', v)} />
                    <InputField label="Highlight" value={siteContent.home.hero.titleHighlight} onChange={(v) => updateSiteContent('home.hero.titleHighlight', v)} />
                    <InputField label="Button 1 Text" value={siteContent.home.hero.button1Text} onChange={(v) => updateSiteContent('home.hero.button1Text', v)} />
                    <InputField label="Button 1 Link" value={siteContent.home.hero.button1Link} onChange={(v) => updateSiteContent('home.hero.button1Link', v)} />
                    <InputField label="Button 2 Text" value={siteContent.home.hero.button2Text} onChange={(v) => updateSiteContent('home.hero.button2Text', v)} />
                    <InputField label="Button 2 Link" value={siteContent.home.hero.button2Link} onChange={(v) => updateSiteContent('home.hero.button2Link', v)} />
                    <ImageUpload label="Image" value={siteContent.home.hero.image} onChange={(v) => updateSiteContent('home.hero.image', v)} />
                    <div className="col-span-2">
                      <TextAreaField label="Description" value={siteContent.home.hero.description} onChange={(v) => updateSiteContent('home.hero.description', v)} />
                    </div>
                    <MultiImageUpload label="Hero Background Images (轮播背景图)" images={siteContent.home.hero.heroImages} onChange={(v) => updateSiteContent('home.hero.heroImages', v)} />
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#D4A574] font-medium text-base">{t('admin.statistics')}</h3>
                    <button
                      onClick={() => addArrayItem('home.stats', { value: '0', label: 'New Stat' })}
                      className="px-3 py-1 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {siteContent.home.stats.map((stat, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <InputField label="Value" value={stat.value} onChange={(v) => updateArrayItem('home.stats', i, 'value', v)} />
                        <InputField label="Label" value={stat.label} onChange={(v) => updateArrayItem('home.stats', i, 'label', v)} />
                        <button
                          onClick={() => removeArrayItem('home.stats', i)}
                          className="mt-6 p-1 text-gray-500 hover:text-red-400 shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Story */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.brandStory')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Subtitle" value={siteContent.home.brandStory.subtitle} onChange={(v) => updateSiteContent('home.brandStory.subtitle', v)} />
                    <InputField label="Title" value={siteContent.home.brandStory.title} onChange={(v) => updateSiteContent('home.brandStory.title', v)} />
                    <InputField label="Highlight" value={siteContent.home.brandStory.titleHighlight} onChange={(v) => updateSiteContent('home.brandStory.titleHighlight', v)} />
                    <InputField label="Button Text" value={siteContent.home.brandStory.buttonText} onChange={(v) => updateSiteContent('home.brandStory.buttonText', v)} />
                    <InputField label="Button Link" value={siteContent.home.brandStory.buttonLink} onChange={(v) => updateSiteContent('home.brandStory.buttonLink', v)} />
                    <ImageUpload label="Image" value={siteContent.home.brandStory.image} onChange={(v) => updateSiteContent('home.brandStory.image', v)} />
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">{t('admin.paragraphsOnePerLine')}</label>
                      <textarea
                        value={siteContent.home.brandStory.paragraphs.join('\n\n')}
                        onChange={(e) => updateSiteContent('home.brandStory.paragraphs', e.target.value.split('\n\n').filter(s => s.trim()))}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Advantages */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#D4A574] font-medium text-base">{t('admin.advantages')}</h3>
                    <button
                      onClick={() => addArrayItem('home.advantages', { title: t('admin.newAdvantage'), description: t('admin.description') })}
                      className="px-3 py-1 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {siteContent.home.advantages.map((adv, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <InputField label="Title" value={adv.title} onChange={(v) => updateArrayItem('home.advantages', i, 'title', v)} />
                        <InputField label="Description" value={adv.description} onChange={(v) => updateArrayItem('home.advantages', i, 'description', v)} />
                        <button
                          onClick={() => removeArrayItem('home.advantages', i)}
                          className="mt-6 p-1 text-gray-500 hover:text-red-400 shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.ctaSection')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <InputField label="Title" value={siteContent.home.cta.title} onChange={(v) => updateSiteContent('home.cta.title', v)} />
                    </div>
                    <div className="col-span-2">
                      <TextAreaField label="Description" value={siteContent.home.cta.description} onChange={(v) => updateSiteContent('home.cta.description', v)} />
                    </div>
                    <InputField label="Button Text" value={siteContent.home.cta.buttonText} onChange={(v) => updateSiteContent('home.cta.buttonText', v)} />
                    <InputField label="Button Link" value={siteContent.home.cta.buttonLink} onChange={(v) => updateSiteContent('home.cta.buttonLink', v)} />
                  </div>
                </div>
              </div>
            )}

            {/* About Page Editor */}
            {siteContentTab === 'about' && (
              <div className="space-y-6">
                {/* Hero */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.aboutHero')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Subtitle" value={siteContent.about.hero.subtitle} onChange={(v) => updateSiteContent('about.hero.subtitle', v)} />
                    <InputField label="Title" value={siteContent.about.hero.title} onChange={(v) => updateSiteContent('about.hero.title', v)} />
                    <InputField label="Highlight" value={siteContent.about.hero.titleHighlight} onChange={(v) => updateSiteContent('about.hero.titleHighlight', v)} />
                    <div className="col-span-2">
                      <TextAreaField label="Description" value={siteContent.about.hero.description} onChange={(v) => updateSiteContent('about.hero.description', v)} />
                    </div>
                    <MultiImageUpload label="Hero Background Images (轮播背景图)" images={siteContent.about.hero.heroImages} onChange={(v) => updateSiteContent('about.hero.heroImages', v)} />
                  </div>
                </div>

                {/* Intro */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.companyIntro')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Title" value={siteContent.about.intro.title} onChange={(v) => updateSiteContent('about.intro.title', v)} />
                    <InputField label="Highlight" value={siteContent.about.intro.titleHighlight} onChange={(v) => updateSiteContent('about.intro.titleHighlight', v)} />
                    <ImageUpload label="Image" value={siteContent.about.intro.image} onChange={(v) => updateSiteContent('about.intro.image', v)} />
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">{t('admin.paragraphsBlankLine')}</label>
                      <textarea
                        value={siteContent.about.intro.paragraphs.join('\n\n')}
                        onChange={(e) => updateSiteContent('about.intro.paragraphs', e.target.value.split('\n\n').filter(s => s.trim()))}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] resize-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs text-gray-500">{t('admin.statistics')}</label>
                      <button
                        onClick={() => addArrayItem('about.intro.stats', { value: '0', label: 'New Stat' })}
                        className="px-3 py-1 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      {siteContent.about.intro.stats.map((stat, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <InputField label="Value" value={stat.value} onChange={(v) => updateArrayItem('about.intro.stats', i, 'value', v)} />
                          <InputField label="Label" value={stat.label} onChange={(v) => updateArrayItem('about.intro.stats', i, 'label', v)} />
                          <button
                            onClick={() => removeArrayItem('about.intro.stats', i)}
                            className="mt-6 p-1 text-gray-500 hover:text-red-400 shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Values */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#D4A574] font-medium text-base">{t('admin.coreValues')}</h3>
                    <button
                      onClick={() => addArrayItem('about.values', { title: t('admin.newValue'), description: t('admin.description') })}
                      className="px-3 py-1 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
                    >
                      + 添加
                    </button>
                  </div>
                  <div className="space-y-3">
                    {siteContent.about.values.map((val, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <InputField label="Title" value={val.title} onChange={(v) => updateArrayItem('about.values', i, 'title', v)} />
                        <InputField label="Description" value={val.description} onChange={(v) => updateArrayItem('about.values', i, 'description', v)} />
                        <button
                          onClick={() => removeArrayItem('about.values', i)}
                          className="mt-6 p-1 text-gray-500 hover:text-red-400 shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#D4A574] font-medium text-base">{t('admin.timeline')}</h3>
                    <button
                      onClick={() => addArrayItem('about.timeline', { year: '2026', title: t('admin.newMilestone'), description: t('admin.description') })}
                      className="px-3 py-1 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {siteContent.about.timeline.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <InputField label="Year" value={item.year} onChange={(v) => updateArrayItem('about.timeline', i, 'year', v)} />
                        <InputField label="Title" value={item.title} onChange={(v) => updateArrayItem('about.timeline', i, 'title', v)} />
                        <InputField label="Description" value={item.description} onChange={(v) => updateArrayItem('about.timeline', i, 'description', v)} />
                        <button
                          onClick={() => removeArrayItem('about.timeline', i)}
                          className="mt-6 p-1 text-gray-500 hover:text-red-400 shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.ctaSection')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <InputField label="Title" value={siteContent.about.cta.title} onChange={(v) => updateSiteContent('about.cta.title', v)} />
                    </div>
                    <div className="col-span-2">
                      <TextAreaField label="Description" value={siteContent.about.cta.description} onChange={(v) => updateSiteContent('about.cta.description', v)} />
                    </div>
                    <InputField label="Button Text" value={siteContent.about.cta.buttonText} onChange={(v) => updateSiteContent('about.cta.buttonText', v)} />
                    <InputField label="Button Link" value={siteContent.about.cta.buttonLink} onChange={(v) => updateSiteContent('about.cta.buttonLink', v)} />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Page Editor */}
            {siteContentTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.contactPage')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Subtitle" value={siteContent.contact.subtitle} onChange={(v) => updateSiteContent('contact.subtitle', v)} />
                    <InputField label="Title" value={siteContent.contact.title} onChange={(v) => updateSiteContent('contact.title', v)} />
                    <InputField label="Highlight" value={siteContent.contact.titleHighlight} onChange={(v) => updateSiteContent('contact.titleHighlight', v)} />
                    <div className="col-span-2">
                      <TextAreaField label="Description" value={siteContent.contact.description} onChange={(v) => updateSiteContent('contact.description', v)} />
                    </div>
                    <InputField label="Address" value={siteContent.contact.address} onChange={(v) => updateSiteContent('contact.address', v)} />
                    <InputField label="Email" value={siteContent.contact.email} onChange={(v) => updateSiteContent('contact.email', v)} />
                    <InputField label="Phone" value={siteContent.contact.phone} onChange={(v) => updateSiteContent('contact.phone', v)} />
                    <InputField label="Working Hours" value={siteContent.contact.workingHours} onChange={(v) => updateSiteContent('contact.workingHours', v)} />
                    <InputField label="Form Title" value={siteContent.contact.formTitle} onChange={(v) => updateSiteContent('contact.formTitle', v)} />
                    <InputField label="WhatsApp Number" value={siteContent.contact.whatsapp} onChange={(v) => updateSiteContent('contact.whatsapp', v)} />
                    <InputField label="WhatsApp Message" value={siteContent.contact.whatsappMessage} onChange={(v) => updateSiteContent('contact.whatsappMessage', v)} />
                    <MultiImageUpload label="Hero Background Images (轮播背景图)" images={siteContent.contact.heroImages} onChange={(v) => updateSiteContent('contact.heroImages', v)} />
                  </div>
                </div>

                {/* Categories Management */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#D4A574] font-medium text-base">产品分类管理</h3>
                    <button
                      onClick={() => {
                        const newContent = JSON.parse(JSON.stringify(siteContent))
                        newContent.categories.push(t('admin.newCategory'))
                        setSiteContent(newContent)
                      }}
                      className="px-3 py-1 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
                    >
                      + 添加分类
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">管理产品分类，产品编辑时可以从这些分类中选择。</p>
                  <div className="space-y-2">
                    {siteContent.categories.map((cat, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <span className="text-gray-500 text-xs w-6">#{i + 1}</span>
                        <input
                          value={cat}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(siteContent))
                            newContent.categories[i] = e.target.value
                            setSiteContent(newContent)
                          }}
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                        />
                        <button
                          onClick={() => {
                            const newContent = JSON.parse(JSON.stringify(siteContent))
                            newContent.categories.splice(i, 1)
                            setSiteContent(newContent)
                          }}
                          className="p-1 text-gray-500 hover:text-red-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blog & Products Hero Images */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">Blog & Products - 轮播背景图</h3>
                  <p className="text-gray-400 text-xs mb-4">管理博客和产品页面的轮播背景图片。</p>
                  <div className="space-y-4">
                    <MultiImageUpload label="Blog 页面背景图" images={siteContent.blogHeroImages} onChange={(v) => updateSiteContent('blogHeroImages', v)} />
                    <MultiImageUpload label="Products 页面背景图" images={siteContent.productsHeroImages} onChange={(v) => updateSiteContent('productsHeroImages', v)} />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">Logo 上传</h3>
                  <p className="text-gray-400 text-xs mb-4">上传新的 Logo 图片，支持 JPG/PNG。建议尺寸：200x60px</p>
                  <ImageUpload label="Logo" value={siteContent.logo} onChange={(v) => updateSiteContent('logo', v)} />
                </div>

                {/* Social Links */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-[#D4A574] font-medium mb-4 text-base">{t('admin.socialLinks')}</h3>
                  <p className="text-gray-400 text-xs mb-4">{t('admin.socialHint')}</p>
                  <div className="space-y-3">
                    {siteContent.socialLinks.map((social, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={social.enabled}
                            onChange={(e) => {
                              if (!siteContent) return
                              const newContent = JSON.parse(JSON.stringify(siteContent))
                              newContent.socialLinks[i].enabled = e.target.checked
                              setSiteContent(newContent)
                            }}
                            className="w-4 h-4 rounded accent-[#D4A574]"
                          />
                          <span className="text-white text-sm min-w-[80px]">{social.name}</span>
                        </label>
                        <input
                          value={social.url}
                          onChange={(e) => updateArrayItem('socialLinks', i, 'url', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
                          placeholder={t('admin.placeholderSocialUrl')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && <InquiriesManager />}
        {activeTab === 'social' && siteContent && <SocialManager siteContent={siteContent} setSiteContent={setSiteContent} />}
        {activeTab === 'navigation' && siteContent && <NavManager siteContent={siteContent} setSiteContent={setSiteContent} />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'subscriptions' && <SubscriptionManager />}
        {activeTab === 'email' && <EmailConfigManager />}
      </div>

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a0f0a] border border-white/10 rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-white font-medium mb-2">{t('admin.confirmReset')}</h3>
            <p className="text-gray-400 text-sm mb-6">{t('admin.resetConfirm')}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                {t('admin.confirmReset')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Inquiries Manager ─── */
function InquiriesManager() {
  const { t } = useLang()
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => {
    loadInquiries()
  }, [])

  const loadInquiries = () => {
    setLoading(true)
    setError('')
    try {
      const raw = localStorage.getItem('linfair_inquiries')
      if (raw) {
        const data = JSON.parse(raw)
        setInquiries(data)
      } else {
        setInquiries([])
      }
    } catch {
      setError('加载询盘失败')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id: string) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, read: true } : i)
    setInquiries(updated)
    localStorage.setItem('linfair_inquiries', JSON.stringify(updated))
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-[#D4A574] text-sm">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-sm mb-4">{error}</div>
        <button
          onClick={loadInquiries}
          className="px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-sm"
        >
          重新加载
        </button>
      </div>
    )
  }

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="mb-4 text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          返回列表
        </button>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-white font-medium">{selected.subject}</h3>
            <span className="text-xs text-gray-500">{new Date(selected.createdAt).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
            <div>
              <span className="text-xs text-gray-500">{t('admin.name')}</span>
              <p className="text-white text-sm">{selected.name}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">{t('admin.email')}</span>
              <p className="text-white text-sm">
                <a href={`mailto:${selected.email}`} className="hover:text-[#D4A574]">{selected.email}</a>
              </p>
            </div>
            {selected.company && (
              <div>
                <span className="text-xs text-gray-500">{t('admin.company')}</span>
                <p className="text-white text-sm">{selected.company}</p>
              </div>
            )}
            <div>
              <span className="text-xs text-gray-500">{t('admin.submitted')}</span>
              <p className="text-white text-sm">{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500">{t('admin.message')}</span>
            <p className="text-white text-sm mt-2 whitespace-pre-wrap bg-white/5 p-4 rounded-lg">{selected.message}</p>
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
              className="px-4 py-2 bg-[#D4A574] text-[#1a0f0a] font-medium rounded-lg hover:bg-[#c49564] transition-colors text-sm"
            >
              邮件回复
            </a>
            <button
              onClick={() => { markAsRead(selected.id); setSelected(null) }}
              className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-white transition-colors text-sm"
            >
              标记已读
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-medium">
          询盘列表 ({inquiries.length})
          {inquiries.filter(i => !i.read).length > 0 && (
            <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              {inquiries.filter(i => !i.read).length} 未读
            </span>
          )}
        </h2>
        <button
          onClick={loadInquiries}
          className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-white transition-colors text-sm"
        >
          刷新
        </button>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">{t('admin.noInquiries')}</div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => { setSelected(inq); markAsRead(inq.id) }}
              className={`bg-white/5 rounded-xl border cursor-pointer transition-all hover:bg-white/10 ${
                inq.read ? 'border-white/5 opacity-70' : 'border-[#D4A574]/30'
              } p-4`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!inq.read && <span className="w-2 h-2 bg-[#D4A574] rounded-full shrink-0" />}
                    <h4 className="text-white text-sm font-medium truncate">{inq.subject}</h4>
                  </div>
                  <p className="text-gray-400 text-xs truncate">
                    {inq.name} · {inq.email}
                  </p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{inq.message}</p>
                </div>
                <span className="text-gray-500 text-xs shrink-0">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Social Media Manager ─── */
function SocialManager({ siteContent, setSiteContent }: { siteContent: SiteContent; setSiteContent: (c: SiteContent) => void }) {
  const { t } = useLang()
  const updateSocial = (index: number, field: string, value: any) => {
    const newContent = JSON.parse(JSON.stringify(siteContent))
    newContent.socialLinks[index][field] = value
    setSiteContent(newContent)
  }

  const addSocial = () => {
    const newContent = JSON.parse(JSON.stringify(siteContent))
    newContent.socialLinks.push({ name: t('admin.newPlatform'), url: 'https://', enabled: true })
    setSiteContent(newContent)
  }

  const removeSocial = (index: number) => {
    const newContent = JSON.parse(JSON.stringify(siteContent))
    newContent.socialLinks.splice(index, 1)
    setSiteContent(newContent)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-medium">社媒链接管理 ({siteContent.socialLinks.length})</h2>
        <button onClick={addSocial} className="px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-sm">+ 添加平台</button>
      </div>
      <div className="space-y-3">
        {siteContent.socialLinks.map((social, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={social.enabled} onChange={(e) => updateSocial(i, 'enabled', e.target.checked)} className="w-4 h-4 rounded accent-[#D4A574]" />
                <span className="text-white text-sm min-w-[90px]">{social.name}</span>
              </label>
              <input value={social.url} onChange={(e) => updateSocial(i, 'url', e.target.value)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" placeholder={t('admin.placeholderSocialUrl')} />
              <button onClick={() => removeSocial(i)} className="p-2 text-gray-500 hover:text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs mt-4">勾选 = 在页头和页脚显示，取消勾选 = 隐藏。保存后刷新网站生效。</p>
    </div>
  )
}

/* ─── Navigation Manager ─── */
function NavManager({ siteContent, setSiteContent }: { siteContent: SiteContent; setSiteContent: (c: SiteContent) => void }) {
  const { t } = useLang()
  const updateNav = (index: number, field: string, value: any) => {
    const newContent = JSON.parse(JSON.stringify(siteContent))
    newContent.navItems[index][field] = value
    setSiteContent(newContent)
  }

  const addNav = () => {
    const newContent = JSON.parse(JSON.stringify(siteContent))
    newContent.navItems.push({ label: t('admin.newPage'), path: '/new-page', enabled: true })
    setSiteContent(newContent)
  }

  const removeNav = (index: number) => {
    const newContent = JSON.parse(JSON.stringify(siteContent))
    newContent.navItems.splice(index, 1)
    setSiteContent(newContent)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-medium">导航管理 ({siteContent.navItems.length})</h2>
        <button onClick={addNav} className="px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-sm">+ 添加导航</button>
      </div>
      <div className="space-y-3">
        {siteContent.navItems.map((item, i) => (
          <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={item.enabled} onChange={(e) => updateNav(i, 'enabled', e.target.checked)} className="w-4 h-4 rounded accent-[#D4A574]" />
              </label>
              <input value={item.label} onChange={(e) => updateNav(i, 'label', e.target.value)} className="w-40 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" placeholder={t('admin.placeholderLabel')} />
              <input value={item.path} onChange={(e) => updateNav(i, 'path', e.target.value)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" placeholder={t('admin.placeholderPath')} />
              <button onClick={() => removeNav(i)} className="p-2 text-gray-500 hover:text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-xs mt-4">勾选 = 在导航栏显示，取消勾选 = 隐藏。保存后刷新网站生效。</p>
    </div>
  )
}

/* ─── Analytics Dashboard ─── */
function AnalyticsDashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('linfair_analytics')
      if (raw) setEvents(JSON.parse(raw))
    } catch {}
    setLoading(false)
  }, [])

  const clearAnalytics = () => {
    localStorage.removeItem('linfair_analytics')
    setEvents([])
  }

  if (loading) return <div className="text-center py-12 text-[#D4A574] text-sm">加载中...</div>

  const today = new Date().toLocaleDateString()
  const todayEvents = events.filter(e => new Date(e.timestamp).toLocaleDateString() === today)
  const uniquePages = [...new Set(events.map(e => e.page))]
  const uniqueIPs = [...new Set(events.map(e => e.ip || 'unknown'))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-medium">流量统计</h2>
        <button onClick={clearAnalytics} className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-red-400 transition-colors text-sm">清空数据</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{events.length}</div>
          <div className="text-xs text-gray-500 mt-1">总访问量</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-[#D4A574]">{todayEvents.length}</div>
          <div className="text-xs text-gray-500 mt-1">今日访问</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{uniquePages.length}</div>
          <div className="text-xs text-gray-500 mt-1">浏览页面数</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{uniqueIPs.length}</div>
          <div className="text-xs text-gray-500 mt-1">访客数</div>
        </div>
      </div>

      {/* Page Views Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-[#D4A574] font-medium mb-4 text-base">页面访问排行</h3>
        <div className="space-y-2">
          {(() => {
            const pageCounts: Record<string, number> = {}
            events.forEach(e => { pageCounts[e.page] = (pageCounts[e.page] || 0) + 1 })
            const sorted = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])
            return sorted.map(([page, count], i) => (
              <div key={page} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-6">#{i + 1}</span>
                  <span className="text-white text-sm">{page || '/'}</span>
                </div>
                <span className="text-[#D4A574] text-sm font-medium">{count} 次</span>
              </div>
            ))
          })()}
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-4">流量数据存储在浏览器中，清空缓存会丢失。建议定期导出备份。</p>
    </div>
  )
}

/* ─── Subscription Manager ─── */
function SubscriptionManager() {
  const { t } = useLang()
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('linfair_subscribers')
      if (raw) setSubscribers(JSON.parse(raw))
    } catch {}
    setLoading(false)
  }, [])

  const exportSubscribers = () => {
    const csv = 'Email,Date\n' + subscribers.map(s => `${s.email},${s.createdAt}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="text-center py-12 text-[#D4A574] text-sm">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-medium">订阅通知 ({subscribers.length})</h2>
        {subscribers.length > 0 && (
          <button onClick={exportSubscribers} className="px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-sm">
            导出 CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">暂无订阅用户</div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">{t('admin.email')}</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">订阅时间</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, i) => (
                <tr key={sub.id || i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white text-sm">{sub.email}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{new Date(sub.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Helper components
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
      />
    </div>
  )
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] resize-none"
      />
    </div>
  )
}

/* ─── Image Upload Component ─── */

/* ─── Email Config Manager ─── */
function EmailConfigManager() {
  useLang() // for future translations
  const [config, setConfig] = useState({ serviceId: '', templateId: '', publicKey: '', fromName: 'LINFAIR Wool', replyTo: 'info@linfairwool.cn' })
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState('')

  useEffect(() => {
    const existing = getEmailConfig()
    if (existing) setConfig(existing)
  }, [])

  const handleSave = () => {
    saveEmailConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTest = async () => {
    setTestStatus('发送中...')
    const result = await sendNotification({
      type: 'blog',
      title: 'Test Notification',
      summary: 'This is a test email from LINFAIR Wool website.',
      url: 'https://www.linfairwool.cn/',
    })
    setTestStatus(result.message)
    setTimeout(() => setTestStatus(''), 5000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-medium">邮件通知设置</h2>
        <div className="flex gap-3">
          <button onClick={handleTest} className="px-4 py-2 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-sm">
            发送测试邮件
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#D4A574]/90 transition-colors text-sm">
            保存设置
          </button>
        </div>
      </div>

      {saved && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">设置已保存</div>}
      {testStatus && <div className="mb-4 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm">{testStatus}</div>}

      <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-4">
        <p className="text-gray-400 text-sm leading-relaxed">
          配置 EmailJS 服务后，当您发布新产品或博客文章时，系统会自动发送邮件通知给所有订阅用户。
        </p>

        <div className="p-4 bg-[#D4A574]/10 border border-[#D4A574]/20 rounded-lg">
          <h3 className="text-white text-sm font-medium mb-2">如何获取？</h3>
          <ol className="text-gray-400 text-xs space-y-1.5 list-decimal list-inside">
            <li>打开 <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A574] hover:underline">emailjs.com</a> 注册免费账号</li>
            <li>创建 Email Service（连接你的邮箱，推荐 Gmail）</li>
            <li>创建 Email Template，模板变量：to_email, to_name, from_name, reply_to, subject, message, type, title, summary, url</li>
            <li>在 Account → API Keys 获取 Public Key</li>
            <li>将 Service ID、Template ID、Public Key 填入下方</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Service ID</label>
            <input value={config.serviceId} onChange={e => setConfig({...config, serviceId: e.target.value})}
              placeholder="service_xxxxxxx"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Template ID</label>
            <input value={config.templateId} onChange={e => setConfig({...config, templateId: e.target.value})}
              placeholder="template_xxxxxxx"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Public Key</label>
            <input value={config.publicKey} onChange={e => setConfig({...config, publicKey: e.target.value})}
              placeholder="xxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">发件人名称</label>
            <input value={config.fromName} onChange={e => setConfig({...config, fromName: e.target.value})}
              placeholder="LINFAIR Wool"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">回复邮箱</label>
            <input value={config.replyTo} onChange={e => setConfig({...config, replyTo: e.target.value})}
              placeholder="info@linfairwool.cn"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]" />
          </div>
        </div>

        <div className="p-4 bg-[#1B2A4A]/30 border border-white/10 rounded-lg">
          <h3 className="text-white text-sm font-medium mb-2">订阅用户</h3>
          <p className="text-gray-400 text-xs">配置完成后，每次保存产品/博客更新时，系统会询问是否发送通知给所有订阅用户。</p>
        </div>
      </div>
    </div>
  )
}

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const { t } = useLang()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      onChange(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('admin.placeholderImageUrl')}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574] mb-2"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
          >
            {t('admin.uploadImage')}
          </button>
        </div>
        {value && (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
            <img
              src={value}
              alt={t('admin.altPreview')}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}


function MultiImageUpload({ label, images, onChange }: { label: string; images: string[]; onChange: (v: string[]) => void }) {
  const { t } = useLang()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        onChange([...images, result])
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const updateImageUrl = (index: number, url: string) => {
    const newImages = [...images]
    newImages[index] = url
    onChange(newImages)
  }

  const addImage = () => {
    onChange([...images, ''])
  }

  return (
    <div className="col-span-2">
      <label className="block text-xs text-gray-500 mb-2">{label}</label>
      <div className="space-y-2">
        {images.map((img, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={img}
              onChange={(e) => updateImageUrl(i, e.target.value)}
              placeholder={`图片链接 ${i + 1}`}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4A574]"
            />
            {img && (
              <div className="w-10 h-10 rounded overflow-hidden bg-white/5 border border-white/10 shrink-0">
                <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
            <button
              onClick={() => removeImage(i)}
              className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <button
            onClick={addImage}
            className="px-3 py-1.5 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
          >
            + 添加图片链接
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-[#D4A574]/20 text-[#D4A574] border border-[#D4A574]/30 rounded-lg hover:bg-[#D4A574]/30 transition-colors text-xs"
          >
            {t('admin.uploadImage')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}
