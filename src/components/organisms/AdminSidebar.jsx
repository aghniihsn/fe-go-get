import React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", path: "/admin" },
  { label: "Film", path: "/admin/film" },
  { label: "Jadwal", path: "/admin/jadwal" },
  { label: "Tiket", path: "/admin/tiket" },
  { label: "Pesanan", path: "/admin/pesanan" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-200 p-2 rounded shadow"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle Sidebar"
      >
        <span className="font-bold">☰</span>
      </button>
      {/* Sidebar */}
      <aside
        className={`backdrop-blur-lg bg-white/70 border border-gray-200 h-[75vh] w-56 p-6 shadow-xl fixed left-8 z-40 rounded-2xl transition-transform duration-300 flex flex-col items-center mt-20
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", top: undefined }}
      >
        {/* <h2 className="font-bold text-xl mb-8">Admin Panel</h2> */}
        <nav className="flex flex-col gap-4 w-full">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-2 px-4 rounded-xl hover:bg-white/80 transition font-medium text-gray-700 w-full ${
                location.pathname === item.path ? "bg-blue-100 text-blue-700 shadow font-semibold" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
