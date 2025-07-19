"use client"

import { useState } from "react"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"
import { useNavigate } from "react-router-dom"

export default function AdminCreateJadwalPage() {
  const [form, setForm] = useState({
    film: "",
    tanggal: "",
    jam: "",
    studio: "",
    harga: "",
    kapasitas: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const filmOptions = [
    { value: "1", label: "The Silent Wave", duration: "120 min" },
    { value: "2", label: "Galactic Quest", duration: "135 min" },
    { value: "3", label: "Haunted Hollow", duration: "98 min" },
    { value: "4", label: "Laugh Factory", duration: "105 min" },
  ]

  const studioOptions = [
    { value: "1", label: "Studio 1", capacity: 150, type: "Regular" },
    { value: "2", label: "Studio 2", capacity: 200, type: "IMAX" },
    { value: "3", label: "Studio 3", capacity: 80, type: "VIP" },
    { value: "4", label: "Studio 4", capacity: 120, type: "4DX" },
    { value: "5", label: "Studio 5", capacity: 100, type: "Premium" },
  ]

  const timeSlots = ["10:00", "12:30", "15:00", "17:30", "20:00", "22:30"]

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    if (name === "studio") {
      const selectedStudio = studioOptions.find((studio) => studio.value === value)
      if (selectedStudio) {
        setForm((prev) => ({ ...prev, kapasitas: selectedStudio.capacity.toString() }))
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate("/admin/jadwal")
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

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <select
                        name="jam"
                        value={form.jam}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Studio</label>
                    <select
                      name="studio"
                      value={form.studio}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">Choose studio</option>
                      {studioOptions.map((studio) => (
                        <option key={studio.value} value={studio.value}>
                          {studio.label} - {studio.type} (Capacity: {studio.capacity})
                        </option>
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

                    <Input
                      label="Capacity"
                      name="kapasitas"
                      value={form.kapasitas}
                      onChange={handleChange}
                      type="number"
                      placeholder="150"
                      required
                      disabled={!!form.studio}
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
