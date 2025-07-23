"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"
import AdminSidebar from "../components/organisms/AdminSidebar"
import { createFilm } from "../services/api"

export default function AdminCreateFilmPage() {
  const [form, setForm] = useState({
    title: "",
    genre: "", // string
    duration: "",
    description: "",
    poster_url: "",
    rating: "Semua Umur", // default value
  })
  // const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"]
  const ratings = ["Semua Umur", "Anak-anak", "Remaja", "Dewasa"]


  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }



  async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)
  // Validasi durasi
  const durationNum = Number(form.duration)
  if (!durationNum || durationNum < 1) {
    alert("Durasi harus berupa angka dan lebih dari 0.")
    setLoading(false)
    return;
  }
  try {
    const payload = {
      title: form.title,
      genre: form.genre ? [form.genre] : [],
      duration: durationNum,
      description: form.description,
      poster_url: form.poster_url,
      rating: form.rating,
    }
    await createFilm(payload)
    setLoading(false)
    navigate("/admin/film")
  } catch {
    setLoading(false)
    alert("Gagal membuat film. Pastikan data valid.")
  }
}

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16 flex items-center justify-center">
        <div className="p-6 w-full max-w-2xl">
          {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">Add New Movie</h1>
              <p className="text-gray-600">Create a new movie listing</p>
            </div>
          </div>

          <div className="max-w-2xl">
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
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <select
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      {ratings.map((rating) => (
                        <option key={rating} value={rating}>{rating}</option>
                      ))}
                    </select>
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
                  {loading ? "Creating..." : "Create Movie"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
