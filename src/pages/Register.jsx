"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"
import axios from "../services/api"

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validasi field kosong
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format")
      setLoading(false)
      return
    }

    // Validasi panjang password
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const res = await axios.post("/auth/register", form)
      console.log("Registration successful:", res.data)
      alert("Registration successful! Please login.")
      navigate("/login")
    } catch (err) {
      console.error("Registration error:", err)
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-gray-900 font-medium hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
