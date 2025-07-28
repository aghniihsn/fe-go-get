import React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ScheduleTableRowProps {
  schedule: any
  onEdit: (schedule: any) => void
  onDelete: (schedule: any) => void
  formatDateTime: (tanggal: string, waktu: string) => string
  formatPrice: (price: number) => string
  getScheduleStatus: (tanggal: string, waktu: string) => { label: string; variant: string }
}

export const ScheduleTableRow: React.FC<ScheduleTableRowProps> = ({
  schedule,
  onEdit,
  onDelete,
  formatDateTime,
  formatPrice,
  getScheduleStatus,
}) => {
  const status = getScheduleStatus(schedule.tanggal, schedule.waktu)
  return (
    <TableRow key={schedule._id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          {schedule.film?.poster_url && (
            <div className="w-10 h-14 relative rounded overflow-hidden">
              <Image
                src={schedule.film.poster_url || "/placeholder.svg"}
                alt={schedule.film_title || "Movie"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-medium">
              {schedule.film_title || schedule.film?.title || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              {schedule.film?.duration ? `${schedule.film.duration} min` : ""}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          {schedule.ruangan}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          {formatDateTime(schedule.tanggal, schedule.waktu)}
        </div>
      </TableCell>
      <TableCell className="font-medium">{formatPrice(schedule.harga)}</TableCell>
      <TableCell>
        <Badge variant={status.variant as any}>{status.label}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(schedule)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(schedule)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
