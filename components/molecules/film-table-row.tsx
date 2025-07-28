import React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface FilmTableRowProps {
  film: any
  index: number
  onEdit: (film: any) => void
  onDelete: (film: any) => void
  truncateText: (text: string, maxLength?: number) => string
}

export const FilmTableRow: React.FC<FilmTableRowProps> = ({ film, index, onEdit, onDelete, truncateText }) => (
  <TableRow key={film._id}>
    <TableCell className="font-medium">{index + 1}</TableCell>
    <TableCell className="font-medium">{film.title || "N/A"}</TableCell>
    <TableCell>{Array.isArray(film.genre) ? film.genre.join(", ") : film.genre || "N/A"}</TableCell>
    <TableCell>{film.duration ? `${film.duration} min` : "N/A"}</TableCell>
    <TableCell>{film.rating || "N/A"}</TableCell>
    <TableCell className="max-w-xs">
      <div className="truncate" title={film.description}>
        {truncateText(film.description)}
      </div>
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(film)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(film)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
)
