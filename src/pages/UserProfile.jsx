import React, { useEffect, useState } from "react";
import Input from "../components/atoms/Input";
import axios from "../services/api";
import Button from "../components/atoms/Button";

const UserProfile = () => {
  const [form, setForm] = useState({ nama: "", email: "" });
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    axios.get(`/users/${userId}`)
      .then(res => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  axios.put(`/users/${userId}`, form)
    .then(() => {
      alert("Profil berhasil diupdate");
      window.location.href = "/"; // redirect ke dashboard
    })
    .catch(() => alert("Gagal update"));
};

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Profil Pengguna</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nama" name="nama" value={form.nama} onChange={handleChange} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />
        <Button type="submit" className="mt-2">Simpan</Button>
      </form>
    </div>
  );
};

export default UserProfile;
