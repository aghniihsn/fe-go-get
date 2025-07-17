import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/organisms/AdminSidebar";

// Dummy data, ganti dengan fetch dari backend
const initialFilms = [
  { id: 1, title: "Film A", genre: "Action", duration: 120, category: "Regular", poster: "", price: "Rp. 100000" },
  { id: 2, title: "Film B", genre: "Drama", duration: 90, category: "VIP", poster: "", price: "Rp. 100000" },
];

export default function AdminFilmPage() {
  const [films] = useState(initialFilms);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 pt-[5rem] md:pl-64 ml-8" >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">List Film</h2>
          <button
            className="bg-blue-200 text-black px-4 py-2 rounded-xl hover:bg-blue-400"
            onClick={() => navigate("/admin/create")}
          >
            Create Film
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {films.map((film) => (
            <div key={film.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center">
              <img
                src={film.poster || "/posters/default.jpg"}
                alt={film.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 w-full">
                <h3 className="text-lg font-bold mb-1">{film.title}</h3>
                <p className="text-gray-600">Genre: {film.genre}</p>
                <p className="text-gray-600">Durasi: {film.duration} menit</p>
                <p className="text-gray-600">Kategori: {film.category}</p>
                <p className="text-gray-600">Harga: {film.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
