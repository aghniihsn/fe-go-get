import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import AdminSidebar from "../components/organisms/AdminSidebar";

export default function AdminCreateFilmPage() {
  const [form, setForm] = useState({ title: "", genre: "", duration: "", category: "", poster: "", posterFile: null });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setForm({ ...form, posterFile: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Simpan ke backend di sini (gunakan form.posterFile untuk file gambar)
    // Setelah berhasil, kembali ke halaman list film
    navigate("/admin/film");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Create Film</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
          <Input
            label="Judul Film"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Input
            label="Genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            required
          />
          <Input
            label="Durasi (menit)"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            type="number"
            required
          />
          <Input
            label="Kategori"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
          <div>
            <label className="block mb-1 font-medium">Poster Film</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded cursor-pointer"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview Poster"
                className="mt-2 rounded shadow w-full max-h-56 object-contain"
              />
            )}
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}
