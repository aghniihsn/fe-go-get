import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface RatingBadgeProps {
  rating: string
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  const getRatingColor = (rating: string) => {
    switch (rating.toUpperCase()) {
      case "G":
        return "bg-green-100 text-green-800"
      case "PG":
        return "bg-blue-100 text-blue-800"
      case "PG-13":
        return "bg-yellow-100 text-yellow-800"
      case "R":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Badge className={getRatingColor(rating)}>
      <Star className="w-3 h-3 mr-1" />
      {rating}
    </Badge>
  )
}
