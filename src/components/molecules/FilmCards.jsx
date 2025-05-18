import React from "react";
import ButtonDetail from "../atoms/ButtonDetail";

const FilmCard = ({ film }) => {
  return (
    <tr className="hover:bg-blue-50 border-b border-blue-gray-100">
      {/* <td className="p-3 text-sm text-blue-gray-700">{film.id}</td> */}
      <td className="p-3 text-sm text-blue-gray-700 font-semibold">{film.title}</td>
      <td className="p-3 text-sm text-blue-gray-700">{film.genre}</td>
      <td className="p-3 text-sm text-blue-gray-700">{film.duration} menit</td>
      <td className="p-3">
        <ButtonDetail id={film.id} />
      </td>
    </tr>
  );
};

export default FilmCard;
