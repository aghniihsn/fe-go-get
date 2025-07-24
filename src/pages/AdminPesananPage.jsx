"use client"

import { useEffect, useState } from "react"
import axios from "../services/api"
import AdminSidebar from "../components/organisms/AdminSidebar"

const AdminPesananPage = () => {
  const [pesananList, setPesananList] = useState([])

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const [tiketRes, pembayaranRes] = await Promise.all([
          axios.get("/tikets"),
          axios.get("/pembayarans")
        ])
        const tiketList = Array.isArray(tiketRes.data) ? tiketRes.data : []
        const pembayaranList = Array.isArray(pembayaranRes.data) ? pembayaranRes.data : []
        // Buat map pembayaran berdasarkan tiket_id
        const pembayaranMap = {}
        pembayaranList.forEach((pembayaran) => {
          if (pembayaran.tiket_id) {
            pembayaranMap[pembayaran.tiket_id] = pembayaran.status || "-"
          }
        })
        // Untuk setiap tiket, fetch detail user dan jadwal
        const pesananWithDetail = await Promise.all(
          tiketList.map(async (tiket) => {
            let user = "-", email = "-", film = "-", jadwal = "-", harga = 0
            // Fetch user
            try {
              const userRes = await axios.get(`/users/${tiket.user_id}`)
              user = userRes.data.username || userRes.data.firstname || "-"
              email = userRes.data.email || "-"
            } catch {
              // ignore user fetch error
            }
            // Fetch jadwal
            try {
              const jadwalRes = await axios.get(`/jadwals/${tiket.jadwal_id}`)
              const jadwalData = jadwalRes.data
              film = jadwalData.tittle || jadwalData.title || jadwalData.film_title || jadwalData.judul || (jadwalData.film && (jadwalData.film.tittle || jadwalData.film.title || jadwalData.film.judul)) || "-"
              jadwal = jadwalData.tanggal ? new Date(jadwalData.tanggal).toLocaleString() : "-"
              harga = jadwalData.harga || 0
            } catch {
              // ignore jadwal fetch error
            }
            // Ambil status pembayaran dari map
            const paymentStatus = pembayaranMap[tiket._id] || "-"
            return {
              id: tiket._id,
              user,
              email,
              film,
              jadwal,
              kursi: tiket.kursi,
              harga,
              status: paymentStatus,
            }
          })
        )
        setPesananList(pesananWithDetail)
      } catch {
        setPesananList([])
      }
    }
    fetchPesanan()
  }, [])

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
                        {pesanan.status && pesanan.status !== '-' ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pesanan.status)}`}
                          >
                            {pesanan.status}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>
                        )}
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
