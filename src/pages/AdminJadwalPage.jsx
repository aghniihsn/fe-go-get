"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Button from "../components/atoms/Button"
import { useNavigate } from "react-router-dom"

import { getJadwals, deleteJadwal } from "../services/api"

const AdminJadwalPage = () => {
  const navigate = useNavigate()
  const [jadwalList, setJadwalList] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedJadwalId, setSelectedJadwalId] = useState(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  useEffect(() => {
    getJadwals().then(res => {
      setJadwalList(res.data)
    })
  }, [])

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
            {jadwalList.map((jadwal) => {
              // Pastikan id yang dikirim ke backend adalah string ObjectID
              const jadwalId = typeof jadwal._id === "object" && jadwal._id.$oid ? jadwal._id.$oid : jadwal._id || jadwal.id;
              return (
              <div key={jadwalId} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{jadwal.film_title || jadwal.film || "-"}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Date: {jadwal.tanggal}</p>
                  <p>Studio: {jadwal.ruangan}</p>
                  <p className="font-medium text-gray-900">Price: Rp {Number(jadwal.harga).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 text-sm" onClick={() => navigate(`/admin/jadwal/edit/${jadwalId}`)}>
                    Edit
                  </Button>
                  <Button variant="danger" className="text-sm" onClick={() => {setSelectedJadwalId(jadwalId); setShowDeleteModal(true);}}>
                    Delete
                  </Button>
                </div>
              </div>
              )
            })}
          </div>

          {jadwalList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No schedules found</p>
              <Button onClick={() => navigate("/admin/jadwal/create")}>Create Your First Schedule</Button>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Schedule?</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this schedule? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="danger" onClick={async () => {
                    setLoadingDelete(true);
                    try {
                      await deleteJadwal(selectedJadwalId);
                      setJadwalList(jadwalList.filter(j => {
                        const id = typeof j._id === "object" && j._id?.$oid ? j._id.$oid : j._id || j.id;
                        return id !== selectedJadwalId;
                      }));
                      setShowDeleteModal(false);
                      setSelectedJadwalId(null);
                    } catch {
                      alert("Gagal menghapus jadwal!");
                    } finally {
                      setLoadingDelete(false);
                    }
                  }} className="flex-1" disabled={loadingDelete}>
                    {loadingDelete ? "Deleting..." : "Yes, Delete"}
                  </Button>
                  <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminJadwalPage
