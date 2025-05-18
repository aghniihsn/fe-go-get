import React from "react";
import ButtonDetail from "../atoms/ButtonDetail";

const FilmCard = ({ film }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 border">{film.id}</td>
      <td className="p-3 border">{film.title}</td>
      <td className="p-3 border">{film.genre}</td>
      <td className="p-3 border">{film.duration}</td>
      <td className="p-3 border">
        <ButtonDetail id={film.id} />
      </td>
    </tr>
  );
};

export default FilmCard;
