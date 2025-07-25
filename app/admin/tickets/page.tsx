"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/atoms/status-badge"
import { PriceDisplay } from "@/components/atoms/price-display"
import { api } from "@/lib/api"
import type { Ticket } from "@/lib/types"
import { Search, Loader2, Eye, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, searchTerm, statusFilter])

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tikets")
      setTickets(response.data || [])
    } catch (error) {
      console.error("Error fetching tickets:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterTickets = () => {
    let filtered = tickets

    if (searchTerm) {
      filtered = filtered.filter((ticket) => {
        const userEmail = ticket.user?.email?.toLowerCase() || ""
        const movieTitle = ticket.schedule?.film?.title?.toLowerCase() || ""
        const seats = Array.isArray(ticket.kursi)
          ? ticket.kursi.join(", ").toLowerCase()
          : String(ticket.kursi || "").toLowerCase()

        return (
          userEmail.includes(searchTerm.toLowerCase()) ||
          movieTitle.includes(searchTerm.toLowerCase()) ||
          seats.includes(searchTerm.toLowerCase())
        )
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter)
    }

    setFilteredTickets(filtered)
  }

  const handleDelete = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return

    try {
      await api.delete(`/tikets/${ticketId}`)
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      })
      fetchTickets()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete ticket",
        variant: "destructive",
      })
    }
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

  const formatSeats = (kursi: any) => {
    if (Array.isArray(kursi)) {
      return kursi.join(", ")
    }
    if (typeof kursi === "string") {
      return kursi
    }
    return "N/A"
  }

  const getUserName = (user: any) => {
    if (!user) return "N/A"
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`
    }
    return user.username || user.email || "N/A"
  }

  return (
    <AdminLayout title="Ticket Management">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Tickets</CardTitle>
              <CardDescription>Manage all ticket bookings</CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[250px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
                    <TableHead>User</TableHead>
                    <TableHead>Movie</TableHead>
                    <TableHead>Studio</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Show Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getUserName(ticket.user)}</div>
                          <div className="text-sm text-muted-foreground">{ticket.user?.email || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{ticket.schedule?.film?.title || "N/A"}</TableCell>
                      <TableCell>Studio {ticket.schedule?.studio || "N/A"}</TableCell>
                      <TableCell>{formatSeats(ticket.kursi)}</TableCell>
                      <TableCell>{formatDateTime(ticket.schedule?.show_time)}</TableCell>
                      <TableCell>
                        <PriceDisplay price={ticket.total_price || 0} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status || "unknown"} />
                      </TableCell>
                      <TableCell>{formatDateTime(ticket.booking_date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(ticket.id)}>
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

          {!isLoading && filteredTickets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tickets found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
