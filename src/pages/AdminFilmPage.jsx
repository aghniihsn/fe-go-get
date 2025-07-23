"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/organisms/AdminSidebar"
import Button from "../components/atoms/Button"

import API from "../services/api"

function AdminFilmPage() {
  const [films, setFilms] = useState([])
  useEffect(() => {
    async function fetchFilms() {
      try {
        const token = localStorage.getItem('jwt_token')
        const res = await API.get("/films", {
          headers: { Authorization: `Bearer ${token}` },
        })
        // Data dari backend biasanya array of film
        setFilms(res.data)
      } catch {
        setFilms([])
      }
    }
    fetchFilms()
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedFilmId, setSelectedFilmId] = useState(null)
  const navigate = useNavigate()

  const filteredFilms = films.filter((film) => (film.title || "").toLowerCase().includes(searchTerm.toLowerCase()))

  // Helper to validate MongoDB ObjectID
  function isValidObjectId(id) {
    return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
  }

  const handleEditClick = (id, fallbackId) => {
    // Use _id if available, else fallback to id
    const filmId = id || fallbackId;
    if (!filmId) {
      alert("Film ID is undefined.");
      return;
    }
    if (!isValidObjectId(filmId)) {
      alert(`Invalid film ID: ${filmId}`);
      return;
    }
    navigate(`/admin/edit/${filmId}`);
  };

  const handleDeleteClick = (id, fallbackId) => {
    const filmId = id || fallbackId;
    if (!filmId) {
      alert("Film ID is undefined.");
      return;
    }
    setSelectedFilmId(filmId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('jwt_token')
      await API.delete(`/films/${selectedFilmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFilms(films.filter((film) => film._id !== selectedFilmId))
      setShowDeleteModal(false)
      setSelectedFilmId(null)
    } catch {
      alert("Gagal menghapus film.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Movies</h1>
              <p className="text-gray-600">Manage your movie collection</p>
            </div>
            <Button onClick={() => navigate("/admin/create")}>Add Movie</Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilms.map((film) => {
              return (
                <div key={film._id || film.id || Math.random()} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <img src={film.poster_url || "/placeholder.svg"} alt={film.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{film.title}</h3>
                      {/* Status bisa diambil dari field status jika ada, atau rating */}
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {film.status || film.rating || "-"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {(Array.isArray(film.genre) ? film.genre.join(", ") : film.genre)} | {film.duration}min
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1 text-sm" onClick={() => handleEditClick(film._id, film.id)}>
                        Edit
                      </Button>
                      <Button variant="danger" className="text-sm" onClick={() => handleDeleteClick(film._id, film.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFilms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No movies found</p>
              <Button onClick={() => navigate("/admin/create")}>Add Your First Movie</Button>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Movie?</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this movie? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="danger" onClick={confirmDelete} className="flex-1">
                    Yes, Delete
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

export default AdminFilmPage
