import React from "react";

const FilmInfo = ({ film }) => (
  <div className="bg-blue-50 p-6 rounded-lg shadow mb-6">
    <h2 className="text-3xl font-bold text-blue-800 mb-2">{film.title}</h2>
    <p className="text-gray-700 mb-1"><strong>Genre:</strong> {film.genre}</p>
    <p className="text-gray-700"><strong>Durasi:</strong> {film.duration} menit</p>
  </div>
);

export default FilmInfo;
