import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import axios from "../services/api";

const Register = () => {
  const [form, setForm] = useState({ nama: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nama || !form.email || !form.password) {
      setError("Semua field wajib diisi.");
      return;
    }
    try {
      // Register ke backend
      await axios.post("/auth/register", form);
      navigate("/login");
    } catch {
      setError("Registrasi gagal. Email mungkin sudah digunakan.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/public/bg-login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/30 border border-white/40">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama" name="nama" value={form.nama} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <Button type="submit" className="w-full">Register</Button>
        </form>
        <div className="mt-4 text-center text-white">
          Sudah punya akun? <span className="text-blue-300 cursor-pointer underline" onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
