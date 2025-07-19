"use client"

import { useState } from "react"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Button from "../components/atoms/Button"
import { useNavigate } from "react-router-dom"

const AdminTiketPage = () => {
  const navigate = useNavigate()
  const [tiketList] = useState([
    { id: 1, film: "The Silent Wave", jadwal: "2025-07-20 19:00", kursi: "A1", harga: 50000 },
    { id: 2, film: "Galactic Quest", jadwal: "2025-07-21 20:00", kursi: "B2", harga: 75000 },
    { id: 3, film: "Haunted Hollow", jadwal: "2025-07-22 15:00", kursi: "C3", harga: 45000},
    { id: 4, film: "Laugh Factory", jadwal: "2025-07-23 17:30", kursi: "D4", harga: 50000 },
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
              <p className="text-gray-600">Manage ticket configurations</p>
            </div>
            <Button onClick={() => navigate("/admin/tiket/create")}>Add Ticket</Button>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiketList.map((tiket) => (
              <div key={tiket.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{tiket.film}</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Schedule: {tiket.jadwal}</p>
                  <p>Seat: {tiket.kursi}</p>
                  <p className="font-medium text-gray-900">Price: Rp {tiket.harga.toLocaleString()}</p>
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

          {tiketList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tickets found</p>
              <Button onClick={() => navigate("/admin/tiket/create")}>Create Your First Ticket</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminTiketPage
