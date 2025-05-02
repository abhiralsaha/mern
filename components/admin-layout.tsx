"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaniniLogo } from "@/components/panini-logo"
import { checkAuth, logoutUser } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        toast({
          title: "Authentication error",
          description: "An error occurred while checking authentication",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [router, toast])

  const handleLogout = async () => {
    await logoutUser()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <PaniniLogo />
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/admin/create" className="text-sm font-medium hover:underline">
              Create
            </Link>
            <Link href="/admin/assign" className="text-sm font-medium hover:underline">
              Assign
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-12">{children}</div>
      </main>
    </div>
  )
}
