"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"

const menu = [
  { label: "Dashboard", path: "/admin" },
  { label: "Film", path: "/admin/film" },
  { label: "Jadwal", path: "/admin/jadwal" },
  { label: "Tiket", path: "/admin/tiket" },
  { label: "Pesanan", path: "/admin/pesanan" },
]

export default function AdminSidebar() {
  const location = useLocation()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-white p-2 rounded-lg shadow-sm border border-gray-200"
        onClick={() => setOpen(!open)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-16 z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6">
          <nav className="space-y-1">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}
