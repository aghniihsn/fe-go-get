import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FilmTableRow } from "@/components/molecules/film-table-row"

interface FilmTableProps {
  films: any[]
  onEdit: (film: any) => void
  onDelete: (film: any) => void
  truncateText: (text: string, maxLength?: number) => string
}

export const FilmTable: React.FC<FilmTableProps> = ({ films, onEdit, onDelete, truncateText }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">No</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Genre</TableHead>
        <TableHead>Duration</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead className="max-w-xs">Description</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {films.map((film, index) => (
        <FilmTableRow
          key={film._id}
          film={film}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          truncateText={truncateText}
        />
      ))}
    </TableBody>
  </Table>
)
