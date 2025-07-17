import React, { useState } from "react";
import AdminSidebar from "../components/organisms/AdminSidebar";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import Select from "../components/atoms/Select";
import { useNavigate } from "react-router-dom";

export default function AdminCreateTiketPage() {
  const [form, setForm] = useState({ film: "", jadwal: "", kursi: "", harga: "" });
  // Dummy data, ganti dengan fetch dari backend jika sudah ada
  const filmOptions = [
    { value: "1", label: "Film 1" },
    { value: "2", label: "Film 2" },
  ];
  const jadwalOptions = [
    { value: "1", label: "2025-07-20 19:00" },
    { value: "2", label: "2025-07-21 20:00" },
  ];
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Simpan ke backend di sini
    // Setelah berhasil, kembali ke halaman list tiket
    navigate("/admin/tiket");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8 max-w-md mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-6">Create Tiket</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
          <Select
            label="Film"
            name="film"
            value={form.film}
            onChange={handleChange}
            options={filmOptions}
            required
          />
          <Select
            label="Jadwal"
            name="jadwal"
            value={form.jadwal}
            onChange={handleChange}
            options={jadwalOptions}
            required
          />
          <Input
            label="Kursi"
            name="kursi"
            value={form.kursi}
            onChange={handleChange}
            required
          />
          <Input
            label="Harga"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            type="number"
            required
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}
