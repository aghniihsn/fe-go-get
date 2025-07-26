"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/atoms/logo"
import { UserMenu } from "@/components/molecules/user-menu"
import { ThemeToggle } from "@/components/atoms/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Menu, Film, Ticket, Shield } from "lucide-react"

export function Navbar() {
  const { user, isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Different navigation items for admin vs regular users
  const navigation = isAdmin
    ? [
        { name: "Dashboard", href: "/admin", icon: Shield },
        { name: "Films", href: "/admin/films", icon: Film },
        { name: "Tickets", href: "/admin/tickets", icon: Ticket },
      ]
    : [
        { name: "Films", href: "/films", icon: Film },
        { name: "My Tickets", href: "/tickets", icon: Ticket },
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4">
              <Logo />
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex md:hidden">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="transition-colors hover:text-primary">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4 ml-auto">
          <ThemeToggle />
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
