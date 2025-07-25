"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/organisms/navbar"
import { TicketCard } from "@/components/molecules/ticket-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import type { Ticket } from "@/lib/types"
import { Loader2, TicketIcon } from "lucide-react"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, statusFilter])

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tikets/me")
      setTickets(response.data)
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTickets = () => {
    if (statusFilter === "all") {
      setFilteredTickets(tickets)
    } else {
      setFilteredTickets(tickets.filter((ticket) => ticket.status === statusFilter))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 md:px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center">
                <TicketIcon className="mr-3 h-8 w-8" />
                My Tickets
              </h1>
              <p className="text-muted-foreground mt-2">View and manage your movie tickets</p>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground">
                {statusFilter === "all" ? "You haven't booked any tickets yet." : `No ${statusFilter} tickets found.`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
