"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScheduleDialog } from "@/components/organisms/schedule-dialog"
import { ScheduleTable } from "@/components/organisms/schedule-table"
import { ScheduleDeleteDialog } from "@/components/molecules/schedule-delete-dialog"
import { ScheduleStats } from "@/components/organisms/schedule-stats"
import { api } from "@/lib/api"
import type { Film } from "@/lib/types"
import { Plus, Loader2, Search, Calendar} from "lucide-react"
import { toast } from "@/hooks/use-toast"
interface Schedule {
  _id: string
  film_id: string
  film_title: string
  tanggal: string
  waktu: string
  ruangan: string
  harga: number
  created_at: string
  updated_at: string
  // Optional film details if populated
  film?: Film
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [films, setFilms] = useState<Film[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [studioFilter, setStudioFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [formData, setFormData] = useState({
    film_id: "",
    tanggal: "",
    waktu: "",
    ruangan: "",
    harga: "",
  })

  // Studio options 1-5
  const studioOptions = ["1", "2", "3", "4", "5"]

  useEffect(() => {
    fetchSchedules()
    fetchFilms()
  }, [])

  useEffect(() => {
    filterSchedules()
  }, [schedules, searchTerm, studioFilter, dateFilter])

  const fetchSchedules = async () => {
    try {
      const response = await api.get("/jadwals")
      console.log("Schedules response:", response.data)
      setSchedules(response.data || [])
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFilms = async () => {
    try {
      const response = await api.get("/films")
      setFilms(response.data || [])
    } catch (error) {
      console.error("Error fetching films:", error)
      toast({
        title: "Error",
        description: "Failed to fetch films",
        variant: "destructive",
      })
    }
  }

  const filterSchedules = () => {
    let filtered = schedules

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((schedule) => {
        const filmTitle = (schedule.film_title || schedule.film?.title || "").toLowerCase()
        const ruangan = schedule.ruangan?.toLowerCase() || ""
        return filmTitle.includes(searchTerm.toLowerCase()) || ruangan.includes(searchTerm.toLowerCase())
      })
    }

    // Studio filter
    if (studioFilter !== "all") {
      filtered = filtered.filter((schedule) => schedule.ruangan === `Studio ${studioFilter}`)
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      filtered = filtered.filter((schedule) => {
        const scheduleDate = new Date(schedule.tanggal)

        switch (dateFilter) {
          case "today":
            return scheduleDate.toDateString() === today.toDateString()
          case "tomorrow":
            return scheduleDate.toDateString() === tomorrow.toDateString()
          case "this_week":
            return scheduleDate >= today && scheduleDate <= nextWeek
          case "upcoming":
            return scheduleDate >= today
          case "past":
            return scheduleDate < today
          default:
            return true
        }
      })
    }

    setFilteredSchedules(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.film_id.trim()) {
        throw new Error("Please select a film")
      }
      if (!formData.tanggal.trim()) {
        throw new Error("Date is required")
      }
      if (!formData.waktu.trim()) {
        throw new Error("Time is required")
      }
      if (!formData.ruangan.trim()) {
        throw new Error("Studio is required")
      }
      // Validate studio number is 1-5
      if (!["1", "2", "3", "4", "5"].includes(formData.ruangan)) {
        throw new Error("Studio must be between 1-5")
      }
      if (!formData.harga.trim() || Number.parseFloat(formData.harga) <= 0) {
        throw new Error("Valid price is required")
      }

      const scheduleData = {
        film_id: formData.film_id,
        tanggal: formData.tanggal,
        waktu: formData.waktu,
        ruangan: `Studio ${formData.ruangan}`, // Pastikan format "Studio X"
        harga: Number.parseFloat(formData.harga),
      }

      console.log("Submitting schedule data:", scheduleData)

      if (editingSchedule) {
        const response = await api.put(`/jadwals/${editingSchedule._id}`, scheduleData)
        console.log("Update response:", response.data)
        toast({
          title: "Success",
          description: "Schedule updated successfully",
        })
      } else {
        const response = await api.post("/jadwals", scheduleData)
        console.log("Create response:", response.data)
        toast({
          title: "Success",
          description: "Schedule created successfully",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchSchedules()
    } catch (error: any) {
      console.error("Submit error:", error)
      console.error("Error response:", error.response?.data)

      let errorMessage = "Failed to save schedule"

      if (error.message && error.message.includes("required")) {
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
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

  const handleEdit = (schedule: Schedule) => {
    console.log("Editing schedule:", schedule)
    setEditingSchedule(schedule)

    // Extract studio number from "Studio X" format - handle both cases
    let studioNumber = schedule.ruangan
    if (studioNumber && studioNumber.startsWith("Studio ")) {
      studioNumber = studioNumber.replace("Studio ", "")
    }

    setFormData({
      film_id: schedule.film_id || "",
      tanggal: schedule.tanggal || "",
      waktu: schedule.waktu || "",
      ruangan: studioNumber, // Store just the number for form
      harga: schedule.harga?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingSchedule) return

    try {
      await api.delete(`/jadwals/${deletingSchedule._id}`)
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      })
      fetchSchedules()
      setDeletingSchedule(null)
    } catch (error: any) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete schedule",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      film_id: "",
      tanggal: "",
      waktu: "",
      ruangan: "",
      harga: "",
    })
    setEditingSchedule(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleAddScheduleClick = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  const formatDateTime = (tanggal: string, waktu: string) => {
    if (!tanggal || !waktu) return "N/A"
    try {
      const date = formatDate(tanggal)
      return `${date} • ${waktu}`
    } catch (error) {
      return "Invalid Date/Time"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getScheduleStatus = (tanggal: string, waktu: string) => {
    const now = new Date()
    const scheduleDateTime = new Date(`${tanggal}T${waktu}:00`)

    if (scheduleDateTime < now) {
      return { label: "Past", variant: "secondary" as const }
    } else if (scheduleDateTime.toDateString() === now.toDateString()) {
      return { label: "Today", variant: "default" as const }
    } else {
      return { label: "Upcoming", variant: "outline" as const }
    }
  }

  // Get unique studios for filter (extract numbers from "Studio X")
  const studios = Array.from(
    new Set(schedules.map((schedule) => schedule.ruangan.replace("Studio ", "")).filter(Boolean)),
  ).sort()

  // Calculate statistics
  const totalSchedules = filteredSchedules.length
  const todaySchedules = schedules.filter((s) => {
    const scheduleDate = new Date(s.tanggal)
    const today = new Date()
    return scheduleDate.toDateString() === today.toDateString()
  }).length
  const upcomingSchedules = schedules.filter((s) => {
    const scheduleDateTime = new Date(`${s.tanggal}T${s.waktu}:00`)
    return scheduleDateTime > new Date()
  }).length

  return (
    <AdminLayout title="Schedule Management">
      <div className="space-y-6">
        <ScheduleStats
          totalSchedules={totalSchedules}
          todaySchedules={todaySchedules}
          upcomingSchedules={upcomingSchedules}
        />
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Schedules</CardTitle>
                <CardDescription>Manage movie showtimes and schedules</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-[200px]"
                  />
                </div>
                <Select value={studioFilter} onValueChange={setStudioFilter}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="All Studios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Studios</SelectItem>
                    {studios.map((studio) => (
                      <SelectItem key={studio} value={studio}>
                        Studio {studio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-[130px]">
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddScheduleClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
                <ScheduleDialog
                  isDialogOpen={isDialogOpen}
                  handleDialogOpenChange={handleDialogOpenChange}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  editingSchedule={editingSchedule}
                  formData={formData}
                  setFormData={setFormData}
                  films={films}
                  studioOptions={studioOptions}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ScheduleTable
                  schedules={filteredSchedules}
                  onEdit={handleEdit}
                  onDelete={setDeletingSchedule}
                  formatDateTime={formatDateTime}
                  formatPrice={formatPrice}
                  getScheduleStatus={getScheduleStatus}
                />
              </div>
            )}
            {!isLoading && filteredSchedules.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No schedules found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || studioFilter !== "all" || dateFilter !== "all"
                    ? "No schedules match your criteria."
                    : "No schedules available. Create your first schedule to get started."}
                </p>
                {!searchTerm && studioFilter === "all" && dateFilter === "all" && (
                  <Button onClick={handleAddScheduleClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Schedule
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <ScheduleDeleteDialog
          open={!!deletingSchedule}
          schedule={deletingSchedule}
          onCancel={() => setDeletingSchedule(null)}
          onConfirm={handleDeleteConfirm}
          formatDateTime={formatDateTime}
        />
      </div>
    </AdminLayout>
  )
}
