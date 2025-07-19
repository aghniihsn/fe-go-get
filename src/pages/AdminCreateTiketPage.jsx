"use client"

import { useState } from "react"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"
import { useNavigate } from "react-router-dom"

export default function AdminCreateTiketPage() {
  const [form, setForm] = useState({
    film: "",
    jadwal: "",
    kursi: "",
    harga: "",
    tipe: "",
    status: "available",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const filmOptions = [
    { value: "1", label: "The Silent Wave", genre: "Drama" },
    { value: "2", label: "Galactic Quest", genre: "Sci-Fi" },
    { value: "3", label: "Haunted Hollow", genre: "Horror" },
    { value: "4", label: "Laugh Factory", genre: "Comedy" },
  ]

  const jadwalOptions = [
    { value: "1", label: "2025-07-20 19:00 - Studio 1", film: "The Silent Wave", studio: "Studio 1" },
    { value: "2", label: "2025-07-21 20:00 - Studio 2", film: "Galactic Quest", studio: "Studio 2" },
    { value: "3", label: "2025-07-22 15:00 - Studio 3", film: "Haunted Hollow", studio: "Studio 3" },
    { value: "4", label: "2025-07-23 17:30 - Studio 1", film: "Laugh Factory", studio: "Studio 1" },
  ]

  const seatTypes = [
    { value: "regular", label: "Regular Seat", price: 50000 },
    { value: "premium", label: "Premium Seat", price: 75000 },
    { value: "vip", label: "VIP Seat", price: 100000 },
    { value: "couple", label: "Couple Seat", price: 120000 },
  ]

  const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const seatNumbers = Array.from({ length: 20 }, (_, i) => i + 1)

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    if (name === "tipe") {
      const selectedType = seatTypes.find((type) => type.value === value)
      if (selectedType) {
        setForm((prev) => ({ ...prev, harga: selectedType.price.toString() }))
      }
    }

    if (name === "jadwal") {
      const selectedJadwal = jadwalOptions.find((jadwal) => jadwal.value === value)
      if (selectedJadwal) {
        const relatedFilm = filmOptions.find((film) => film.label === selectedJadwal.film)
        if (relatedFilm) {
          setForm((prev) => ({ ...prev, film: relatedFilm.value }))
        }
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate("/admin/tiket")
    }, 2000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate("/admin/tiket")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Ticket</h1>
              <p className="text-gray-600">Add a new ticket configuration</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Configuration</h2>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Schedule</label>
                    <select
                      name="jadwal"
                      value={form.jadwal}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Choose a schedule</option>
                      {jadwalOptions.map((jadwal) => (
                        <option key={jadwal.value} value={jadwal.value}>
                          {jadwal.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Movie (Auto-filled)</label>
                    <select
                      name="film"
                      value={form.film}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    >
                      <option value="">Select schedule first</option>
                      {filmOptions.map((film) => (
                        <option key={film.value} value={film.value}>
                          {film.label} ({film.genre})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Seat Row</label>
                      <select
                        name="seatRow"
                        value={form.kursi.charAt(0)}
                        onChange={(e) => setForm({ ...form, kursi: e.target.value + (form.kursi.slice(1) || "1") })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="">Row</option>
                        {seatRows.map((row) => (
                          <option key={row} value={row}>
                            {row}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Seat Number</label>
                      <select
                        name="seatNumber"
                        value={form.kursi.slice(1)}
                        onChange={(e) => setForm({ ...form, kursi: (form.kursi.charAt(0) || "A") + e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="">Number</option>
                        {seatNumbers.map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Seat Type</label>
                    <select
                      name="tipe"
                      value={form.tipe}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Select seat type</option>
                      {seatTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label} - Rp {type.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Price (Rp)"
                    name="harga"
                    value={form.harga}
                    onChange={handleChange}
                    type="number"
                    placeholder="50000"
                    required
                  />

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => navigate("/admin/tiket")} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
