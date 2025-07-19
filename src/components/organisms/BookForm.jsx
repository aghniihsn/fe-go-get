"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../services/api"
import Button from "../atoms/Button"
import Input from "../atoms/Input"

const BookForm = ({ jadwal }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nama: "",
    email: "",
    jumlah: 1,
  })
  const [totalHarga, setTotalHarga] = useState(jadwal.harga)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (userId) {
      axios.get(`/users/${userId}`).then((res) => {
        setForm((prev) => ({
          ...prev,
          nama: res.data.nama,
          email: res.data.email,
        }))
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
    setLoading(true)
    try {
      const payload = {
        id: new Date().getTime().toString(),
        jadwal_id: jadwal.id,
        nama: form.nama,
        email: form.email,
        jumlah: Number.parseInt(form.jumlah),
        user_id: localStorage.getItem("user_id"),
      }

      const res = await axios.post("/tikets", payload)
      navigate("/pembayaran", {
        state: {
          nama: form.nama,
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
      <Input label="Name" name="nama" value={form.nama} onChange={handleChange} disabled />
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
