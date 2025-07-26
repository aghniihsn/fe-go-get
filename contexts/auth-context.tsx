"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ redirectTo: string }>
  register: (userData: any) => Promise<{ redirectTo: string }>
  logout: () => void
  loading: boolean
  isAdmin: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    const token = getCookie("token") || localStorage.getItem("token")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  const getCookie = (name: string) => {
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile")
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem("token")
      deleteCookie("token")
      delete api.defaults.headers.common["Authorization"]
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ redirectTo: string }> => {
    const response = await api.post("/auth/login", { email, password })
    const { token, user: userData } = response.data

    localStorage.setItem("token", token)
    setCookie("token", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(userData)

    // Determine redirect path based on user role
    const redirectTo = userData.role === "admin" ? "/admin" : "/"
    return { redirectTo }
  }

  const register = async (userData: any): Promise<{ redirectTo: string }> => {
    const response = await api.post("/auth/register", userData)
    const { token, user: newUser } = response.data

    localStorage.setItem("token", token)
    setCookie("token", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(newUser)

    // New users are typically regular users, redirect to homepage
    const redirectTo = newUser.role === "admin" ? "/admin" : "/"
    return { redirectTo }
  }

  const logout = () => {
    localStorage.removeItem("token")
    deleteCookie("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const refreshProfile = async () => {
    try {
      const response = await api.get("/auth/profile")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to refresh profile:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
