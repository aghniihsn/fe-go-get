import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

interface ScheduleDeleteDialogProps {
  open: boolean
  schedule: any
  onCancel: () => void
  onConfirm: () => void
  formatDateTime: (tanggal: string, waktu: string) => string
}

export const ScheduleDeleteDialog: React.FC<ScheduleDeleteDialogProps> = ({ open, schedule, onCancel, onConfirm, formatDateTime }) => (
  <AlertDialog open={open}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Delete Schedule
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this schedule? This action cannot be undone.
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="font-medium">{schedule?.film_title || "Unknown Movie"}</p>
            <p className="text-sm text-muted-foreground">
              {schedule ? formatDateTime(schedule.tanggal, schedule.waktu) : ""} • {schedule?.ruangan}
            </p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Delete Schedule
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
