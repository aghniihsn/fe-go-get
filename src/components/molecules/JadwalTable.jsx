"use client"

import Button from "../atoms/Button"

const JadwalTable = ({ jadwals, onBook }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">Studio</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
        </tr>
      </thead>
      <tbody>
        {jadwals.map((j) => (
          <tr key={j.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-3 px-4 text-gray-700">{j.tanggal}</td>
            <td className="py-3 px-4 text-gray-700">{j.ruangan}</td>
            <td className="py-3 px-4 text-gray-700">Rp{j.harga?.toLocaleString()}</td>
            <td className="py-3 px-4">
              <Button onClick={() => onBook(j)} className="text-sm">
                Book Now
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default JadwalTable
