"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Button from "../components/atoms/Button"
import Input from "../components/atoms/Input"
import Select from "../components/atoms/Select"
import { getJadwals, getFilms, updateJadwal } from "../services/api"

const AdminEditJadwalPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jadwal, setJadwal] = useState(null)
  const [films, setFilms] = useState([])
  const [form, setForm] = useState({
    film_id: "",
    tanggal: "",
    waktu: "",
    ruangan: "",
    harga: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getJadwals().then(res => {
      const found = res.data.find(j => {
        const jadwalId = typeof j._id === "object" && j._id.$oid ? j._id.$oid : j._id || j.id
        return jadwalId === id
      })
      if (found) {
        setJadwal(found)
        setForm({
          film_id: found.FilmID?.$oid || found.FilmID || found.film_id || "",
          tanggal: found.tanggal || "",
          waktu: found.waktu || "",
          ruangan: found.ruangan || "",
          harga: found.harga ? String(found.harga) : ""
        })
      }
    })
    getFilms().then(res => setFilms(Array.isArray(res.data) ? res.data : []))
  }, [id])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await updateJadwal(id, form)
      navigate("/admin/jadwal")
    } catch {
      setError("Gagal update jadwal!")
    } finally {
      setLoading(false)
    }
  }

  if (!jadwal) return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16 flex items-center justify-center">
        <p className="text-gray-500">Loading schedule...</p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Schedule</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Film</label>
              <Select
                name="film"
                value={form.film}
                onChange={handleChange}
                required
                options={[
                  { value: "", label: "Select Film" },
                  ...((Array.isArray(films) ? films : []).map(f => ({
                    value: f?.title || f?.film_title || f?.film,
                    label: f?.title || f?.film_title || f?.film
                  })))
                ]}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <Input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Studio</label>
              <Input name="ruangan" value={form.ruangan} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Price</label>
              <Input type="number" name="harga" value={form.harga} onChange={handleChange} required min={0} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
              <Button variant="secondary" className="flex-1" onClick={() => navigate("/admin/jadwal")}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminEditJadwalPage
