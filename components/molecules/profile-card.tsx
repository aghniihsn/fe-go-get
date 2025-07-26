import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"

interface ProfileCardProps {
  user: User
}

export function ProfileCard({ user }: ProfileCardProps) {
  const getInitials = (firstname?: string, lastname?: string, username?: string) => {
    const first = firstname?.charAt(0)?.toUpperCase() || ""
    const last = lastname?.charAt(0)?.toUpperCase() || ""
    return first + last || username?.charAt(0)?.toUpperCase() || "U"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "user":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.profile_picture_url || "/placeholder-user.jpg"} alt={user.username} />
            <AvatarFallback className="text-xl">
              {getInitials(user.firstname, user.lastname, user.username)}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-lg">
          {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username}
        </CardTitle>
        <div className="flex items-center justify-center space-x-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            Role:
          </span>
          <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
            {user.role}
          </Badge>
        </div>

        {user.phone_number && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Phone:
            </span>
            <span className="text-sm font-medium">{user.phone_number}</span>
          </div>
        )}

        {user.address && (
          <div className="flex items-start justify-between">
            <span className="text-sm text-muted-foreground flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Address:
            </span>
            <span className="text-sm font-medium text-right max-w-[60%]">{user.address}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-muted-foreground flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Joined:
          </span>
          <span className="text-sm font-medium">{formatDate(user.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
