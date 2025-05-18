import React from "react";
import Button from "../atoms/Button";

const JadwalTable = ({ jadwals, onBook }) => (
  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead className="bg-blue-100 text-blue-900">
      <tr>
        <th className="px-4 py-2 text-left">Tanggal</th>
        <th className="px-4 py-2 text-left">Waktu</th>
        <th className="px-4 py-2 text-left">Ruangan</th>
        <th className="px-4 py-2 text-left">Harga</th>
        <th className="px-4 py-2 text-left">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {jadwals.map((j) => (
        <tr key={j.id} className="hover:bg-blue-50">
          <td className="px-4 py-2 border-t">{j.tanggal}</td>
          <td className="px-4 py-2 border-t">{j.waktu}</td>
          <td className="px-4 py-2 border-t">{j.ruangan}</td>
          <td className="px-4 py-2 border-t">Rp{j.harga}</td>
          <td className="px-4 py-2 border-t">
            <Button onClick={() => onBook(j)}>Book Tiket</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

);

export default JadwalTable;
