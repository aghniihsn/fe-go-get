import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

const BookForm = ({ jadwal }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    jumlah: 1,
  });
  const [totalHarga, setTotalHarga] = useState(jadwal.harga);

  useEffect(() => {
    setTotalHarga(form.jumlah * jadwal.harga);
  }, [form.jumlah, jadwal.harga]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: new Date().getTime().toString(),
        jadwal_id: jadwal.id,
        nama: form.nama,
        email: form.email,
        jumlah: parseInt(form.jumlah),
      };

      const res = await axios.post("/tikets", payload);
      navigate("/pembayaran", {
        state: {
          nama: form.nama,
          jumlah: form.jumlah,
          totalHarga: res.data.total_harga,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Gagal memesan tiket.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 mt-4 rounded-xl shadow-sm bg-white space-y-4"
    >
      <h4 className="text-lg font-semibold">Form Pemesanan</h4>
      <Input
        label="Nama"
        name="nama"
        value={form.nama}
        onChange={handleChange}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Jumlah Tiket"
        name="jumlah"
        type="number"
        value={form.jumlah}
        onChange={handleChange}
        min={1}
        required
      />
      <div className="text-gray-700 font-medium">
        Total Harga: Rp {totalHarga.toLocaleString()}
      </div>
      <Button type="submit">Pesan Tiket</Button>
    </form>
  );
};

export default BookForm;
