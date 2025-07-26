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

interface TodaySchedule extends Schedule {
  film?: Film
}

export function TodaysShows() {
  const [todaySchedules, setTodaySchedules] = useState<TodaySchedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodaySchedules()
  }, [])

  const fetchTodaySchedules = async () => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0]

      // Fetch all schedules
      const schedulesResponse = await api.get("/jadwals")
      const allSchedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []

      // Filter schedules for today
      const todaySchedulesData = allSchedules.filter((schedule: Schedule) => {
        return schedule.tanggal === today
      })

      // Fetch films data to enrich schedules
      const filmsResponse = await api.get("/films")
      const films = Array.isArray(filmsResponse.data) ? filmsResponse.data : []
      const filmsMap = films.reduce((acc: { [key: string]: Film }, film: Film) => {
        acc[film._id] = film
        return acc
      }, {})

      // Enrich schedules with film data
      const enrichedSchedules = todaySchedulesData.map((schedule: Schedule) => ({
        ...schedule,
        film: filmsMap[schedule.film_id] || null,
      }))

      // Sort by time
      enrichedSchedules.sort((a, b) => {
        return a.waktu.localeCompare(b.waktu)
      })

      setTodaySchedules(enrichedSchedules)
    } catch (error) {
      console.error("Error fetching today's schedules:", error)
      setTodaySchedules([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time: string) => {
    try {
      // Assuming time is in HH:MM format
      return time
    } catch (error) {
      return time
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTimeStatus = (time: string) => {
    const now = new Date()
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0")

    if (time < currentTime) {
      return { label: "Finished", variant: "secondary" as const }
    } else if (
      time <=
      (now.getHours() + 1).toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0")
    ) {
      return { label: "Starting Soon", variant: "destructive" as const }
    } else {
      return { label: "Available", variant: "default" as const }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Shows
          </CardTitle>
          <CardDescription>Movies playing today</CardDescription>
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
              <Calendar className="mr-2 h-5 w-5" />
              Today's Shows
            </CardTitle>
            <CardDescription>
              {todaySchedules.length > 0 ? `${todaySchedules.length} shows playing today` : "No movies playing today"}
            </CardDescription>
          </div>
          {todaySchedules.length > 3 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/films">View All</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {todaySchedules.length === 0 ? (
          <div className="text-center py-8">
            <FilmIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Shows Today</h3>
            <p className="text-muted-foreground mb-4">
              There are no movies scheduled for today. Check back tomorrow or browse upcoming shows.
            </p>
            <Button asChild>
              <Link href="/films">Browse All Movies</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {todaySchedules.map((schedule) => {
              const timeStatus = getTimeStatus(schedule.waktu)
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
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {schedule.film?.title || schedule.film_title || "Unknown Movie"}
                        </h4>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
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
                          <Badge variant={timeStatus.variant} className="text-xs">
                            {timeStatus.label}
                          </Badge>
                          <span className="text-sm font-medium text-primary">{formatPrice(schedule.harga)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {timeStatus.label === "Available" ? (
                      <Button size="sm" asChild>
                        <Link href={`/booking/${schedule._id}`}>Book Now</Link>
                      </Button>
                    ) : timeStatus.label === "Starting Soon" ? (
                      <Button size="sm" variant="outline" disabled>
                        Starting Soon
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Finished
                      </Button>
                    )}
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
