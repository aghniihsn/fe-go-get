"use client"

import { useEffect, useState } from "react"
import { MovieCard } from "@/components/molecules/movie-card"
import { api } from "@/lib/api"
import type { Film } from "@/lib/types"
import { Loader2 } from "lucide-react"

export function MovieGrid() {
  const [films, setFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFilms()
  }, [])

  const fetchFilms = async () => {
    try {
      const response = await api.get("/films")
      setFilms(response.data)
    } catch (error) {
      console.error("Error fetching films:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {films.map((film) => (
        <MovieCard key={film.id} film={film} />
      ))}
    </div>
  )
}
