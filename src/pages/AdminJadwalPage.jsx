"use client"

import { useState } from "react"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Button from "../components/atoms/Button"
import { useNavigate } from "react-router-dom"

const AdminJadwalPage = () => {
  const navigate = useNavigate()
  const [jadwalList] = useState([
    { id: 1, film: "The Silent Wave", tanggal: "2025-07-20", jam: "19:00", harga: 50000 },
    { id: 2, film: "Galactic Quest", tanggal: "2025-07-21", jam: "20:00", harga: 75000 },
    { id: 3, film: "Haunted Hollow", tanggal: "2025-07-22", jam: "15:00", harga: 45000 },
    { id: 4, film: "Laugh Factory", tanggal: "2025-07-23", jam: "17:30", harga: 50000 },
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
              <p className="text-gray-600">Manage movie showtimes</p>
            </div>
            <Button onClick={() => navigate("/admin/jadwal/create")}>Add Schedule</Button>
          </div>

          {/* Schedules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jadwalList.map((jadwal) => (
              <div key={jadwal.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{jadwal.film}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Date: {jadwal.tanggal}</p>
                  <p>Time: {jadwal.jam}</p>
                  <p className="font-medium text-gray-900">Price: Rp {jadwal.harga.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 text-sm">
                    Edit
                  </Button>
                  <Button variant="danger" className="text-sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {jadwalList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No schedules found</p>
              <Button onClick={() => navigate("/admin/jadwal/create")}>Create Your First Schedule</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminJadwalPage
