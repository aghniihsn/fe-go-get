"use client"

import { useEffect, useState } from "react"
import axios from "../services/api"
import Button from "../components/atoms/Button"

const PesananPage = () => {
  const [pesanan, setPesanan] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchPesanan()
  }, [])

  const fetchPesanan = () => {
    const userId = localStorage.getItem("user_id")
    axios
      .get(`/tikets/user/${userId}`)
      .then((res) => {
        setPesanan(Array.isArray(res.data) ? res.data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setPesanan([])
        setLoading(false)
      })
  }

  const handleDelete = (id) => {
    setSelectedId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    axios
      .delete(`/tikets/${selectedId}`)
      .then(() => {
        fetchPesanan()
        setShowDeleteModal(false)
        setSelectedId(null)
      })
      .catch(() => alert("Failed to delete ticket"))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Manage your movie ticket bookings</p>
        </div>

        {/* Orders */}
        {Array.isArray(pesanan) && pesanan.length > 0 ? (
          <div className="space-y-4">
            {pesanan.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="font-semibold text-gray-900 mb-1">Ticket ID: {item._id}</h3>
                    <p className="text-gray-600 text-sm mb-2">Kursi: {item.kursi}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Status: {item.status}</span>
                      <span>•</span>
                      <span>Tanggal: {item.tanggal_pembelian ? new Date(item.tanggal_pembelian).toLocaleString() : '-'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" className="text-sm">
                      View QR
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(item._id)} className="text-sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">You haven't booked any tickets yet.</p>
            <Button onClick={() => (window.location.href = "/")}>Browse Movies</Button>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Booking?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="danger" onClick={confirmDelete} className="flex-1">
                  Yes, Cancel
                </Button>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
                  Keep
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PesananPage
