import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FilmIcon } from "lucide-react"

interface ScheduleFormProps {
  formData: {
    film_id: string
    tanggal: string
    waktu: string
    ruangan: string
    harga: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  isSubmitting: boolean
  editingSchedule: any
  films: any[]
  studioOptions: string[]
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  formData,
  setFormData,
  isSubmitting,
  editingSchedule,
  films,
  studioOptions,
}) => (
  <div className="grid gap-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="film_id">Movie *</Label>
      <Select
        value={formData.film_id}
        onValueChange={(value) => setFormData((prev: any) => ({ ...prev, film_id: value }))}
        disabled={isSubmitting}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a movie" />
        </SelectTrigger>
        <SelectContent>
          {films.map((film) => (
            <SelectItem key={film._id} value={film._id}>
              <div className="flex items-center space-x-2">
                <FilmIcon className="h-4 w-4" />
                <span>{film.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="tanggal">Date *</Label>
        <Input
          id="tanggal"
          type="date"
          value={formData.tanggal}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, tanggal: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="waktu">Time *</Label>
        <Input
          id="waktu"
          type="time"
          value={formData.waktu}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, waktu: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ruangan">Studio *</Label>
        <Select
          value={formData.ruangan}
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, ruangan: value }))}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select studio" />
          </SelectTrigger>
          <SelectContent>
            {studioOptions.map((studio) => (
              <SelectItem key={studio} value={studio}>
                Studio {studio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="harga">Price (IDR) *</Label>
        <Input
          id="harga"
          type="number"
          min="0"
          step="1000"
          value={formData.harga}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, harga: e.target.value }))}
          placeholder="50000"
          required
          disabled={isSubmitting}
        />
      </div>
    </div>
    <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
      <p className="font-medium mb-1">Note:</p>
      <p>• Seats will be managed automatically by the system</p>
      <p>• Make sure the date and time don't conflict with existing schedules</p>
      <p>• Available studios: 1, 2, 3, 4, 5</p>
    </div>
  </div>
)
