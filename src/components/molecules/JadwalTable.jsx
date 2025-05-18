import React from "react";
import Button from "../atoms/Button";

const JadwalTable = ({ jadwals, onBook }) => (
  <table className="table-auto w-full border border-gray-300">
    <thead className="bg-gray-100">
      <tr>
        <th className="border p-2">Tanggal</th>
        <th className="border p-2">Waktu</th>
        <th className="border p-2">Ruangan</th>
        <th className="border p-2">Harga</th>
        <th className="border p-2">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {jadwals.map((j) => (
        <tr key={j.id}>
          <td className="border p-2">{j.tanggal}</td>
          <td className="border p-2">{j.waktu}</td>
          <td className="border p-2">{j.ruangan}</td>
          <td className="border p-2">Rp{j.harga}</td>
          <td className="border p-2">
            <Button onClick={() => onBook(j)}>Book Tiket</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default JadwalTable;
