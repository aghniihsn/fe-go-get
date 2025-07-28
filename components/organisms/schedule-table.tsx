import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScheduleTableRow } from "@/components/molecules/schedule-table-row"

interface ScheduleTableProps {
  schedules: any[]
  onEdit: (schedule: any) => void
  onDelete: (schedule: any) => void
  formatDateTime: (tanggal: string, waktu: string) => string
  formatPrice: (price: number) => string
  getScheduleStatus: (tanggal: string, waktu: string) => { label: string; variant: string }
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  onEdit,
  onDelete,
  formatDateTime,
  formatPrice,
  getScheduleStatus,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Movie</TableHead>
        <TableHead>Studio</TableHead>
        <TableHead>Date & Time</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {schedules.map((schedule) => (
        <ScheduleTableRow
          key={schedule._id}
          schedule={schedule}
          onEdit={onEdit}
          onDelete={onDelete}
          formatDateTime={formatDateTime}
          formatPrice={formatPrice}
          getScheduleStatus={getScheduleStatus}
        />
      ))}
    </TableBody>
  </Table>
)
