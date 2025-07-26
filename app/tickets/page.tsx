"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/organisms/navbar"
import { TicketCard } from "@/components/molecules/ticket-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Ticket } from "@/lib/types"
import { Loader2, TicketIcon, Download, Calendar, Clock, CreditCard, Eye, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { StatusBadge } from "@/components/atoms/status-badge"
import { PriceDisplay } from "@/components/atoms/price-display"

export default function TicketsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isReceiptPreviewOpen, setIsReceiptPreviewOpen] = useState(false)
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string>("")
  const [generatingReceipt, setGeneratingReceipt] = useState(false)
  const [downloadingReceipt, setDownloadingReceipt] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, statusFilter])

  const fetchTicketWithDetails = async (ticketId: string) => {
    try {
      // Try to get ticket summary which should have more details
      const summaryResponse = await api.get(`/tikets/${ticketId}/summary`)
      return summaryResponse.data
    } catch (error) {
      console.error(`Failed to fetch summary for ticket ${ticketId}:`, error)

      // Fallback to basic ticket info
      try {
        const ticketResponse = await api.get(`/tikets/${ticketId}`)
        const ticket = ticketResponse.data

        // Jika ticket memiliki jadwal_id, coba ambil detail schedule
        if (ticket.jadwal_id) {
          try {
            const scheduleResponse = await api.get(`/jadwals/${ticket.jadwal_id}`)
            const schedule = scheduleResponse.data

            // Merge schedule data ke ticket
            ticket.schedule = {
              ...schedule,
              film: {
                title: schedule.film_title || "Unknown Movie",
              },
              studio: schedule.ruangan,
              show_time: `${schedule.tanggal}T${schedule.waktu}:00`,
              price: schedule.harga,
              harga: schedule.harga,
              tanggal: schedule.tanggal,
              waktu: schedule.waktu,
            }

            // Set total_price dari schedule jika belum ada
            if (!ticket.total_price && schedule.harga) {
              ticket.total_price = schedule.harga
            }
          } catch (scheduleError) {
            console.error(`Failed to fetch schedule for ticket ${ticketId}:`, scheduleError)
          }
        }

        return ticket
      } catch (fallbackError) {
        console.error(`Failed to fetch basic ticket info for ${ticketId}:`, fallbackError)
        return null
      }
    }
  }

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tikets/me")
      console.log("Raw tickets response:", response.data)

      const ticketsData = response.data || []

      // Enrich tickets dengan detail schedule
      const enrichedTickets = await Promise.all(
        ticketsData.map(async (ticket) => {
          // Ensure booking_date is properly set
          const bookingDate =
            ticket.tanggal_pembelian || ticket.created_at || ticket.booking_date || new Date().toISOString()

          // Check if ticket already has complete schedule data
          if (ticket.schedule && ticket.schedule.harga && ticket.schedule.tanggal && ticket.schedule.waktu) {
            console.log("Ticket already has complete schedule data:", ticket)
            return {
              ...ticket,
              booking_date: bookingDate,
            }
          }

          // Try to get more detailed info
          console.log("Fetching detailed info for ticket:", ticket._id || ticket.id)
          const detailedTicket = await fetchTicketWithDetails(ticket._id || ticket.id)

          if (detailedTicket) {
            // If we got summary data, merge it
            if (detailedTicket.tiket || detailedTicket.ticket) {
              const ticketData = detailedTicket.tiket || detailedTicket.ticket
              return {
                ...ticket,
                ...ticketData,
                booking_date: bookingDate,
                // Add schedule info from summary
                schedule: {
                  film: {
                    title: detailedTicket.film_title,
                    poster_url: detailedTicket.film_poster,
                  },
                  studio: detailedTicket.jadwal_ruangan,
                  ruangan: detailedTicket.jadwal_ruangan,
                  show_time: `${detailedTicket.jadwal_tanggal}T${detailedTicket.jadwal_waktu}:00`,
                  price: detailedTicket.harga_tiket,
                  harga: detailedTicket.harga_tiket,
                  tanggal: detailedTicket.jadwal_tanggal,
                  waktu: detailedTicket.jadwal_waktu,
                },
                total_price: detailedTicket.harga_tiket,
              }
            }

            // If we got basic ticket data with schedule, use it
            return {
              ...ticket,
              ...detailedTicket,
              booking_date: bookingDate,
            }
          }

          return {
            ...ticket,
            booking_date: bookingDate,
          }
        }),
      )

      console.log("Enriched tickets:", enrichedTickets)
      setTickets(enrichedTickets)
    } catch (error) {
      console.error("Error fetching tickets:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      })
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

  const handlePayment = (ticketId: string) => {
    // Redirect to payment page with single ticket
    router.push(`/payment?tickets=${ticketId}`)
  }

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailDialogOpen(true)
  }

  const generateQRCode = (ticketId: string): string => {
    // Simple QR code generation using a service
    // In production, you might want to use a proper QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketId)}`
  }

  const handlePreviewReceipt = async (ticket: Ticket) => {
    setGeneratingReceipt(true)
    setSelectedTicket(ticket) // Set selected ticket for download
    try {
      // Generate receipt image with QR code and logo
      const receiptData = await generateTicketReceipt(ticket)
      setReceiptPreviewUrl(receiptData.url)
      setIsReceiptPreviewOpen(true)

      toast({
        title: "Success",
        description: "Receipt preview generated successfully",
      })
    } catch (error) {
      console.error("Error generating receipt preview:", error)
      toast({
        title: "Error",
        description: "Failed to generate receipt preview",
        variant: "destructive",
      })
    } finally {
      setGeneratingReceipt(false)
    }
  }

  const handleDownloadFromPreview = async () => {
    if (!receiptPreviewUrl || !selectedTicket) {
      toast({
        title: "Error",
        description: "No receipt available for download",
        variant: "destructive",
      })
      return
    }

    setDownloadingReceipt(true)

    try {
      console.log("Starting download process...")
      console.log("Receipt URL:", receiptPreviewUrl)

      // Convert blob URL to actual blob
      const response = await fetch(receiptPreviewUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch receipt: ${response.status}`)
      }

      const blob = await response.blob()
      console.log("Blob created:", blob.size, "bytes")

      // Create object URL from blob
      const downloadUrl = URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `movietix-receipt-${selectedTicket._id || selectedTicket.id}.jpg`
      link.style.display = "none"

      // Add to DOM, click, and remove
      document.body.appendChild(link)
      console.log("Triggering download...")
      link.click()
      document.body.removeChild(link)

      // Clean up object URL
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl)
      }, 1000)

      toast({
        title: "Success",
        description: "Receipt downloaded successfully",
      })

      // Close preview modal after successful download
      setTimeout(() => {
        setIsReceiptPreviewOpen(false)
        setReceiptPreviewUrl("")
      }, 1000)
    } catch (error) {
      console.error("Error downloading receipt:", error)
      toast({
        title: "Error",
        description: `Failed to download receipt: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setDownloadingReceipt(false)
    }
  }

  const generateTicketReceipt = async (ticket: Ticket): Promise<{ url: string }> => {
    return new Promise((resolve, reject) => {
      console.log("Starting receipt generation for ticket:", ticket._id || ticket.id)

      // Create canvas for receipt
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Canvas context not available"))
        return
      }

      // Set canvas size - made it larger for better quality
      canvas.width = 500
      canvas.height = 800

      // Background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Load MovieTix logo
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"

      // Load QR code
      const qrCodeUrl = generateQRCode(ticket._id || ticket.id)
      const qrImg = new Image()
      qrImg.crossOrigin = "anonymous"

      let imagesLoaded = 0
      const totalImages = 2
      let hasDrawn = false

      const checkAllImagesLoaded = () => {
        imagesLoaded++
        console.log(`Images loaded: ${imagesLoaded}/${totalImages}`)
        if (imagesLoaded === totalImages && !hasDrawn) {
          hasDrawn = true
          drawReceipt()
        }
      }

      const drawReceipt = () => {
        try {
          console.log("Drawing receipt...")

          // Header background
          ctx.fillStyle = "#F4C430"
          ctx.fillRect(0, 0, canvas.width, 100)

          // Draw MovieTix logo if loaded
          if (logoImg.complete && logoImg.naturalWidth > 0) {
            const logoSize = 60
            ctx.drawImage(logoImg, 30, 20, logoSize, logoSize)
            console.log("Logo drawn successfully")
          } else {
            console.log("Logo not available, skipping")
          }

          // MovieTix Title
          ctx.fillStyle = "#1a1a1a"
          ctx.font = "bold 28px Arial"
          ctx.textAlign = "left"
          ctx.fillText("MovieTix", 110, 45)
          ctx.font = "16px Arial"
          ctx.fillText("Cinema Ticket Receipt", 110, 70)

          // Ticket Info Section
          ctx.fillStyle = "#333333"
          ctx.textAlign = "left"
          ctx.font = "bold 20px Arial"

          let y = 140
          const leftMargin = 30

          // Movie Title
          ctx.fillText("Movie:", leftMargin, y)
          ctx.font = "18px Arial"
          ctx.fillStyle = "#000000"
          const movieTitle = ticket.schedule?.film?.title || ticket.film_title || "N/A"
          ctx.fillText(movieTitle, leftMargin, y + 25)
          y += 60

          // Date & Time
          ctx.fillStyle = "#333333"
          ctx.font = "bold 18px Arial"
          ctx.fillText("Date & Time:", leftMargin, y)
          ctx.font = "16px Arial"
          ctx.fillStyle = "#000000"
          const showTime = ticket.schedule?.show_time || ticket.booking_date
          const formattedTime = showTime
            ? new Date(showTime).toLocaleString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"

          // Split long date text into multiple lines if needed
          const maxWidth = canvas.width - leftMargin - 20
          const words = formattedTime.split(" ")
          let line = ""
          let lineY = y + 25

          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " "
            const metrics = ctx.measureText(testLine)
            if (metrics.width > maxWidth && i > 0) {
              ctx.fillText(line, leftMargin, lineY)
              line = words[i] + " "
              lineY += 20
            } else {
              line = testLine
            }
          }
          ctx.fillText(line, leftMargin, lineY)
          y += 80

          // Studio
          ctx.fillStyle = "#333333"
          ctx.font = "bold 18px Arial"
          ctx.fillText("Studio:", leftMargin, y)
          ctx.font = "16px Arial"
          ctx.fillStyle = "#000000"
          const studio = ticket.schedule?.ruangan || ticket.schedule?.studio || "N/A"
          ctx.fillText(`Studio ${studio}`, leftMargin, y + 25)
          y += 60

          // Seats
          ctx.fillStyle = "#333333"
          ctx.font = "bold 18px Arial"
          ctx.fillText("Seats:", leftMargin, y)
          ctx.font = "16px Arial"
          ctx.fillStyle = "#000000"
          const seats = Array.isArray(ticket.kursi) ? ticket.kursi.join(", ") : ticket.kursi || "N/A"
          ctx.fillText(seats, leftMargin, y + 25)
          y += 60

          // Price
          ctx.fillStyle = "#333333"
          ctx.font = "bold 18px Arial"
          ctx.fillText("Total Price:", leftMargin, y)
          ctx.font = "bold 20px Arial"
          ctx.fillStyle = "#F4C430"
          const price = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(ticket.total_price || ticket.schedule?.harga || 0)
          ctx.fillText(price, leftMargin, y + 30)
          y += 70

          // Status
          ctx.fillStyle = "#333333"
          ctx.font = "bold 18px Arial"
          ctx.fillText("Status:", leftMargin, y)
          ctx.font = "bold 16px Arial"
          ctx.fillStyle =
            ticket.status === "confirmed"
              ? "#22c55e"
              : ticket.status === "used"
                ? "#6b7280"
                : ticket.status === "waiting_for_payment"
                  ? "#f59e0b"
                  : "#ef4444"
          ctx.fillText(ticket.status.toUpperCase(), leftMargin, y + 25)
          y += 60

          // Divider line
          ctx.strokeStyle = "#e5e5e5"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(leftMargin, y)
          ctx.lineTo(canvas.width - leftMargin, y)
          ctx.stroke()
          y += 30

          // QR Code Section
          const qrSize = 140
          const qrX = canvas.width - qrSize - 40
          const qrY = y

          // QR Code background
          ctx.fillStyle = "#f8f9fa"
          ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 60)
          ctx.strokeStyle = "#e9ecef"
          ctx.lineWidth = 1
          ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 60)

          // Draw QR code if loaded
          if (qrImg.complete && qrImg.naturalWidth > 0) {
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
            console.log("QR code drawn successfully")
          } else {
            // Fallback QR placeholder
            ctx.strokeStyle = "#cccccc"
            ctx.strokeRect(qrX, qrY, qrSize, qrSize)
            ctx.fillStyle = "#999999"
            ctx.font = "12px Arial"
            ctx.textAlign = "center"
            ctx.fillText("QR Code", qrX + qrSize / 2, qrY + qrSize / 2)
            console.log("QR code not available, using placeholder")
          }

          // QR Code label
          ctx.fillStyle = "#333333"
          ctx.font = "bold 14px Arial"
          ctx.textAlign = "center"
          ctx.fillText("Scan QR Code", qrX + qrSize / 2, qrY + qrSize + 20)
          ctx.font = "12px Arial"
          ctx.fillText("for validation", qrX + qrSize / 2, qrY + qrSize + 35)

          // Ticket ID (left side of QR)
          ctx.fillStyle = "#666666"
          ctx.font = "12px Arial"
          ctx.textAlign = "left"
          ctx.fillText("Ticket ID:", leftMargin, qrY + 20)
          ctx.font = "10px monospace"
          ctx.fillText(ticket._id || ticket.id, leftMargin, qrY + 40)

          // Booking Date - Fixed to use proper booking_date
          ctx.font = "12px Arial"
          ctx.fillText("Booked on:", leftMargin, qrY + 70)
          ctx.font = "10px Arial"
          const bookingDate = ticket.booking_date || ticket.tanggal_pembelian || ticket.created_at
          const formattedBookingDate = bookingDate
            ? new Date(bookingDate).toLocaleString("id-ID", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"
          ctx.fillText(formattedBookingDate, leftMargin, qrY + 90)

          // Important Notice
          ctx.fillStyle = "#dc2626"
          ctx.font = "bold 12px Arial"
          ctx.textAlign = "center"
          ctx.fillText("⚠️ IMPORTANT NOTICE ⚠️", canvas.width / 2, qrY + qrSize + 80)
          ctx.fillStyle = "#374151"
          ctx.font = "11px Arial"
          ctx.fillText("Present this QR code at the cinema entrance", canvas.width / 2, qrY + qrSize + 100)
          ctx.fillText("Ticket is valid only for the specified date and time", canvas.width / 2, qrY + qrSize + 115)

          // Footer
          const footerY = canvas.height - 50
          ctx.fillStyle = "#F4C430"
          ctx.fillRect(0, footerY, canvas.width, 50)

          ctx.fillStyle = "#1a1a1a"
          ctx.font = "bold 14px Arial"
          ctx.textAlign = "center"
          ctx.fillText("Thank you for choosing MovieTix!", canvas.width / 2, footerY + 20)
          ctx.font = "12px Arial"
          ctx.fillText("Enjoy your movie experience!", canvas.width / 2, footerY + 35)

          console.log("Receipt drawing completed")

          // Convert to blob and create URL
          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log("Blob created successfully:", blob.size, "bytes")
                const url = URL.createObjectURL(blob)
                console.log("Object URL created:", url)
                resolve({ url })
              } else {
                console.error("Failed to create blob")
                reject(new Error("Failed to generate receipt blob"))
              }
            },
            "image/jpeg",
            0.9,
          )
        } catch (error) {
          console.error("Error drawing receipt:", error)
          reject(error)
        }
      }

      // Handle logo load
      logoImg.onload = () => {
        console.log("Logo loaded successfully")
        checkAllImagesLoaded()
      }
      logoImg.onerror = (error) => {
        console.warn("Failed to load logo:", error)
        checkAllImagesLoaded()
      }

      // Handle QR code load
      qrImg.onload = () => {
        console.log("QR code loaded successfully")
        checkAllImagesLoaded()
      }
      qrImg.onerror = (error) => {
        console.warn("Failed to load QR code:", error)
        checkAllImagesLoaded()
      }

      // Start loading images
      console.log("Loading logo from:", "/movietix-logo.png")
      console.log("Loading QR code from:", qrCodeUrl)
      logoImg.src = "/movietix-logo.png"
      qrImg.src = qrCodeUrl

      // Timeout fallback
      setTimeout(() => {
        if (imagesLoaded < totalImages && !hasDrawn) {
          console.warn("Image loading timeout, proceeding with available images")
          hasDrawn = true
          drawReceipt()
        }
      }, 10000) // Increased timeout to 10 seconds
    })
  }

  const formatDateTime = (dateTime: string | undefined) => {
    if (!dateTime) return "N/A"
    try {
      const date = new Date(dateTime)
      if (isNaN(date.getTime())) return "N/A"

      return date.toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
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

  // Calculate statistics
  const totalSpent = filteredTickets
    .filter((ticket) => ticket.status === "confirmed" || ticket.status === "used")
    .reduce((sum, ticket) => sum + (ticket.total_price || ticket.schedule?.harga || 0), 0)

  const upcomingTickets = filteredTickets.filter(
    (ticket) =>
      ticket.status === "confirmed" && ticket.schedule?.show_time && new Date(ticket.schedule.show_time) > new Date(),
  ).length

  const pendingPayments = filteredTickets.filter((ticket) => ticket.status === "waiting_for_payment").length

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
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="waiting_for_payment">Waiting for Payment</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          {!loading && tickets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceDisplay price={totalSpent} className="text-2xl font-bold" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Upcoming Movies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingTickets}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Pending Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingPayments}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket._id || ticket.id}
                  ticket={ticket}
                  onPayment={handlePayment}
                  onViewDetails={handleViewDetails}
                  onDownloadReceipt={handlePreviewReceipt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TicketIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground">
                {statusFilter === "all"
                  ? "You haven't booked any tickets yet."
                  : `No ${statusFilter.replace("_", " ")} tickets found.`}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Ticket Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>Complete information about your ticket</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Movie</label>
                  <p className="font-medium">
                    {selectedTicket.schedule?.film?.title || selectedTicket.film_title || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedTicket.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                  <p className="font-medium">
                    {formatDateTime(selectedTicket.schedule?.show_time || selectedTicket.booking_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Studio</label>
                  <p className="font-medium">
                    Studio {selectedTicket.schedule?.studio || selectedTicket.schedule?.ruangan || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seats</label>
                  <p className="font-medium">{formatSeats(selectedTicket.kursi)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Price</label>
                  <p className="font-medium text-primary">
                    <PriceDisplay price={selectedTicket.total_price || selectedTicket.schedule?.harga || 0} />
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Ticket ID</label>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedTicket._id || selectedTicket.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Booking Date</label>
                <p className="font-medium">{formatDateTime(selectedTicket.booking_date)}</p>
              </div>

              {/* QR Code Preview */}
              {(selectedTicket.status === "confirmed" || selectedTicket.status === "used") && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">QR Code</label>
                  <div className="mt-2 flex justify-center">
                    <img
                      src={generateQRCode(selectedTicket._id || selectedTicket.id)}
                      alt="Ticket QR Code"
                      className="w-32 h-32 border rounded"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Show this QR code at the cinema for validation
                  </p>
                </div>
              )}

              {(selectedTicket.status === "confirmed" || selectedTicket.status === "used") && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handlePreviewReceipt(selectedTicket)}
                    disabled={generatingReceipt}
                    className="w-full"
                  >
                    {generatingReceipt ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    Preview Receipt
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Preview Modal */}
      <Dialog open={isReceiptPreviewOpen} onOpenChange={setIsReceiptPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Receipt Preview
              <Button variant="ghost" size="sm" onClick={() => setIsReceiptPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>Preview your ticket receipt before downloading</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            {receiptPreviewUrl && (
              <div className="max-h-[60vh] overflow-auto border rounded-lg">
                <img
                  src={receiptPreviewUrl || "/placeholder.svg"}
                  alt="Receipt Preview"
                  className="w-full h-auto"
                  onError={(e) => {
                    console.error("Failed to load receipt preview")
                    e.currentTarget.src = "/placeholder.svg?height=400&width=300&text=Receipt+Preview+Error"
                  }}
                />
              </div>
            )}

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReceiptPreviewOpen(false)
                  setReceiptPreviewUrl("")
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={handleDownloadFromPreview}
                disabled={downloadingReceipt || !receiptPreviewUrl}
                className="flex-1"
              >
                {downloadingReceipt ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
