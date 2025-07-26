"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { User, LogOut, Ticket, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
  const { user, logout, isAdmin } = useAuth()

  if (!user) return null

  const getInitials = (firstname?: string, lastname?: string) => {
    const first = firstname?.charAt(0)?.toUpperCase() || ""
    const last = lastname?.charAt(0)?.toUpperCase() || ""
    return first + last || user.username?.charAt(0)?.toUpperCase() || "U"
  }

  const getDisplayName = () => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`
    }
    return user.username || "User"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.profile_picture_url || "/placeholder-user.jpg"} alt={user.username || "User"} />
            <AvatarFallback className="text-sm">{getInitials(user.firstname, user.lastname)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium leading-none">{getDisplayName()}</span>
            <span className="text-xs text-muted-foreground leading-none mt-1">@{user.username}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Admin-specific menu items */}
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </DropdownMenuItem>

        {/* Regular user menu items */}
        {!isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/tickets">
              <Ticket className="mr-2 h-4 w-4" />
              My Tickets
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
