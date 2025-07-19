"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Button from "../components/atoms/Button"

const initialFilms = [
  {
    id: 1,
    title: "The Silent Wave",
    genre: "Drama",
    duration: 120,
    category: "Regular",
    poster: "/posters/1.jpg",
    status: "Now Playing",
  },
  {
    id: 2,
    title: "Galactic Quest",
    genre: "Sci-Fi",
    duration: 135,
    category: "IMAX",
    poster: "/posters/2.jpeg",
    status: "Coming Soon",
  },
  {
    id: 3,
    title: "Haunted Hollow",
    genre: "Horror",
    duration: 98,
    category: "Regular",
    poster: "/posters/3.jpeg",
    status: "Now Playing",
  },
]

export default function AdminFilmPage() {
  const [films] = useState(initialFilms)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const filteredFilms = films.filter((film) => film.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Movies</h1>
              <p className="text-gray-600">Manage your movie collection</p>
            </div>
            <Button onClick={() => navigate("/admin/create")}>Add Movie</Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilms.map((film) => (
              <div key={film.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <img src={film.poster || "/placeholder.svg"} alt={film.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{film.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        film.status === "Now Playing" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {film.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {film.genre} • {film.duration}min • {film.category}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1 text-sm">
                      Edit
                    </Button>
                    <Button variant="danger" className="text-sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFilms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No movies found</p>
              <Button onClick={() => navigate("/admin/create")}>Add Your First Movie</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
