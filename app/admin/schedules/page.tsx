"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Schedule, Film } from "@/lib/types"
import { Plus, Edit, Trash2, Loader2, Search, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [films, setFilms] = useState<Film[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [studioFilter, setStudioFilter] = useState("all")
  const [formData, setFormData] = useState({
    film_id: "",
    studio: "",
    show_time: "",
    price: "",
    available_seats: [] as string[],
  })

  useEffect(() => {
    fetchSchedules()
    fetchFilms()
  }, [])

  useEffect(() => {
    filterSchedules()
  }, [schedules, searchTerm, studioFilter])

  const fetchSchedules = async () => {
    try {
      const response = await api.get("/jadwals")
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
    }
  }

  const filterSchedules = () => {
    let filtered = schedules

    if (searchTerm) {
      filtered = filtered.filter((schedule) => {
        const filmTitle = schedule.film?.title?.toLowerCase() || ""
        const studio = schedule.studio?.toLowerCase() || ""
        return filmTitle.includes(searchTerm.toLowerCase()) || studio.includes(searchTerm.toLowerCase())
      })
    }

    if (studioFilter !== "all") {
      filtered = filtered.filter((schedule) => schedule.studio === studioFilter)
    }

    setFilteredSchedules(filtered)
  }

  const generateSeats = (rows = 10, seatsPerRow = 10) => {
    const seats = []
    for (let row = 1; row <= rows; row++) {
      const rowLetter = String.fromCharCode(64 + row) // A, B, C, etc.
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        seats.push(`${rowLetter}${seat}`)
      }
    }
    return seats
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const scheduleData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        available_seats: formData.available_seats.length > 0 ? formData.available_seats : generateSeats(),
      }

      if (editingSchedule) {
        await api.put(`/jadwals/${editingSchedule.id}`, scheduleData)
        toast({
          title: "Success",
          description: "Schedule updated successfully",
        })
      } else {
        await api.post("/jadwals", scheduleData)
        toast({
          title: "Success",
          description: "Schedule created successfully",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchSchedules()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save schedule",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      film_id: schedule.film_id,
      studio: schedule.studio,
      show_time: new Date(schedule.show_time).toISOString().slice(0, 16),
      price: schedule.price.toString(),
      available_seats: schedule.available_seats || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return

    try {
      await api.delete(`/jadwals/${scheduleId}`)
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      })
      fetchSchedules()
    } catch (error: any) {
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
      studio: "",
      show_time: "",
      price: "",
      available_seats: [],
    })
    setEditingSchedule(null)
  }

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "N/A"
    try {
      return new Date(dateTime).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const studios = Array.from(new Set(schedules.map((schedule) => schedule.studio).filter(Boolean)))

  return (
    <AdminLayout title="Schedule Management">
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
                    <DialogDescription>
                      {editingSchedule ? "Update schedule information" : "Add a new movie schedule"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="film_id">Movie</Label>
                        <Select
                          value={formData.film_id}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, film_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a movie" />
                          </SelectTrigger>
                          <SelectContent>
                            {films.map((film) => (
                              <SelectItem key={film.id} value={film.id}>
                                {film.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studio">Studio</Label>
                          <Input
                            id="studio"
                            value={formData.studio}
                            onChange={(e) => setFormData((prev) => ({ ...prev, studio: e.target.value }))}
                            placeholder="e.g., A, B, 1, 2"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (IDR)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="show_time">Show Time</Label>
                        <Input
                          id="show_time"
                          type="datetime-local"
                          value={formData.show_time}
                          onChange={(e) => setFormData((prev) => ({ ...prev, show_time: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingSchedule ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Studio</TableHead>
                    <TableHead>Show Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available Seats</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.film?.title || "N/A"}</TableCell>
                      <TableCell>Studio {schedule.studio}</TableCell>
                      <TableCell>{formatDateTime(schedule.show_time)}</TableCell>
                      <TableCell>{formatPrice(schedule.price)}</TableCell>
                      <TableCell>{schedule.available_seats?.length || 0} seats</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(schedule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && filteredSchedules.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No schedules found</h3>
              <p className="text-muted-foreground">
                {searchTerm || studioFilter !== "all" ? "No schedules match your criteria." : "No schedules available."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
