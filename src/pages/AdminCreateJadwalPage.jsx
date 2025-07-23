"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"

import { useNavigate } from "react-router-dom"
import { createJadwal, getFilms } from "../services/api"

export default function AdminCreateJadwalPage() {
  const [form, setForm] = useState({
    film: "",
    tanggal: "",
    ruangan: "",
    harga: "",
  })
  const [loading, setLoading] = useState(false)
  const [filmOptions, setFilmOptions] = useState([])
  const navigate = useNavigate()

  const studioOptions = [
    "Studio 1",
    "Studio 2",
    "Studio 3",
    "Studio 4",
    "Studio 5"
  ]

  // Ambil data film dan studio dari database saat komponen mount
  useEffect(() => {
    getFilms().then(res => {
      setFilmOptions(res.data.map(film => ({
        value: film.id?.toString() || film._id?.toString(),
        label: film.judul || film.title,
        duration: film.durasi || film.duration || "-"
      })))
    })
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }


  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      // Kirim data jadwal ke backend
      await createJadwal({
        film_id: form.film,
        tanggal: form.tanggal,
        ruangan: form.ruangan,
        harga: Number(form.harga),
      })
      navigate("/admin/jadwal")
    } catch {
      alert("Gagal membuat jadwal!")
    } finally {
      setLoading(false)
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
              onClick={() => navigate("/admin/jadwal")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Schedule</h1>
              <p className="text-gray-600">Add a new movie showtime</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h2>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Movie</label>
                    <select
                      name="film"
                      value={form.film}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Choose a movie</option>
                      {filmOptions.map((film) => (
                        <option key={film.value} value={film.value}>
                          {film.label} ({film.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Date"
                      name="tanggal"
                      value={form.tanggal}
                      onChange={handleChange}
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Studio</label>
                    <select
                      name="ruangan"
                      value={form.ruangan}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Pilih studio</option>
                      {studioOptions.map((studio) => (
                        <option key={studio} value={studio}>{studio}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Ticket Price (Rp)"
                      name="harga"
                      value={form.harga}
                      onChange={handleChange}
                      type="number"
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => navigate("/admin/jadwal")} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Schedule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
