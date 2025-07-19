const FilmInfo = ({ film }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{film.title}</h2>
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <span>Genre: {film.genre}</span>
      <span>•</span>
      <span>Duration: {film.duration} minutes</span>
    </div>
  </div>
)

export default FilmInfo
