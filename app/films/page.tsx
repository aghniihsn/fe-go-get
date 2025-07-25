"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/organisms/navbar"
import { MovieCard } from "@/components/molecules/movie-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import type { Film } from "@/lib/types"
import { Search, Loader2 } from "lucide-react"

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([])
  const [filteredFilms, setFilteredFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")

  useEffect(() => {
    fetchFilms()
  }, [])

  useEffect(() => {
    filterFilms()
  }, [films, searchTerm, selectedGenre])

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

  const filterFilms = () => {
    let filtered = films

    if (searchTerm) {
      filtered = filtered.filter(
        (film) =>
          (film.title && typeof film.title === "string" ? film.title.toLowerCase() : "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (film.description && typeof film.description === "string" ? film.description.toLowerCase() : "").includes(
            searchTerm.toLowerCase(),
          ),
      )
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((film) => {
        if (Array.isArray(film.genre)) {
          return film.genre.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()))
        }
        return film.genre && typeof film.genre === "string"
          ? film.genre.toLowerCase().includes(selectedGenre.toLowerCase())
          : false
      })
    }

    setFilteredFilms(filtered)
  }

  const genres = Array.from(
    new Set(
      films
        .flatMap((film) => (Array.isArray(film.genre) ? film.genre : [film.genre]))
        .filter((genre): genre is string => typeof genre === "string" && genre.trim() !== ""),
    ),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 md:px-6 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Browse Movies</h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Discover and book tickets for the latest movies
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre.toLowerCase()}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFilms.map((film) => (
                <MovieCard key={film._id} film={film} />
              ))}
            </div>
          )}

          {!loading && filteredFilms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No movies found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
