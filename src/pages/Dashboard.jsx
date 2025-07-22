"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const posterMap = {
    "The Silent Wave": "/posters/1.jpg",
    "Galactic Quest": "/posters/2.jpeg",
    "Haunted Hollow": "/posters/3.jpeg",
    "Laugh Factory": "/posters/4.jpeg",
    "Speed Horizon": "/posters/5.jpg",
    "Love in Rain": "/posters/6.jpeg",
    "Mystery Code": "/posters/7.jpg",
    "Wings of Glory": "/posters/8.jpg",
    "Pixel Dreams": "/posters/9.png",
    Echoes: "/posters/10.jpg",
  }

  useEffect(() => {
    API.get("/films")
      .then((res) => {
        setFilms(res.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setFilms([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Now Playing</h1>
          <p className="text-gray-600">Discover the latest movies in theaters</p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {films && films.filter(film => 
            film?.title?.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((film) => (
            <div
              key={film.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={posterMap[film.title] || "/posters/default.jpg"}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{film.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {film.genre} • {film.duration}min
                </p>
                <button
                  onClick={() => navigate(`/film/${film.id}`)}
                  className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Films Message */}
        {films && films.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No movies available at the moment.</p>
          </div>
        )}

        {/* No Search Results Message */}
        {films && films.length > 0 && films.filter(film => 
          film?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No movies found matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
