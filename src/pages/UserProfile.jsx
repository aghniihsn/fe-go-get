"use client"

import { useEffect, useState } from "react"
import axios from "../services/api"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"

const UserProfile = () => {
  const [form, setForm] = useState({ nama: "", email: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const userId = localStorage.getItem("user_id")

  useEffect(() => {
    axios
      .get(`/users/${userId}`)
      .then((res) => {
        setForm(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    axios
      .put(`/users/${userId}`, form)
      .then(() => {
        setShowSuccess(true)
        setSaving(false)
      })
      .catch(() => {
        alert("Failed to update profile")
        setSaving(false)
      })
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
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="nama" value={form.nama} onChange={handleChange} required />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Updated</h3>
              <p className="text-gray-600 mb-4">Your profile has been successfully updated.</p>
              <Button
                onClick={() => {
                  setShowSuccess(false)
                  window.location.href = "/"
                }}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
