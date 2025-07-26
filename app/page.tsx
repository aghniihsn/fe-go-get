"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { HomeTemplate } from "@/components/templates/home-template"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated and is admin, redirect to admin dashboard
    if (!loading && user && isAdmin) {
      router.replace("/admin")
    }
  }, [user, loading, isAdmin, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If admin user, don't render homepage (will redirect)
  if (user && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Render homepage for regular users or non-authenticated users
  return <HomeTemplate />
}
