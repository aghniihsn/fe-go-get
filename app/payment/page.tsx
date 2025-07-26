"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/organisms/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PriceDisplay } from "@/components/atoms/price-display"
import { StatusBadge } from "@/components/atoms/status-badge"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { PaymentMethod } from "@/lib/types"
import { CreditCard, Loader2, Calendar, MapPin, Armchair, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface TicketSummary {
  tiket: {
    _id: string
    id?: string
    user_id: string
    jadwal_id?: string
    schedule_id?: string
    kursi: string | string[]
    status: string
    tanggal_pembelian?: string
    created_at: string
    updated_at: string
    total_price?: number
    schedule?: any
    payment_status?: string
  }
  // Alternative field name for backward compatibility
  ticket?: {
    _id: string
    id?: string
    user_id: string
    jadwal_id?: string
    schedule_id?: string
    kursi: string | string[]
    status: string
    tanggal_pembelian?: string
    created_at: string
    updated_at: string
    total_price?: number
    schedule?: any
    payment_status?: string
  }
  film_title: string
  film_poster: string
  jadwal_waktu: string
  jadwal_tanggal: string
  jadwal_ruangan: string
  harga_tiket: number
  status_pembayaran: string
  tanggal_pembayaran: string
}

interface GroupedTickets {
  jadwal_id: string
  film_title: string
  film_poster: string
  jadwal_waktu: string
  jadwal_tanggal: string
  jadwal_ruangan: string
  tickets: TicketSummary[]
  total_price: number
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [ticketSummaries, setTicketSummaries] = useState<TicketSummary[]>([])
  const [groupedTickets, setGroupedTickets] = useState<GroupedTickets[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // Wait for auth to load before proceeding
    if (authLoading) return

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to access payment page",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const ticketIds = searchParams.get("tickets")?.split(",") || []
    if (ticketIds.length > 0) {
      fetchTicketSummaries(ticketIds)
      fetchPaymentMethods()
    } else {
      router.push("/tickets")
    }
  }, [searchParams, router, user, authLoading])

  const fetchTicketSummaries = async (ticketIds: string[]) => {
    try {
      console.log("Fetching ticket summaries for IDs:", ticketIds)

      // Check authentication before making requests
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Fetch summaries with individual error handling
      const summaryPromises = ticketIds.map(async (id) => {
        try {
          console.log(`Fetching summary for ticket ${id}`)
          const response = await api.get(`/tikets/${id}/summary`)
          console.log(`Summary for ticket ${id}:`, response.data)
          return response.data
        } catch (error: any) {
          console.error(`Failed to fetch summary for ticket ${id}:`, error)

          // Handle specific error cases
          if (error.response?.status === 401) {
            console.error("Authentication failed - redirecting to login")
            router.push("/login")
            return null
          }

          if (error.response?.status === 403) {
            console.error("Access forbidden - user may not own this ticket")
            return null
          }

          // Try to get basic ticket info as fallback
          try {
            console.log(`Trying fallback for ticket ${id}`)
            const ticketResponse = await api.get(`/tikets/${id}`)
            const ticket = ticketResponse.data

            // Create a fallback summary structure
            return {
              tiket: ticket,
              film_title: ticket.schedule?.film?.title || "Unknown Movie",
              film_poster: ticket.schedule?.film?.poster_url || "/placeholder.svg?height=96&width=64",
              jadwal_waktu: ticket.schedule?.show_time
                ? new Date(ticket.schedule.show_time).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A",
              jadwal_tanggal: ticket.schedule?.show_time
                ? new Date(ticket.schedule.show_time).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              jadwal_ruangan: ticket.schedule?.studio || "N/A",
              harga_tiket: ticket.total_price || ticket.schedule?.price || 50000,
              status_pembayaran: ticket.payment_status || "pending",
              tanggal_pembayaran: ticket.updated_at || ticket.created_at,
            }
          } catch (fallbackError: any) {
            console.error(`Fallback failed for ticket ${id}:`, fallbackError)

            if (fallbackError.response?.status === 401) {
              router.push("/login")
            }

            return null
          }
        }
      })

      const summaryResults = await Promise.all(summaryPromises)
      const validSummaries = summaryResults.filter((summary): summary is TicketSummary => {
        if (!summary) return false

        // Check if it's an error response
        if ("error" in summary) {
          console.error("Summary contains error:", summary)
          return false
        }

        // Get the ticket data (handle both "tiket" and "ticket" field names)
        const ticketData = summary.tiket || summary.ticket

        // Validate required fields
        if (!ticketData) {
          console.error("Summary missing ticket data:", summary)
          return false
        }

        if (!ticketData.jadwal_id && !ticketData.schedule_id) {
          console.error("Summary missing jadwal_id:", summary)
          return false
        }

        return true
      })

      console.log("Valid ticket summaries:", validSummaries)

      if (validSummaries.length === 0) {
        throw new Error("No valid ticket summaries found. Please check if you have access to these tickets.")
      }

      setTicketSummaries(validSummaries)

      // Group tickets by jadwal_id
      const grouped = groupTicketsBySchedule(validSummaries)
      setGroupedTickets(grouped)
    } catch (error: any) {
      console.error("Error fetching ticket summaries:", error)

      let errorMessage = "Failed to load ticket information"

      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again."
        router.push("/login")
        return
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. You may not have permission to view these tickets."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      router.push("/tickets")
    } finally {
      setLoading(false)
    }
  }

  const groupTicketsBySchedule = (summaries: TicketSummary[]): GroupedTickets[] => {
    const groups: { [key: string]: GroupedTickets } = {}

    summaries.forEach((summary) => {
      // Get the ticket data (handle both "tiket" and "ticket" field names)
      const ticketData = summary.tiket || summary.ticket

      if (!ticketData) return

      // Handle different possible field names for schedule ID
      const jadwalId = ticketData.jadwal_id || ticketData.schedule_id || "unknown"

      if (!groups[jadwalId]) {
        groups[jadwalId] = {
          jadwal_id: jadwalId,
          film_title: summary.film_title || "Unknown Movie",
          film_poster: summary.film_poster || "/placeholder.svg?height=96&width=64",
          jadwal_waktu: summary.jadwal_waktu || "N/A",
          jadwal_tanggal: summary.jadwal_tanggal || new Date().toISOString().split("T")[0],
          jadwal_ruangan: summary.jadwal_ruangan || "N/A",
          tickets: [],
          total_price: 0,
        }
      }

      groups[jadwalId].tickets.push(summary)
      groups[jadwalId].total_price += summary.harga_tiket || 0
    })

    return Object.values(groups)
  }

  const fetchPaymentMethods = async () => {
    try {
      let methods = []
      try {
        const response = await api.get("/payment-methods")
        methods = response.data
      } catch (error) {
        console.log("Payment methods endpoint not available, using defaults")
        // Default payment methods
        methods = [
          {
            id: "bank_transfer",
            name: "Bank Transfer",
            description: "Transfer via ATM or Internet Banking",
            logo: "/placeholder.svg?height=32&width=32&text=Bank",
          },
          {
            id: "credit_card",
            name: "Credit Card",
            description: "Visa, Mastercard, or other credit cards",
            logo: "/placeholder.svg?height=32&width=32&text=Card",
          },
          {
            id: "e_wallet",
            name: "E-Wallet",
            description: "GoPay, OVO, DANA, or other e-wallets",
            logo: "/placeholder.svg?height=32&width=32&text=Wallet",
          },
        ]
      }

      setPaymentMethods(methods)
      if (methods.length > 0) {
        setSelectedMethod(methods[0].id)
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    }
  }

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make payment",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      })
      return
    }

    if (ticketSummaries.length === 0) {
      toast({
        title: "No Tickets",
        description: "No tickets available for payment",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Process payment for each ticket individually
      const paymentPromises = ticketSummaries.map((summary) => {
        const ticketData = summary.tiket || summary.ticket
        return api.post("/pembayarans", {
          tiket_id: ticketData?._id || ticketData?.id,
          user_id: user._id || user.id,
          metode_pembayaran: selectedMethod,
          jumlah: summary.harga_tiket,
        })
      })

      const paymentResults = await Promise.all(paymentPromises)
      console.log("Payment results:", paymentResults)

      toast({
        title: "Payment Successful",
        description: `Successfully processed payment for ${ticketSummaries.length} ticket(s)!`,
      })

      // Redirect to tickets page
      router.push("/tickets")
    } catch (error: any) {
      console.error("Payment error:", error)
      console.error("Payment error response:", error.response?.data)

      let errorMessage = "Failed to process payment"

      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again."
        router.push("/login")
        return
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

  const totalAmount = ticketSummaries.reduce((sum, summary) => sum + summary.harga_tiket, 0)

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  // Show login required if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="text-muted-foreground">Please login to access the payment page.</p>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    )
  }

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

  if (ticketSummaries.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="text-2xl font-bold">No Tickets Found</h1>
            <p className="text-muted-foreground">No tickets found for payment or you don't have access to them.</p>
            <Button onClick={() => router.push("/tickets")}>Go to My Tickets</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Complete Payment</h1>
            <p className="text-muted-foreground mt-2">Review your booking and complete the payment</p>
          </div>

          {/* Grouped Ticket Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>
                {ticketSummaries.length} ticket(s) for {groupedTickets.length} movie session(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {groupedTickets.map((group, groupIndex) => (
                <div key={group.jadwal_id} className="space-y-4">
                  {/* Movie Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-24 relative rounded-lg overflow-hidden">
                      <Image
                        src={group.film_poster || "/placeholder.svg?height=96&width=64"}
                        alt={group.film_title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{group.film_title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(group.jadwal_tanggal)} • {group.jadwal_waktu}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {group.jadwal_ruangan}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tickets in this group */}
                  <div className="ml-20 space-y-2">
                    {group.tickets.map((summary, ticketIndex) => {
                      const ticketData = summary.tiket || summary.ticket
                      return (
                        <div
                          key={ticketData?._id}
                          className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Armchair className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Seat {ticketData?.kursi}</span>
                            <StatusBadge status={summary.status_pembayaran} />
                          </div>
                          <PriceDisplay price={summary.harga_tiket} />
                        </div>
                      )
                    })}
                  </div>

                  {/* Group Total */}
                  <div className="ml-20 pt-2 border-t">
                    <div className="flex justify-between items-center font-medium">
                      <span>Subtotal ({group.tickets.length} tickets):</span>
                      <PriceDisplay price={group.total_price} />
                    </div>
                  </div>

                  {groupIndex < groupedTickets.length - 1 && <Separator className="my-4" />}
                </div>
              ))}

              {/* Grand Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <PriceDisplay price={totalAmount} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                      <div className="w-8 h-8 relative">
                        <Image
                          src={method.logo || "/placeholder.svg?height=32&width=32"}
                          alt={method.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Button */}
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handlePayment} disabled={processing} className="w-full" size="lg">
                {processing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                {processing
                  ? "Processing Payment..."
                  : `Pay ${new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(totalAmount)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
