// hooks/useAuth.ts
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    const storedUser = localStorage.getItem('user')
    
    if (token) {
      setAuthenticated(true)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  const login = (token: string, userData?: any) => {
    Cookies.set('token', token, { expires: 1, path: '/' })
    setAuthenticated(true)
    
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
    
    router.push('/dashboard')
  }

  const logout = () => {
    Cookies.remove('token', { path: '/' })
    localStorage.removeItem('user')
    setAuthenticated(false)
    setUser(null)
    router.push('/login')
  }

  return { 
    authenticated, 
    user,
    login, 
    logout 
  }
}