import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingBadge } from "@/components/atoms/rating-badge"
import type { Film } from "@/lib/types"
import { Clock } from "lucide-react"

interface MovieCardProps {
  film: Film
}

export function MovieCard({ film }: MovieCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[2/3]">
        <Image
          src={film.poster_url || "/placeholder.svg?height=400&width=300"}
          alt={film.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <RatingBadge rating={film.rating} />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{film.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{film.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          {film.duration} min • {Array.isArray(film.genre) ? film.genre.join(", ") : film.genre}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/films/${film._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
