import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import AdminSidebar from "../components/organisms/AdminSidebar";

export default function AdminCreateFilmPage() {
  const [form, setForm] = useState({ title: "", genre: "", duration: "", category: "", poster: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Simpan ke backend di sini
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
          <Input
            label="URL Poster"
            name="poster"
            value={form.poster}
            onChange={handleChange}
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}
