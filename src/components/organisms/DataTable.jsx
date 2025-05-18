import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const DataTable = () => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios.get("/films")
      .then((res) => setFilms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">Kategori</th>
            <th className="px-4 py-2">Deskripsi</th>
            <th className="px-4 py-2">Tanggal Dibuat</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {films.map((film) => (
            <tr key={film.id} className="border-t">
              <td className="px-4 py-2">{film.id}</td>
              <td className="px-4 py-2">{film.nama}</td>
              <td className="px-4 py-2">{film.kategori}</td>
              <td className="px-4 py-2">{film.deskripsi}</td>
              <td className="px-4 py-2">{film.tanggal_dibuat}</td>
              <td className="px-4 py-2">{film.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
