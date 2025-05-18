import React from "react";

const FilmInfo = ({ film }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">{film.title}</h2>
    <p className="mb-2">Genre: {film.genre}</p>
    <p className="mb-4">Durasi: {film.duration} menit</p>
  </div>
);

export default FilmInfo;
