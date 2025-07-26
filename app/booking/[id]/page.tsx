"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/organisms/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeatButton } from "@/components/atoms/seat-button"
import { PriceDisplay } from "@/components/atoms/price-display"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Schedule, AvailableSeats } from "@/lib/types"
import { Calendar, MapPin, Clock, Loader2, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [availableSeats, setAvailableSeats] = useState<AvailableSeats | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchScheduleDetail()
      fetchAvailableSeats()
    }
  }, [params.id])

  const fetchScheduleDetail = async () => {
    try {
      // Try different endpoints based on your API structure
      let response
      try {
        // First try the detail endpoint with jadwal_id
        response = await api.get(`/jadwals/detail?jadwal_id=${params.id}`)
        if (response.data && response.data.length > 0) {
          setSchedule(response.data[0])
        }
      } catch (error) {
        // Fallback to individual jadwal endpoint
        response = await api.get(`/jadwals/${params.id}`)
        setSchedule(response.data)
      }
    } catch (error) {
      console.error("Error fetching schedule:", error)
      toast({
        title: "Error",
        description: "Failed to load schedule details",
        variant: "destructive",
      })
    }
  }

  const fetchAvailableSeats = async () => {
    try {
      const response = await api.get(`/jadwals/${params.id}/kursi-kosong`)
      console.log("Available seats response:", response.data)

      // Generate all possible seats (A1-E10)
      const allSeats = []
      const rows = ["A", "B", "C", "D", "E"]
      const seatsPerRow = 10

      for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          allSeats.push(`${row}${i}`)
        }
      }

      // Handle different response formats
      let availableSeatsArray = []

      if (Array.isArray(response.data)) {
        // If response.data is directly an array of available seats
        availableSeatsArray = response.data
      } else if (response.data && response.data.available_seats) {
        // If response.data has available_seats property
        availableSeatsArray = response.data.available_seats
      }

      // Calculate occupied seats by finding difference
      const occupiedSeats = allSeats.filter((seat) => !availableSeatsArray.includes(seat))

      console.log("All seats:", allSeats)
      console.log("Available seats:", availableSeatsArray)
      console.log("Occupied seats:", occupiedSeats)

      setAvailableSeats({
        available_seats: availableSeatsArray,
        total_seats: allSeats.length,
        occupied_seats: occupiedSeats,
      })
    } catch (error) {
      console.error("Error fetching available seats:", error)
      // Set default seat structure on error
      setAvailableSeats({
        available_seats: [],
        total_seats: 50,
        occupied_seats: [],
      })
      toast({
        title: "Error",
        description: "Failed to load seat availability. Showing default layout.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSeatClick = (seatNumber: string) => {
    if (!availableSeats) return

    // Check if seat is occupied (not in available_seats list)
    if (!availableSeats.available_seats.includes(seatNumber)) {
      toast({
        title: "Seat Unavailable",
        description: `Seat ${seatNumber} is already occupied or not available`,
        variant: "destructive",
      })
      return
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber))
    } else {
      if (selectedSeats.length < 6) {
        // Max 6 seats per booking
        setSelectedSeats([...selectedSeats, seatNumber])
      } else {
        toast({
          title: "Maximum seats reached",
          description: "You can only select up to 6 seats per booking",
          variant: "destructive",
        })
      }
    }
  }

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book tickets",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat",
        variant: "destructive",
      })
      return
    }

    setBooking(true)

    try {
      let response
      if (selectedSeats.length === 1) {
        // Single ticket booking
        response = await api.post("/tikets", {
          jadwal_id: params.id,
          user_id: user._id,
          kursi: selectedSeats[0],
        })
      } else {
        // Multiple tickets booking
        response = await api.post("/tikets/batch", {
          jadwal_id: params.id,
          user_id: user._id,
          kursis: selectedSeats,
        })
      }

      toast({
        title: "Success",
        description: "Tickets booked successfully!",
      })

      // Redirect to payment page with ticket IDs
      const ticketIds = response.data.tikets?.map((t: any) => t._id) || [response.data.tiket?._id]
      router.push(`/payment?tickets=${ticketIds.join(",")}`)
    } catch (error: any) {
      console.error("Booking error:", error)
      console.error("Error response:", error.response?.data)
      toast({
        title: "Booking Failed",
        description: error.response?.data?.error || "Failed to book tickets",
        variant: "destructive",
      })
    } finally {
      setBooking(false)
    }
  }

  const generateSeatGrid = () => {
    if (!availableSeats) return null

    const rows = ["A", "B", "C", "D", "E"]
    const seatsPerRow = 10
    const seatGrid = []

    for (const row of rows) {
      const rowSeats = []
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatNumber = `${row}${i}`
        // A seat is occupied if it's NOT in the available_seats array
        const isOccupied = !availableSeats.available_seats.includes(seatNumber)
        const isSelected = selectedSeats.includes(seatNumber)

        rowSeats.push(
          <SeatButton
            key={seatNumber}
            seatNumber={seatNumber}
            isSelected={isSelected}
            isOccupied={isOccupied}
            onClick={() => handleSeatClick(seatNumber)}
          />,
        )
      }
      seatGrid.push(
        <div key={row} className="flex justify-center gap-2 mb-2">
          {rowSeats}
        </div>,
      )
    }

    return seatGrid
  }

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return date
    }
  }

  const totalPrice = selectedSeats.length * (schedule?.harga || 0)
  const availableSeatsCount = availableSeats?.available_seats?.length || 0
  const totalSeatsCount = availableSeats?.total_seats || 50
  const occupiedSeatsCount = totalSeatsCount - availableSeatsCount

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Schedule Not Found</h1>
            <p className="text-muted-foreground">The requested schedule could not be found.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Movie Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{schedule.film_title || "Movie Title"}</span>
              </CardTitle>
              <CardDescription className="space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(schedule.tanggal)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {schedule.waktu}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {schedule.ruangan}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Seat Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Seats</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {availableSeatsCount} available • {occupiedSeatsCount} occupied • {totalSeatsCount} total
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Screen */}
              <div className="text-center">
                <div className="bg-gray-200 rounded-lg py-2 px-4 inline-block mb-4">
                  <span className="text-sm font-medium text-gray-600">SCREEN</span>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="space-y-2">
                {availableSeats ? (
                  generateSeatGrid()
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Unable to load seat layout</p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Occupied</span>
                </div>
              </div>

              {/* Debug info - remove this in production */}
              {availableSeats && (
                <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                  <p>Available seats: {availableSeats.available_seats.join(", ")}</p>
                  <p>Occupied seats: {availableSeats.occupied_seats.join(", ")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Summary */}
          {selectedSeats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Selected Seats:</span>
                  <span className="font-medium">{selectedSeats.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Quantity:</span>
                  <span className="font-medium">{selectedSeats.length} ticket(s)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Price per ticket:</span>
                  <PriceDisplay price={schedule.harga} />
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <PriceDisplay price={totalPrice} />
                  </div>
                </div>
                <Button onClick={handleBooking} disabled={booking} className="w-full" size="lg">
                  {booking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Book {selectedSeats.length} Ticket{selectedSeats.length > 1 ? "s" : ""}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
