"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/atoms/Input"
import Button from "../components/atoms/Button"
import axios from "../services/api"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState({ email: "", password: "", general: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Reset error untuk field yang diubah
    setError({ ...error, [e.target.name]: "", general: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError({ email: "", password: "", general: "" })
    setLoading(true)

    let hasError = false;
    const newError = { email: "", password: "", general: "" };

    // Validasi email
    if (!form.email) {
      newError.email = "Email is required";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newError.email = "Invalid email format";
        hasError = true;
      }
    }

    // Validasi password
    if (!form.password) {
      newError.password = "Password is required";
      hasError = true;
    } else if (form.password.length < 6) {
      newError.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/auth/login", form)
      const { id, role, nama, token } = res.data
      localStorage.setItem("user_id", id)
      localStorage.setItem("user_role", role)
      localStorage.setItem("user_nama", nama)
      localStorage.setItem("jwt_token", token)

      if (role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch {
      setError({ ...newError, general: "Invalid email or password" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
            />

            {error.email && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm">{error.email}</div>
            )}
            {error.password && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm">{error.password}</div>
            )}
            {error.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm">{error.general}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")} className="text-gray-900 font-medium hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
