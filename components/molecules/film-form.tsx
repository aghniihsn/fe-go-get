import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface FilmFormProps {
  formData: {
    title: string
    description: string
    genre: string
    duration: string
    rating: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  isSubmitting: boolean
  editingFilm: any
  selectedFile: File | null
  previewUrl: string
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeSelectedFile: () => void
  RATING_OPTIONS: { value: string; label: string }[]
}

export const FilmForm: React.FC<FilmFormProps> = ({
  formData,
  setFormData,
  isSubmitting,
  editingFilm,
  selectedFile,
  previewUrl,
  handleFileChange,
  removeSelectedFile,
  RATING_OPTIONS,
}) => (
  <>
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
          placeholder="Enter movie title"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter movie description"
          rows={4}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="genre">Genre *</Label>
          <Input
            id="genre"
            value={formData.genre}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, genre: e.target.value }))}
            placeholder="Drama,Family,Action"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">Separate multiple genres with commas</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, duration: e.target.value }))}
            placeholder="120"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating *</Label>
          <Select
            value={formData.rating}
            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, rating: value }))}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="poster">Poster Image {!editingFilm && "*"}</Label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              id="poster"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("poster")?.click()}
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Upload className="h-4 w-4" />
              {selectedFile ? "Change Image" : "Upload Image"}
            </Button>
            {selectedFile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeSelectedFile}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {previewUrl && (
            <div className="relative w-32 h-48 border rounded-lg overflow-hidden">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Poster preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          {selectedFile && (
            <div className="text-sm text-muted-foreground">
              <p>Selected: {selectedFile.name}</p>
              <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>Type: {selectedFile.type}</p>
            </div>
          )}
          {!editingFilm && (
            <p className="text-xs text-muted-foreground">* Poster image is required for new films</p>
          )}
        </div>
      </div>
    </div>
  </>
)
