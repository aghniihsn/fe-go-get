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

interface FilmDeleteDialogProps {
  open: boolean
  film: any
  onCancel: () => void
  onConfirm: () => void
}

export const FilmDeleteDialog: React.FC<FilmDeleteDialogProps> = ({ open, film, onCancel, onConfirm }) => (
  <AlertDialog open={open}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Delete Film
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this film? This action cannot be undone and will also remove all associated schedules and bookings.
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="font-medium">{film?.title}</p>
            <p className="text-sm text-muted-foreground">
              {Array.isArray(film?.genre) ? film.genre.join(", ") : film?.genre} • {film?.duration} min
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
          Delete Film
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
