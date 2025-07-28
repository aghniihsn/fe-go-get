import React from "react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Search } from "lucide-react"

interface MovieFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedGenre: string
  setSelectedGenre: (genre: string) => void
  genres: string[]
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({ searchTerm, setSearchTerm, selectedGenre, setSelectedGenre, genres }) => (
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
)
