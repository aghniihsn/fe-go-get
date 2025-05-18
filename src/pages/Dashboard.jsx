import React, { useEffect, useState } from "react";
import API from "../services/api";
import FilmCard from "../components/molecules/filmCards";

const Dashboard = () => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    API.get("/films")
      .then((res) => setFilms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Daftar Film</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Judul</th>
              <th className="p-3 border">Genre</th>
              <th className="p-3 border">Durasi</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {films.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
