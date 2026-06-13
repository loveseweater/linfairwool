import { useState, useEffect } from 'react'
import AdminLogin from './Login'
import AdminDashboard from './Dashboard'
import { isLoggedIn } from '../../utils/api'

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
    setChecking(false)
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center">
        <div className="text-[#D4A574] text-lg">验证中...</div>
      </div>
    )
  }

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />
  }

  return <AdminDashboard onLogout={() => setLoggedIn(false)} />
}
