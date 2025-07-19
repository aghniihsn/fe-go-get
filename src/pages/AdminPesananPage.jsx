"use client"

import { useState } from "react"
import AdminSidebar from "../components/organisms/AdminSidebar"

const AdminPesananPage = () => {
  const [pesananList] = useState([
    {
      id: 1,
      user: "John Doe",
      film: "The Silent Wave",
      jadwal: "2025-07-20 19:00",
      kursi: "A1",
      harga: 50000,
      status: "paid",
      email: "john@example.com",
    },
    {
      id: 2,
      user: "Jane Smith",
      film: "Galactic Quest",
      jadwal: "2025-07-21 20:00",
      kursi: "B2",
      harga: 75000,
      status: "pending",
      email: "jane@example.com",
    },
    {
      id: 3,
      user: "Bob Johnson",
      film: "Haunted Hollow",
      jadwal: "2025-07-22 15:00",
      kursi: "C3",
      harga: 45000,
      status: "paid",
      email: "bob@example.com",
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">Manage customer bookings</p>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Movie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pesananList.map((pesanan) => (
                    <tr key={pesanan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pesanan.user}</div>
                          <div className="text-sm text-gray-500">{pesanan.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pesanan.film}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pesanan.jadwal}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pesanan.kursi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp {pesanan.harga.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pesanan.status)}`}
                        >
                          {pesanan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pesananList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPesananPage
