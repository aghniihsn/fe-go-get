"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"
import AdminSidebar from "../components/organisms/AdminSidebar"
import API from "../services/api"

export default function AdminEditFilmPage() {
  const { id } = useParams()
  const [form, setForm] = useState({
    title: "",
    genre: "",
    duration: "",
    description: "",
    poster_url: "",
    rating: "Semua Umur",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"]

  useEffect(() => {
    // Check for valid MongoDB ObjectID (24 hex chars)
    if (!id || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
      alert("Invalid film ID.");
      navigate("/admin/film");
      return;
    }
    async function fetchFilm() {
      try {
        const token = localStorage.getItem('jwt_token')
        const res = await API.get(`/films/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const film = res.data
        setForm({
          title: film.title || "",
          genre: Array.isArray(film.genre) ? film.genre[0] : film.genre || "",
          duration: film.duration || "",
          description: film.description || "",
          poster_url: film.poster_url || "",
          rating: film.rating || "Semua Umur",
        })
      } catch {
        alert("Gagal mengambil data film.")
      }
    }
    fetchFilm()
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('jwt_token')
      await API.put(`/films/${id}`, {
        ...form,
        genre: form.genre ? [form.genre] : [],
        duration: Number(form.duration),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLoading(false)
      navigate("/admin/film")
    } catch {
      setLoading(false)
      alert("Gagal update film.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16 flex items-center justify-center">
        <div className="p-6 w-full max-w-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate("/admin/film")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Movie</h1>
              <p className="text-gray-600">Update movie information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Movie Information</h2>
              <div className="space-y-4">
                <Input
                  label="Movie Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Genre</label>
                    <select
                      name="genre"
                      value={form.genre}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Select Genre</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Duration (minutes)"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    type="number"
                    placeholder="120"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Movie description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Movie Poster URL</label>
                  <Input
                    label="Poster URL"
                    name="poster_url"
                    value={form.poster_url}
                    onChange={handleChange}
                    placeholder="https://yourdomain.com/public/posters/12345.jpg"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={() => navigate("/admin/film")} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Movie"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
