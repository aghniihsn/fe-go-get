"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/organisms/navbar"
import { ScheduleCard } from "@/components/molecules/schedule-card"
import { RatingBadge } from "@/components/atoms/rating-badge"
import { api } from "@/lib/api"
import type { Film, Schedule } from "@/lib/types"
import { Clock, Calendar, Loader2 } from "lucide-react"

export default function FilmDetailPage() {
  const params = useParams()
  const [film, setFilm] = useState<Film | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchFilmDetail()
      fetchSchedules()
    }
  }, [params.id])

  const fetchFilmDetail = async () => {
    try {
      const response = await api.get(`/films/${params.id}`)
      setFilm(response.data)
    } catch (error) {
      console.error("Error fetching film detail:", error)
    }
  }

  const fetchSchedules = async () => {
    try {
      // Gunakan endpoint yang sudah ada dengan filter film_id yang benar
      const response = await api.get(`/jadwals/detail?film_id=${params.id}`)
      console.log("Schedules response for film:", params.id, response.data)

      // Filter jadwal berdasarkan film_id untuk memastikan hanya jadwal film ini yang ditampilkan
      const filmSchedules = Array.isArray(response.data)
        ? response.data.filter((schedule) => schedule.film_id === params.id)
        : []

      console.log("Filtered schedules for this film:", filmSchedules)
      setSchedules(filmSchedules)
    } catch (error) {
      console.error("Error fetching schedules:", error)
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 md:px-6 py-8">
          <p className="text-center text-muted-foreground">Film not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={film.poster_url || "/placeholder.svg?height=600&width=400"}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">{film.title}</h1>
                <RatingBadge rating={film.rating} />
              </div>

              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {film.duration} min
                </div>
                {film.release_date && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(film.release_date).getFullYear()}
                  </div>
                )}
                <span className="px-2 py-1 bg-secondary rounded-md text-sm">{film.genre.join(", ")}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{film.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Showtimes</h2>
              {schedules && schedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schedules.map((schedule) => (
                    <ScheduleCard key={schedule._id} schedule={schedule} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No showtimes available for this movie.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
