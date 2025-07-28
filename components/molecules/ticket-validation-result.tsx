import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Ticket, Calendar, MapPin } from "lucide-react"
import { StatusBadge } from "@/components/atoms/status-badge"
import { ValidationIcon } from "@/components/atoms/validation-icon"

interface Ticket {
  _id: string
  user_id: string
  jadwal_id: string
  kursi: string[]
  status: string
  total_price: number
  booking_date: string
  film_title?: string
  jadwal_tanggal?: string
  jadwal_waktu?: string
  jadwal_ruangan?: string
  user_name?: string
}

interface TicketValidationResultProps {
  result: {
    valid: boolean
    ticket?: Ticket
    message: string
  }
}

function formatDateTime(dateTime: string) {
  try {
    return new Date(dateTime).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateTime
  }
}

export const TicketValidationResult: React.FC<TicketValidationResultProps> = ({ result }) => (
  <Card className={result.valid ? "border-green-200" : "border-red-200"}>
    <CardHeader>
      <CardTitle className="flex items-center">
        <ValidationIcon valid={result.valid} />
        <span className="ml-2">{result.valid ? "Valid Ticket" : "Invalid Ticket"}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Alert className={result.valid ? "border-green-200" : "border-red-200"}>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
      {result.valid && result.ticket && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium">Customer:</span>
                <span className="ml-2">{result.ticket.user_name || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Ticket className="mr-2 h-4 w-4" />
                <span className="font-medium">Movie:</span>
                <span className="ml-2">{result.ticket.film_title || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="font-medium">Show Time:</span>
                <span className="ml-2">
                  {result.ticket.jadwal_tanggal && result.ticket.jadwal_waktu
                    ? `${result.ticket.jadwal_tanggal} ${result.ticket.jadwal_waktu}`
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="font-medium">Studio:</span>
                <span className="ml-2">{result.ticket.jadwal_ruangan || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Seats:</span>
                <span className="ml-2">{result.ticket.kursi.join(", ")}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Status:</span>
                <span className="ml-2"><StatusBadge status={result.ticket.status} /></span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(result.ticket.total_price)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium">Booking Date:</span>
              <span>{formatDateTime(result.ticket.booking_date)}</span>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)
