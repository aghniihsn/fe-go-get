"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isLoggedIn, getUserRole, logout } from "../../utils/auth"

const Navbar = () => {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const role = getUserRole()
  const nama = localStorage.getItem("user_nama") || ""
  const dropdownRef = React.useRef(null)

  const handleLogout = () => {
    logout()
    navigate("/login")
    setShowDropdown(false)
  }

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDropdown])

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900">
          MovieTix
        </Link>

        {/* Navigation: Hide all menu for admin */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn() && role !== "admin" && (
            <>
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Movies
              </Link>
              <Link to="/pesanan" className="text-gray-600 hover:text-gray-900 transition-colors">
                Orders
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center">
          {isLoggedIn() ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {nama.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block">{nama}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {/* Profile menu khusus user non-admin */}
                  {role !== "admin" && (
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
