"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import API from "../services/api"
import { isLoggedIn } from "../utils/auth"
import JadwalTable from "../components/molecules/JadwalTable"
import BookForm from "../components/organisms/BookForm"

const FilmDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [film, setFilm] = useState(null)
  const [jadwals, setJadwals] = useState([])
  const [selectedJadwal, setSelectedJadwal] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    Promise.all([API.get(`/films/${id}`), API.get(`/jadwals/film/${id}`)])
      .then(([filmRes, jadwalRes]) => {
        setFilm(filmRes.data)
        setJadwals(jadwalRes.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    )
  }

  if (!film) return <div className="pt-20 text-center">Film not found</div>

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Film Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={film.poster_url || "/posters/default.jpg"}
                alt={film.title}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{film.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span>{Array.isArray(film.genre) ? film.genre.join(", ") : film.genre}</span>
                <span>•</span>
                <span>{film.duration} min</span>
                <span>•</span>
                <span className="font-semibold">{film.rating || "N/A"}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {film.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        {/* Showtimes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Showtimes</h2>
          <JadwalTable
            jadwals={jadwals}
            onBook={(jadwal) => {
              if (!isLoggedIn()) {
                navigate("/login")
                return
              }
              setSelectedJadwal(jadwal)
            }}
          />
        </div>

        {/* Booking Form */}
        {selectedJadwal && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Tickets</h3>
            <BookForm jadwal={selectedJadwal} film={film} />
          </div>
        )}
      </div>
    </div>
  )
}

export default FilmDetail
