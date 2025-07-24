"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../services/api"
import Button from "../atoms/Button"
import Input from "../atoms/Input"

const BookForm = ({ jadwal }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    email: "",
    jumlah: 1,
    kursi: "",
  })
  // StudioSeats bisa di-hardcode atau fetch dari backend
  const studioSeats = [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10",
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10",
    "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10",
    "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10",
    "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10",
  ]
  const [totalHarga, setTotalHarga] = useState(jadwal.harga)
  const [loading, setLoading] = useState(false)

  const [userData, setUserData] = useState(null)
  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (userId) {
      axios.get(`/users/${userId}`).then((res) => {
        setForm((prev) => ({
          ...prev,
          username: res.data.username,
          email: res.data.email,
        }))
        setUserData(res.data)
      })
    }
  }, [])

  useEffect(() => {
    setTotalHarga(form.jumlah * jadwal.harga)
  }, [form.jumlah, jadwal.harga])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Cek biodata user
    if (userData) {
      const requiredFields = ["firstname", "lastname", "gender", "phone_number", "profile_picture_url", "address"]
      const incomplete = requiredFields.some((field) => !userData[field] || userData[field] === "")
      if (incomplete) {
        alert("Lengkapi biodata Anda terlebih dahulu.")
        navigate("/profile")
        return
      }
    }
    setLoading(true)
    try {
      const jadwal_id = jadwal?._id ? String(jadwal._id) : ""
      const user_id = localStorage.getItem("user_id") || ""
      const kursi = form.kursi || ""
      console.log("DEBUG booking:", { jadwal_id, user_id, kursi })
      if (!jadwal_id || !user_id || !kursi) {
        alert("JadwalID, UserID, dan Kursi harus terisi.")
        setLoading(false)
        return
      }
      const payload = {
        id: new Date().getTime().toString(),
        jadwal_id,
        username: form.username,
        email: form.email,
        jumlah: Number.parseInt(form.jumlah),
        user_id,
        kursi,
      }

      const res = await axios.post("/tikets", payload)
      navigate("/pembayaran", {
        state: {
          username: form.username,
          jumlah: form.jumlah,
          totalHarga: res.data.total_harga,
        },
      })
    } catch (err) {
      console.error(err)
      alert("Failed to book tickets.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" name="username" value={form.username} onChange={handleChange} disabled />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} disabled />
      <Input
        label="Number of Tickets"
        name="jumlah"
        type="number"
        value={form.jumlah}
        onChange={handleChange}
        min={1}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kursi</label>
        <select
          name="kursi"
          value={form.kursi}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="">Pilih Kursi</option>
          {studioSeats.map((seat) => (
            <option key={seat} value={seat}>{seat}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Price:</span>
          <span className="text-lg font-bold text-gray-900">Rp {totalHarga.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Booking..." : "Book Tickets"}
        </Button>
        <Button type="button" onClick={() => navigate(-1)} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default BookForm
