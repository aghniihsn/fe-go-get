"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Film } from "@/lib/types"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { FilmDialog } from "@/components/organisms/film-dialog"
import { FilmTable } from "@/components/organisms/film-table"
import { FilmDeleteDialog } from "@/components/molecules/film-delete-dialog"

const RATING_OPTIONS = [
  { value: "Semua Umur", label: "Semua Umur" },
  { value: "Anak-anak", label: "Anak-anak" },
  { value: "Remaja", label: "Remaja" },
  { value: "Dewasa", label: "Dewasa" },
]

export default function AdminFilmsPage() {
  const [films, setFilms] = useState<Film[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFilm, setEditingFilm] = useState<Film | null>(null)
  const [deletingFilm, setDeletingFilm] = useState<Film | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    rating: "",
  })

  useEffect(() => {
    fetchFilms()
  }, [])

  const fetchFilms = async () => {
    try {
      const response = await api.get("/films")
      console.log("Fetched films:", response.data)
      setFilms(response.data || [])
    } catch (error) {
      console.error("Error fetching films:", error)
      toast({
        title: "Error",
        description: "Failed to fetch films",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type - hanya allow JPEG, PNG, WebP
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please select a valid image file (JPEG, PNG, or WebP)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 2MB untuk Supabase)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      // Validate file name (no special characters)
      const fileName = file.name
      const validNameRegex = /^[a-zA-Z0-9._-]+$/
      if (!validNameRegex.test(fileName)) {
        toast({
          title: "Error",
          description:
            "File name contains invalid characters. Use only letters, numbers, dots, hyphens, and underscores.",
          variant: "destructive",
        })
        return
      }

      console.log("File validation passed:", {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / 1024 / 1024).toFixed(2),
      })

      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    // Reset file input
    const fileInput = document.getElementById("poster") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.genre.trim()) {
        throw new Error("Genre is required")
      }
      if (!formData.duration.trim()) {
        throw new Error("Duration is required")
      }
      if (!formData.rating.trim()) {
        throw new Error("Rating is required")
      }

      // For new films, poster is required
      if (!editingFilm && !selectedFile) {
        throw new Error("Poster image is required for new films")
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData()

      // Add form fields as strings (as per your keypoint)
      submitData.append("title", formData.title.trim())
      submitData.append("description", formData.description.trim())
      submitData.append("genre", formData.genre.trim()) // comma-separated string
      submitData.append("duration", formData.duration.trim()) // as string
      submitData.append("rating", formData.rating.trim())

      // Add file if selected
      if (selectedFile) {
        submitData.append("poster", selectedFile)
      }

      // Debug: Log FormData contents
      console.log("FormData contents:")
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value)
      }

      let response
      if (editingFilm) {
        console.log("Making PUT request to:", `/films/${editingFilm._id}`)
        console.log("Editing film ID:", editingFilm._id)

        // Create axios config with explicit multipart/form-data
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }

        response = await api.put(`/films/${editingFilm._id}`, submitData, config)
        toast({
          title: "Success",
          description: "Film updated successfully",
        })
      } else {
        console.log("Making POST request to:", "/films")

        // Create axios config with explicit multipart/form-data
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }

        response = await api.post("/films", submitData, config)
        toast({
          title: "Success",
          description: "Film created successfully",
        })
      }

      console.log("Response:", response.data)
      setIsDialogOpen(false)
      resetForm()
      fetchFilms()
    } catch (error: any) {
      console.error("Submit error:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      console.error("Request URL:", error.config?.url)

      let errorMessage = "Failed to save film"

      // Handle Supabase storage errors specifically
      if (error.response?.data?.error?.includes("Supabase upload failed")) {
        if (error.response.data.error.includes("400 Bad Request")) {
          errorMessage = "Image upload failed. Please try with a different image file (JPEG/PNG, max 2MB)"
        } else {
          errorMessage = "Image upload failed. Please check your image file and try again."
        }
      } else if (error.message && error.message.includes("required")) {
        errorMessage = error.message
      } else if (error.response?.data?.error === "Invalid ObjectID format") {
        errorMessage = "Invalid film ID format. Please try refreshing the page."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.status === 400) {
        errorMessage = "Bad Request - Please check your input data"
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (film: Film) => {
    console.log("Editing film:", film)
    console.log("Film ID:", film._id)

    setEditingFilm(film)
    setFormData({
      title: film.title || "",
      description: film.description || "",
      genre: Array.isArray(film.genre) ? film.genre.join(",") : film.genre || "", // Convert to comma-separated
      duration: film.duration?.toString() || "",
      rating: film.rating || "",
    })

    // Set preview URL to existing poster if available
    if (film.poster_url) {
      setPreviewUrl(film.poster_url)
    }

    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingFilm) return

    try {
      await api.delete(`/films/${deletingFilm._id}`)
      toast({
        title: "Success",
        description: "Film deleted successfully",
      })
      fetchFilms()
      setDeletingFilm(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete film",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      genre: "",
      duration: "",
      rating: "",
    })
    setEditingFilm(null)
    setSelectedFile(null)
    setPreviewUrl("")

    // Reset file input
    const fileInput = document.getElementById("poster") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleAddFilmClick = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const truncateText = (text: string, maxLength = 100) => {
    if (!text) return "N/A"
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <AdminLayout title="Film Management">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Films</CardTitle>
              <CardDescription>Manage your movie database</CardDescription>
            </div>
            <Button onClick={handleAddFilmClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Film
            </Button>
            <FilmDialog
              isDialogOpen={isDialogOpen}
              handleDialogOpenChange={handleDialogOpenChange}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              editingFilm={editingFilm}
              formData={formData}
              setFormData={setFormData}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              handleFileChange={handleFileChange}
              removeSelectedFile={removeSelectedFile}
              RATING_OPTIONS={RATING_OPTIONS}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <FilmTable
                films={films}
                onEdit={handleEdit}
                onDelete={setDeletingFilm}
                truncateText={truncateText}
              />
            </div>
          )}
          {!isLoading && films.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No films found. Add your first film to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <FilmDeleteDialog
        open={!!deletingFilm}
        film={deletingFilm}
        onCancel={() => setDeletingFilm(null)}
        onConfirm={handleDeleteConfirm}
      />
    </AdminLayout>
  )
}
