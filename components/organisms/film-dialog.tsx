import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { FilmForm } from "@/components/molecules/film-form"

interface FilmDialogProps {
  isDialogOpen: boolean
  handleDialogOpenChange: (open: boolean) => void
  handleSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  editingFilm: any
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  selectedFile: File | null
  previewUrl: string
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeSelectedFile: () => void
  RATING_OPTIONS: { value: string; label: string }[]
}

export const FilmDialog: React.FC<FilmDialogProps> = ({
  isDialogOpen,
  handleDialogOpenChange,
  handleSubmit,
  isSubmitting,
  editingFilm,
  formData,
  setFormData,
  selectedFile,
  previewUrl,
  handleFileChange,
  removeSelectedFile,
  RATING_OPTIONS,
}) => (
  <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editingFilm ? "Edit Film" : "Add New Film"}</DialogTitle>
        <DialogDescription>
          {editingFilm ? "Update film information" : "Add a new film to the database"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <FilmForm
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          editingFilm={editingFilm}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          handleFileChange={handleFileChange}
          removeSelectedFile={removeSelectedFile}
          RATING_OPTIONS={RATING_OPTIONS}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDialogOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingFilm ? "Update Film" : "Create Film"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)
