import React, { useState } from "react";
import AdminSidebar from "../components/organisms/AdminSidebar";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import Select from "../components/atoms/Select";
import { useNavigate } from "react-router-dom";

export default function AdminCreateJadwalPage() {
  const [form, setForm] = useState({ film: "", tanggal: "", jam: "", studio: "" });
  // Dummy data, ganti dengan fetch dari backend jika sudah ada
  const filmOptions = [
    { value: "1", label: "Film 1" },
    { value: "2", label: "Film 2" },
  ];
  const studioOptions = [
    { value: "1", label: "Studio 1" },
    { value: "2", label: "Studio 2" },
    { value: "3", label: "Studio 3" },
    { value: "4", label: "Studio 4" },
    { value: "5", label: "Studio 5" },
  ];
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Simpan ke backend di sini
    // Setelah berhasil, kembali ke halaman list jadwal
    navigate("/admin/jadwal");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8 max-w-md mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-6">Create Jadwal</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
          <Select
            label="Film"
            name="film"
            value={form.film}
            onChange={handleChange}
            options={filmOptions}
            required
          />
          <Input
            label="Tanggal"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            type="date"
            required
          />
          <Input
            label="Jam"
            name="jam"
            value={form.jam}
            onChange={handleChange}
            type="time"
            required
          />
          <Select
            label="Studio"
            name="studio"
            value={form.studio}
            onChange={handleChange}
            options={studioOptions}
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
