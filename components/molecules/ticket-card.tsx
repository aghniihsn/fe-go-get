"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/atoms/status-badge"
import { PriceDisplay } from "@/components/atoms/price-display"
import type { Ticket } from "@/lib/types"
import { Calendar, MapPin, Armchair, CreditCard, FileText, Eye, Clock } from "lucide-react"

interface TicketCardProps {
  ticket: Ticket
  onPayment?: (ticketId: string) => void
  onViewDetails?: (ticket: Ticket) => void
  onDownloadReceipt?: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onPayment, onViewDetails, onDownloadReceipt }: TicketCardProps) {
  console.log("TicketCard received ticket:", ticket)

  const getPrice = () => {
    // Prioritaskan harga dari schedule yang sudah di-populated
    if (ticket.schedule?.harga) {
      return ticket.schedule.harga
    }
    // Fallback ke field lain
    return ticket.total_price || ticket.harga_tiket || ticket.price || 0
  }

  const getShowTime = () => {
    // Gabungkan tanggal dan waktu dari schedule jika tersedia
    if (ticket.schedule?.tanggal && ticket.schedule?.waktu) {
      return `${ticket.schedule.tanggal}T${ticket.schedule.waktu}:00`
    }
    // Fallback ke field lain
    return (
      ticket.schedule?.show_time ||
      ticket.show_time ||
      ticket.jadwal_waktu ||
      ticket.booking_date ||
      ticket.tanggal_pembelian
    )
  }

  const getStudio = () => {
    // Prioritaskan ruangan dari schedule
    if (ticket.schedule?.ruangan) {
      return ticket.schedule.ruangan.replace("Studio ", "") // Remove 'Studio ' prefix jika ada
    }
    // Fallback ke field lain
    return ticket.studio || ticket.jadwal_ruangan || ticket.ruangan || "N/A"
  }

  const getBookingDate = () => {
    // Prioritaskan booking_date yang sudah di-set
    return ticket.booking_date || ticket.tanggal_pembelian || ticket.created_at
  }

  const formatDateTime = (dateTime: string | undefined) => {
    if (!dateTime) return "N/A"
    try {
      const date = new Date(dateTime)
      if (isNaN(date.getTime())) return "N/A"

      return date.toLocaleString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  const formatDate = (dateTime: string | undefined) => {
    if (!dateTime) return "N/A"
    try {
      const date = new Date(dateTime)
      if (isNaN(date.getTime())) return "N/A"

      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  const formatTime = (dateTime: string | undefined) => {
    if (!dateTime) return "N/A"
    try {
      const date = new Date(dateTime)
      if (isNaN(date.getTime())) return "N/A"

      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting time:", error)
      return "N/A"
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

  const getMovieTitle = () => {
    // Try multiple possible sources for movie title
    return ticket.schedule?.film?.title || ticket.film_title || ticket.movie_title || "Movie Title"
  }

  console.log("Movie title:", getMovieTitle())
  console.log("Studio:", getStudio())
  console.log("Show time:", getShowTime())
  console.log("Booking date:", getBookingDate())
  console.log("Price:", getPrice())

  const renderActionButton = () => {
    switch (ticket.status) {
      case "waiting_for_payment":
        return (
          <Button onClick={() => onPayment?.(ticket._id || ticket.id)} className="w-full" size="sm">
            <CreditCard className="w-4 h-4 mr-2" />
            Make Payment
          </Button>
        )
      case "confirmed":
      case "used":
        return (
          <div className="flex gap-2">
            <Button onClick={() => onViewDetails?.(ticket)} variant="outline" className="flex-1" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Details
            </Button>
            <Button onClick={() => onDownloadReceipt?.(ticket)} variant="outline" className="flex-1" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Receipt
            </Button>
          </div>
        )
      case "cancelled":
        return (
          <Button onClick={() => onViewDetails?.(ticket)} variant="outline" className="w-full" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{getMovieTitle()}</CardTitle>
            <div className="flex items-center mt-1">
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Date and Time */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{formatDate(getShowTime())}</span>
            <span>{formatTime(getShowTime())}</span>
          </div>
        </div>

        {/* Studio */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="font-medium text-foreground">Studio {getStudio()}</span>
        </div>

        {/* Seats */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Armchair className="w-4 h-4 mr-2 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs">Seats:</span>
            <span className="font-medium text-foreground">{formatSeats(ticket.kursi)}</span>
          </div>
        </div>

        {/* Booking Date - Fixed */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs">Booked on:</span>
            <span className="font-medium text-foreground">{formatDateTime(getBookingDate())}</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Price:</span>
            <PriceDisplay price={getPrice()} className="text-lg font-bold text-primary" />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">{renderActionButton()}</div>
      </CardContent>
    </Card>
  )
}
