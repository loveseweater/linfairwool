import { useState } from 'react'
import { login } from '../../utils/api'
import { motion } from 'framer-motion'

interface LoginPageProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const success = await login(password)
    if (success) {
      onLogin()
    } else {
      setError('密码错误')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#D4A574] font-bold">
              LINFAIR
            </h1>
            <p className="text-gray-400 text-sm mt-2">管理后台</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">管理密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-[#D4A574] text-[#1a0f0a] font-semibold rounded-lg hover:bg-[#c49564] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-6">
            仅限管理员访问
          </p>
        </div>
      </motion.div>
    </div>
  )
}
