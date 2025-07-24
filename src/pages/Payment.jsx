"use client"


import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../components/atoms/Button"
import api from "../services/api"


const PaymentPage = () => {
  // State untuk detail user dan jadwal/film
  const [userDetail, setUserDetail] = useState(null);
  const [jadwalDetail, setJadwalDetail] = useState(null);
  const navigate = useNavigate()
  const location = useLocation()
  // Ambil order dari location.state jika ada
  // Pastikan data order diterima dari location.state
  let initialOrder = null;
  let tiketId = null;
  // Debug: tampilkan seluruh isi location.state
  console.log('[Payment] location.state:', location.state);
  if (location.state) {
    if (location.state.order) {
      initialOrder = location.state.order;
    }
    if (location.state.tiketId) {
      tiketId = location.state.tiketId;
    }
  }
  // Ambil jumlah tiket dari location.state jika ada
  const jumlahTiketFromState = location.state?.jumlah || null;
  // Ambil data tiket dari initialOrder.tiket jika ada
  const [order, setOrder] = useState(initialOrder?.tiket || null)
  const [loading, setLoading] = useState(initialOrder ? false : true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  // Ambil userId sesuai dengan BookForm (localStorage.getItem('user_id'))
  const userId = localStorage.getItem("user_id") || "";
  // Debug: cek data order yang diterima
  // Debug log
  console.log("[Payment] order from state:", initialOrder);
  console.log("[Payment] tiketId from state:", tiketId);
  console.log("[Payment] order state:", order);

  useEffect(() => {
    // Jika order sudah ada dari state, tidak perlu fetch
    if (initialOrder?.tiket) {
      setOrder(initialOrder.tiket);
      setLoading(false);
      return;
    }
    // Jika tidak ada, fetch dari backend pakai tiketId
    if (tiketId) {
      api.get(`/tikets/${tiketId}/summary`)
        .then(res => {
          setOrder(res.data)
        })
        .catch(() => {
          // handle error
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [initialOrder, tiketId]);

  // Ambil detail user dan jadwal/film jika order berubah
  useEffect(() => {
    if (order && order.user_id) {
      api.get(`/users/${order.user_id}`)
        .then(res => setUserDetail(res.data))
        .catch(() => setUserDetail(null));
    }
    if (order && order.jadwal_id) {
      api.get(`/jadwals/${order.jadwal_id}`)
        .then(res => setJadwalDetail(res.data))
        .catch(() => setJadwalDetail(null));
    }
  }, [order]);

  const handlePayment = async () => {
    if (!order || !paymentMethod || !userId) return;
    setProcessing(true);
    try {
      // Pastikan jumlah tiket valid
      // Prioritaskan jumlah tiket dari location.state jika ada
      let jumlah = parseInt(jumlahTiketFromState || order.jumlah_tiket || order.jumlah || jadwalDetail?.jumlah || 1);
      if (isNaN(jumlah) || jumlah <= 0) jumlah = 1;
      if (!order._id || !userId || !paymentMethod || !jumlah || jumlah <= 0) {
        alert("TiketID, UserID, MetodePembayaran, and Jumlah are required and Jumlah > 0");
        setProcessing(false);
        return;
      }
      const payload = {
        tiket_id: order._id ? String(order._id) : "",
        user_id: userId ? String(userId) : "",
        metode_pembayaran: paymentMethod ? String(paymentMethod) : "",
        jumlah: jumlah ? Number(jumlah) : 0,
        status: "paid", 
      };
      // Log tipe data setiap field dan payload
      console.log("[Payment] payload to /pembayarans:", payload);
      console.log("Tipe TiketID:", typeof payload.TiketID, "Tipe UserID:", typeof payload.UserID, "Tipe MetodePembayaran:", typeof payload.MetodePembayaran, "Tipe Jumlah:", typeof payload.Jumlah);
      // Pastikan request dikirim sebagai JSON
      try {
        await api.post("/pembayarans", payload, {
          headers: { "Content-Type": "application/json" }
        });
        // Direct ke halaman pesanan dengan status paid dan tiketId
        navigate("/pesanan", {
          state: {
            status: "paid",
            tiketId: order._id,
          },
        });
      } catch (err) {
        // Log error detail dari backend
        if (err.response) {
          console.error("[Payment] Error response:", err.response.data);
          alert("Error: " + (err.response.data?.error || "Terjadi kesalahan"));
        } else {
          console.error("[Payment] Error:", err);
          alert("Terjadi kesalahan saat request");
        }
      }
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-600 mt-1">Complete your ticket purchase</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
              {loading ? (
                <div className="text-gray-600">Loading...</div>
              ) : order ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer</span>
                    <span className="text-gray-900">{userDetail?.username || order.username || order.user_id || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{userDetail?.email || order.email || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tickets</span>
                    <span className="text-gray-900">{order.jumlah_tiket || order.jumlah || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kursi:</span>
                    <span className="text-gray-900">{order.kursi || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Film:</span>
                    <span className="text-gray-900">{
                      jadwalDetail?.tittle || jadwalDetail?.film_tittle || order.tittle || order.film_tittle || (order.film && (order.film.tittle || order.film.title)) || jadwalDetail?.film_judul || jadwalDetail?.film_title || order.film_judul || order.film_title || (order.film && order.film.judul) || '-'
                    }</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Studio:</span>
                    <span className="text-gray-900">{
                      jadwalDetail?.ruangan || order.ruangan || (jadwalDetail?.film && (jadwalDetail.film.ruangan || jadwalDetail.film.studio || jadwalDetail.film.studio_name)) || order.studio || order.studio_name || (order.film && (order.film.ruangan || order.film.studio || order.film.studio_name)) || order.film_studio || '-'
                    }</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jadwal:</span>
                    <span className="text-gray-900">{jadwalDetail?.tanggal ? new Date(jadwalDetail.tanggal).toLocaleString() : order.jadwal_id || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-gray-900">{order.status || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Pembelian:</span>
                    <span className="text-gray-900">{order.tanggal_pembelian ? new Date(order.tanggal_pembelian).toLocaleString() : '-'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-semibold text-gray-900">
                        Rp {
                          order.total_harga
                            ? order.total_harga.toLocaleString()
                            : jadwalDetail?.harga && (order.jumlah_tiket || order.jumlah || 1)
                              ? (jadwalDetail.harga * (order.jumlah_tiket || order.jumlah || 1)).toLocaleString()
                              : order.harga && (order.jumlah_tiket || order.jumlah || 1)
                                ? (order.harga * (order.jumlah_tiket || order.jumlah || 1)).toLocaleString()
                                : '-'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-500">Order tidak ditemukan. Silakan booking tiket terlebih dahulu.</div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Credit Card', 'Bank Transfer', 'E-Wallet'].map((method) => (
                  <div
                    key={method}
                    className={`border rounded-lg p-3 text-center cursor-pointer ${paymentMethod === method ? 'border-gray-900' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <div className="text-sm font-medium">{method}</div>
                  </div>
                ))}
              </div>
              {!paymentMethod && <div className="text-xs text-red-500 mt-2">Pilih metode pembayaran terlebih dahulu</div>}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handlePayment} className="flex-1" disabled={processing || loading || !order || !paymentMethod}>
                {processing ? "Processing..." : "Pay Now"}
              </Button>
              <Button onClick={() => navigate(-1)} variant="secondary">
                Back
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PaymentPage
