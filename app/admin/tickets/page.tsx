"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { Search, Eye, Calendar, MapPin, UserIcon, Mail, Loader2, AlertCircle, Phone, MapPinIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Ticket {
  _id: string
  user_id: string
  jadwal_id: string
  kursi: string | string[]
  total_harga: number
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  updated_at: string
}

interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  username: string
  phone_number?: string
  address?: string
  gender?: string
  role?: string
  created_at?: string
}

interface Schedule {
  _id: string
  film_id: string
  film_title?: string
  tanggal: string
  waktu: string
  ruangan: string
  harga: number
  created_at: string
  updated_at: string
}

interface Film {
  _id: string
  title: string
  genre: string[]
  duration: number
  rating: string
  poster_url: string
  description: string
  created_at: string
  updated_at: string
}

interface TicketWithDetails extends Ticket {
  user?: User
  schedule?: Schedule
  film?: Film
  user_name: string
  user_email: string
  film_title: string
  schedule_date: string
  schedule_time: string
  studio: string
  seats_display: string
  ticket_price: number
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [filteredTickets, setFilteredTickets] = useState<TicketWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null)

  useEffect(() => {
    fetchTicketsWithDetails()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, searchTerm, statusFilter])

  const fetchUserById = async (userId: string): Promise<User | null> => {
    try {
      console.log(`👤 Fetching user with ID: ${userId}`)

      // Try different possible endpoints for user data
      const endpoints = [`/users/${userId}`, `/auth/users/${userId}`, `/user/${userId}`]

      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          if (response.data) {
            console.log(`✅ Successfully fetched user from ${endpoint}:`, response.data)
            return response.data
          }
        } catch (error: any) {
          console.log(`❌ Failed to fetch user from ${endpoint}:`, error.response?.status)
          continue
        }
      }

      // If individual user fetch fails, try to get from all users
      try {
        console.log(`🔄 Trying to get user from all users list...`)
        const allUsersResponse = await api.get("/users")
        const users = Array.isArray(allUsersResponse.data) ? allUsersResponse.data : []
        const user = users.find((u: User) => u._id === userId)
        if (user) {
          console.log(`✅ Found user in all users list:`, user)
          return user
        }
      } catch (error) {
        console.log(`❌ Failed to fetch from all users:`, error)
      }

      console.log(`❌ Could not find user with ID: ${userId}`)
      return null
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error)
      return null
    }
  }

  const fetchTicketsWithDetails = async () => {
    try {
      setLoading(true)
      console.log("🎫 Starting to fetch tickets with details...")

      // 1. Fetch all tickets
      const ticketsResponse = await api.get("/tikets")
      const ticketsData = Array.isArray(ticketsResponse.data) ? ticketsResponse.data : []
      console.log(`📋 Fetched ${ticketsData.length} tickets`)

      if (ticketsData.length === 0) {
        setTickets([])
        return
      }

      // 2. Fetch schedules and films in parallel
      const [schedulesResponse, filmsResponse] = await Promise.all([
        api.get("/jadwals").catch(() => ({ data: [] })),
        api.get("/films").catch(() => ({ data: [] })),
      ])

      const schedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []
      const films = Array.isArray(filmsResponse.data) ? filmsResponse.data : []

      console.log(`📅 Fetched ${schedules.length} schedules`)
      console.log(`🎬 Fetched ${films.length} films`)

      // 3. Create lookup maps for schedules and films
      const schedulesMap = schedules.reduce((acc: { [key: string]: Schedule }, schedule: Schedule) => {
        acc[schedule._id] = schedule
        return acc
      }, {})

      const filmsMap = films.reduce((acc: { [key: string]: Film }, film: Film) => {
        acc[film._id] = film
        return acc
      }, {})

      // 4. Get unique user IDs from tickets
      const uniqueUserIds = [...new Set(ticketsData.map((ticket: Ticket) => ticket.user_id))]
      console.log(`👥 Found ${uniqueUserIds.length} unique user IDs:`, uniqueUserIds)

      // 5. Fetch users individually
      const usersData = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const user = await fetchUserById(userId)
          return { userId, user }
        }),
      )

      // 6. Create users map
      const usersMap = usersData.reduce((acc: { [key: string]: User | null }, { userId, user }) => {
        acc[userId] = user
        return acc
      }, {})

      console.log(`👥 Successfully fetched ${Object.keys(usersMap).length} users`)

      // 7. Process tickets and enrich with related data
      const processedTickets: TicketWithDetails[] = ticketsData.map((ticket: Ticket) => {
        const user = usersMap[ticket.user_id]
        const schedule = schedulesMap[ticket.jadwal_id]
        const film = schedule ? filmsMap[schedule.film_id] : null

        console.log(`🎫 Processing ticket ${ticket._id}:`, {
          user_id: ticket.user_id,
          user_found: !!user,
          user_name: user ? `${user.firstname} ${user.lastname}` : "Not found",
          schedule_found: !!schedule,
          film_found: !!film,
        })

        // Calculate ticket price from schedule or use total_harga
        let ticketPrice = ticket.total_harga || 0
        if (schedule && schedule.harga) {
          const seatCount = Array.isArray(ticket.kursi) ? ticket.kursi.length : 1
          ticketPrice = schedule.harga * seatCount
        }

        return {
          ...ticket,
          user,
          schedule,
          film,
          user_name: user ? `${user.firstname} ${user.lastname}`.trim() || user.username : "Unknown User",
          user_email: user?.email || "N/A",
          film_title: film?.title || schedule?.film_title || "Unknown Movie",
          schedule_date: schedule?.tanggal || "N/A",
          schedule_time: schedule?.waktu || "N/A",
          studio: schedule?.ruangan || "N/A",
          seats_display: formatSeats(ticket.kursi),
          ticket_price: ticketPrice,
        }
      })

      console.log(`✅ Successfully processed ${processedTickets.length} tickets with details`)

      // Debug: Log first few processed tickets
      console.log(
        "📊 Sample processed tickets:",
        processedTickets.slice(0, 3).map((t) => ({
          id: t._id.slice(-8),
          user_name: t.user_name,
          user_email: t.user_email,
          film_title: t.film_title,
          price: t.ticket_price,
        })),
      )

      setTickets(processedTickets)
    } catch (error) {
      console.error("❌ Error fetching tickets:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets data",
        variant: "destructive",
      })
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const formatSeats = (kursi: string | string[]): string => {
    if (Array.isArray(kursi)) {
      return kursi.join(", ")
    }
    if (typeof kursi === "string") {
      // Handle JSON string format
      if (kursi.startsWith("[") && kursi.endsWith("]")) {
        try {
          const parsed = JSON.parse(kursi)
          return Array.isArray(parsed) ? parsed.join(", ") : kursi
        } catch {
          return kursi
        }
      }
      // Handle comma-separated string
      if (kursi.includes(",")) {
        return kursi
          .split(",")
          .map((seat) => seat.trim())
          .join(", ")
      }
      return kursi
    }
    return "N/A"
  }

  const filterTickets = () => {
    let filtered = tickets

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket._id.toLowerCase().includes(searchLower) ||
          ticket.user_name.toLowerCase().includes(searchLower) ||
          ticket.user_email.toLowerCase().includes(searchLower) ||
          ticket.film_title.toLowerCase().includes(searchLower) ||
          ticket.seats_display.toLowerCase().includes(searchLower) ||
          ticket.studio.toLowerCase().includes(searchLower),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter)
    }

    setFilteredTickets(filtered)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === 0) return "Rp 0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const formatScheduleDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  // Calculate stats
  const totalTickets = tickets.length
  const confirmedTickets = tickets.filter((t) => t.status === "confirmed").length
  const pendingTickets = tickets.filter((t) => t.status === "pending").length
  const cancelledTickets = tickets.filter((t) => t.status === "cancelled").length
  const totalRevenue = tickets
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + (t.ticket_price || 0), 0)

  if (loading) {
    return (
      <AdminLayout title="Ticket Management">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading tickets data...</p>
            <p className="text-sm text-muted-foreground">Fetching tickets, users, schedules, and films...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Ticket Management">
      <div className="space-y-6">
        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="text-sm space-y-1">
                <p>
                  <strong>Debug Info:</strong>
                </p>
                <p>Total tickets: {tickets.length}</p>
                <p>Users with data: {tickets.filter((t) => t.user).length}</p>
                <p>Users without data: {tickets.filter((t) => !t.user).length}</p>
                {tickets.length > 0 && (
                  <p>
                    Sample user IDs:{" "}
                    {tickets
                      .slice(0, 3)
                      .map((t) => t.user_id)
                      .join(", ")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedTickets}</div>
              <p className="text-xs text-muted-foreground">Active tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingTickets}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From confirmed tickets</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by ticket ID, user, movie, seats, or studio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No tickets have been created yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map((ticket) => (
              <Card key={ticket._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">#{ticket._id.slice(-8)}</h3>
                        {getStatusBadge(ticket.status)}
                        <span className="text-lg font-bold text-primary">{formatCurrency(ticket.ticket_price)}</span>
                        {!ticket.user && (
                          <Badge variant="destructive" className="text-xs">
                            No User Data
                          </Badge>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">{ticket.user_name}</span>
                            {ticket.user && (
                              <Badge variant="outline" className="text-xs">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{ticket.user_email}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">User ID: {ticket.user_id}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>
                              {ticket.schedule_date !== "N/A" && ticket.schedule_time !== "N/A"
                                ? `${formatScheduleDate(ticket.schedule_date)} at ${ticket.schedule_time}`
                                : "Schedule unavailable"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">
                              {ticket.studio !== "N/A" ? `${ticket.studio} - ${ticket.film_title}` : ticket.film_title}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Seats */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">Seats:</span>
                        <div className="flex flex-wrap gap-1">
                          {ticket.seats_display.split(", ").map((seat, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {seat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-muted-foreground">{formatDate(ticket.created_at)}</div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Ticket Details</DialogTitle>
                            <DialogDescription>
                              Complete information for ticket #{ticket._id.slice(-8)}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedTicket && (
                            <div className="space-y-6">
                              {/* Ticket Info */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Ticket Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Ticket ID:</span>
                                    <p className="font-mono text-xs bg-muted p-1 rounded mt-1">{selectedTicket._id}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">User ID:</span>
                                    <p className="font-mono text-xs bg-muted p-1 rounded mt-1">
                                      {selectedTicket.user_id}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Status:</span>
                                    <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Total Price:</span>
                                    <p className="font-medium text-primary">
                                      {formatCurrency(selectedTicket.ticket_price)}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Seats:</span>
                                    <p className="font-medium">{selectedTicket.seats_display}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Created:</span>
                                    <p className="font-medium">{formatDate(selectedTicket.created_at)}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Customer Info */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <UserIcon className="h-4 w-4" />
                                  Customer Information
                                  {!selectedTicket.user && (
                                    <Badge variant="destructive" className="text-xs ml-2">
                                      Data Not Found
                                    </Badge>
                                  )}
                                </h4>
                                {selectedTicket.user ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Full Name:</span>
                                      <p className="font-medium">
                                        {selectedTicket.user.firstname} {selectedTicket.user.lastname}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Username:</span>
                                      <p className="font-medium">@{selectedTicket.user.username}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Email:</span>
                                      <p className="font-medium">{selectedTicket.user.email}</p>
                                    </div>
                                    {selectedTicket.user.phone_number && (
                                      <div>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <p className="font-medium flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {selectedTicket.user.phone_number}
                                        </p>
                                      </div>
                                    )}
                                    {selectedTicket.user.gender && (
                                      <div>
                                        <span className="text-muted-foreground">Gender:</span>
                                        <p className="font-medium capitalize">{selectedTicket.user.gender}</p>
                                      </div>
                                    )}
                                    {selectedTicket.user.address && (
                                      <div className="md:col-span-2">
                                        <span className="text-muted-foreground">Address:</span>
                                        <p className="font-medium flex items-start gap-1">
                                          <MapPinIcon className="h-3 w-3 mt-1 flex-shrink-0" />
                                          {selectedTicket.user.address}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                                    <p>User data could not be loaded for User ID: {selectedTicket.user_id}</p>
                                    <p className="mt-1">This might indicate:</p>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      <li>User account was deleted</li>
                                      <li>User endpoint is not accessible</li>
                                      <li>User ID format mismatch</li>
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Movie & Schedule Info */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Movie & Schedule Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Movie:</span>
                                    <p className="font-medium">{selectedTicket.film_title}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Studio:</span>
                                    <p className="font-medium">{selectedTicket.studio}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Date:</span>
                                    <p className="font-medium">{formatScheduleDate(selectedTicket.schedule_date)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Time:</span>
                                    <p className="font-medium">{selectedTicket.schedule_time}</p>
                                  </div>
                                  {selectedTicket.schedule && (
                                    <div>
                                      <span className="text-muted-foreground">Price per seat:</span>
                                      <p className="font-medium">{formatCurrency(selectedTicket.schedule.harga)}</p>
                                    </div>
                                  )}
                                  {selectedTicket.film && (
                                    <>
                                      <div>
                                        <span className="text-muted-foreground">Genre:</span>
                                        <p className="font-medium">
                                          {Array.isArray(selectedTicket.film.genre)
                                            ? selectedTicket.film.genre.join(", ")
                                            : selectedTicket.film.genre}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Duration:</span>
                                        <p className="font-medium">{selectedTicket.film.duration} minutes</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Rating:</span>
                                        <p className="font-medium">{selectedTicket.film.rating}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
