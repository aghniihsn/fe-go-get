const Input = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
        error ? "border-red-300 focus:ring-red-500" : ""
      } ${className}`}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
)

export default Input
