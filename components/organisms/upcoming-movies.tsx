"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import type { Schedule, Film } from "@/lib/types"
import { Calendar, Clock, MapPin, Loader2, FilmIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UpcomingSchedule extends Schedule {
  film?: Film
  daysFromNow?: number
}

export function UpcomingMovies() {
  const [upcomingSchedules, setUpcomingSchedules] = useState<UpcomingSchedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingSchedules()
  }, [])

  const fetchUpcomingSchedules = async () => {
    try {
      // Get today's date
      const today = new Date()
      const todayString = today.toISOString().split("T")[0]

      // Fetch all schedules
      const schedulesResponse = await api.get("/jadwals")
      const allSchedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []

      // Filter schedules for upcoming dates (next 7 days, excluding today)
      const upcomingSchedulesData = allSchedules.filter((schedule: Schedule) => {
        const scheduleDate = new Date(schedule.tanggal)
        const daysDiff = Math.ceil((scheduleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return daysDiff > 0 && daysDiff <= 7 // Next 7 days, excluding today
      })

      // Fetch films data to enrich schedules
      const filmsResponse = await api.get("/films")
      const films = Array.isArray(filmsResponse.data) ? filmsResponse.data : []
      const filmsMap = films.reduce((acc: { [key: string]: Film }, film: Film) => {
        acc[film._id] = film
        return acc
      }, {})

      // Enrich schedules with film data and calculate days from now
      const enrichedSchedules = upcomingSchedulesData.map((schedule: Schedule) => {
        const scheduleDate = new Date(schedule.tanggal)
        const daysFromNow = Math.ceil((scheduleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        return {
          ...schedule,
          film: filmsMap[schedule.film_id] || null,
          daysFromNow,
        }
      })

      // Sort by date, then by time
      enrichedSchedules.sort((a, b) => {
        const dateCompare = a.tanggal.localeCompare(b.tanggal)
        if (dateCompare !== 0) return dateCompare
        return a.waktu.localeCompare(b.waktu)
      })

      setUpcomingSchedules(enrichedSchedules)
    } catch (error) {
      console.error("Error fetching upcoming schedules:", error)
      setUpcomingSchedules([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (time: string) => {
    return time
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getDayLabel = (daysFromNow: number) => {
    switch (daysFromNow) {
      case 1:
        return { label: "Tomorrow", variant: "default" as const }
      case 2:
        return { label: "In 2 days", variant: "secondary" as const }
      case 3:
        return { label: "In 3 days", variant: "secondary" as const }
      default:
        return { label: `In ${daysFromNow} days`, variant: "outline" as const }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Upcoming Movies
          </CardTitle>
          <CardDescription>Movies coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Upcoming Movies
            </CardTitle>
            <CardDescription>
              {upcomingSchedules.length > 0
                ? `${upcomingSchedules.length} shows in the next 7 days`
                : "No upcoming shows scheduled"}
            </CardDescription>
          </div>
          {upcomingSchedules.length > 3 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/films">View All</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {upcomingSchedules.length === 0 ? (
          <div className="text-center py-8">
            <FilmIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Upcoming Shows</h3>
            <p className="text-muted-foreground mb-4">
              There are no movies scheduled for the next 7 days. Check back later for new schedules.
            </p>
            <Button asChild>
              <Link href="/films">Browse All Movies</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {upcomingSchedules.map((schedule) => {
              const dayLabel = getDayLabel(schedule.daysFromNow || 0)
              return (
                <div
                  key={schedule._id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {/* Movie Poster */}
                  <div className="w-16 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={schedule.film?.poster_url || "/placeholder.svg?height=96&width=64"}
                      alt={schedule.film?.title || "Movie"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 min-w-0">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm line-clamp-1">
                        {schedule.film?.title || schedule.film_title || "Unknown Movie"}
                      </h4>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(schedule.tanggal)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(schedule.waktu)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {schedule.ruangan}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={dayLabel.variant} className="text-xs">
                          {dayLabel.label}
                        </Badge>
                        <span className="text-sm font-medium text-primary">{formatPrice(schedule.harga)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/films/${schedule.film_id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
