"use client"

import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import axios from "../services/api"
import Button from "../components/atoms/Button"

const PesananPage = () => {
  const [pesanan, setPesanan] = useState([])
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchPesanan()
  }, [])

  const fetchPesanan = async () => {
    const userId = localStorage.getItem("user_id")
    try {
      const res = await axios.get(`/tikets/user/${userId}`)
      const tiketList = Array.isArray(res.data) ? res.data : []
      // Fetch jadwal detail untuk setiap tiket
      const tiketWithJadwal = await Promise.all(
        tiketList.map(async (tiket) => {
          if (tiket.jadwal_id) {
            try {
              const jadwalRes = await axios.get(`/jadwals/${tiket.jadwal_id}`)
              const jadwal = jadwalRes.data
              return {
                ...tiket,
                tittle: jadwal.film_title || '-',
                ruangan: jadwal.ruangan || jadwal.studio || '-',
              }
            } catch {
              return tiket
            }
          }
          return tiket
        })
      )
      setPesanan(tiketWithJadwal)
    } catch (err) {
      console.error(err)
      setPesanan([])
    }
  }

  const handleShowReceipt = (order) => {
    setSelectedOrder(order)
    setShowReceiptModal(true)
  }

  const handleDownloadReceipt = () => {
    if (!selectedOrder) return
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Movie Ticket Receipt", 20, 20)
    doc.setFontSize(12)
    doc.text(`Ticket ID: ${selectedOrder._id}`, 20, 35)
    doc.text(`Film: ${selectedOrder.tittle || selectedOrder.title || selectedOrder.film_tittle || selectedOrder.film_title || selectedOrder.film_judul || selectedOrder.judul || (selectedOrder.film && (selectedOrder.film.tittle || selectedOrder.film.title || selectedOrder.film.judul)) || '-'}`, 20, 45)
    doc.text(`Studio: ${selectedOrder.ruangan || selectedOrder.studio || selectedOrder.studio_name || (selectedOrder.film && (selectedOrder.film.ruangan || selectedOrder.film.studio || selectedOrder.film.studio_name)) || selectedOrder.film_studio || '-'}`, 20, 55)
    doc.text(`Kursi: ${selectedOrder.kursi}`, 20, 65)
    doc.text(`Tanggal: ${selectedOrder.tanggal_pembelian ? new Date(selectedOrder.tanggal_pembelian).toLocaleString() : '-'}`, 20, 75)
    doc.text(`Status: ${selectedOrder.status}`, 20, 85)
    doc.save(`receipt_${selectedOrder._id}.pdf`)
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
                    <Button variant="secondary" className="text-sm" onClick={() => handleShowReceipt(item)}>
                      Receipt
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

        {/* Receipt Modal */}
        {showReceiptModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Receipt</h3>
              <div className="mb-4">
                <div className="mb-2"><span className="font-semibold">Ticket ID:</span> {selectedOrder._id}</div>
                <div className="mb-2"><span className="font-semibold">Film:</span> {
                  selectedOrder.tittle || selectedOrder.title || selectedOrder.film_tittle || selectedOrder.film_title || selectedOrder.film_judul || selectedOrder.judul || (selectedOrder.film && (selectedOrder.film.tittle || selectedOrder.film.title || selectedOrder.film.judul)) || '-'
                }</div>
                <div className="mb-2"><span className="font-semibold">Studio:</span> {
                  selectedOrder.ruangan || selectedOrder.studio || selectedOrder.studio_name || (selectedOrder.film && (selectedOrder.film.ruangan || selectedOrder.film.studio || selectedOrder.film.studio_name)) || selectedOrder.film_studio || '-'
                }</div>
                <div className="mb-2"><span className="font-semibold">Kursi:</span> {selectedOrder.kursi}</div>
                <div className="mb-2"><span className="font-semibold">Tanggal:</span> {selectedOrder.tanggal_pembelian ? new Date(selectedOrder.tanggal_pembelian).toLocaleString() : '-'}</div>
                <div className="mb-2"><span className="font-semibold">Status:</span> {selectedOrder.status}</div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleDownloadReceipt} className="flex-1">Download</Button>
                <Button variant="secondary" onClick={() => setShowReceiptModal(false)} className="flex-1">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PesananPage
