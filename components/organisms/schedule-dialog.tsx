import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ScheduleForm } from "@/components/molecules/schedule-form"

interface ScheduleDialogProps {
  isDialogOpen: boolean
  handleDialogOpenChange: (open: boolean) => void
  handleSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  editingSchedule: any
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  films: any[]
  studioOptions: string[]
}

export const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  isDialogOpen,
  handleDialogOpenChange,
  handleSubmit,
  isSubmitting,
  editingSchedule,
  formData,
  setFormData,
  films,
  studioOptions,
}) => (
  <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
        <DialogDescription>
          {editingSchedule ? "Update schedule information" : "Add a new movie schedule"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <ScheduleForm
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          editingSchedule={editingSchedule}
          films={films}
          studioOptions={studioOptions}
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
            {editingSchedule ? "Update Schedule" : "Create Schedule"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)
