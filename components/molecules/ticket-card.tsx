import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/atoms/status-badge"
import { PriceDisplay } from "@/components/atoms/price-display"
import type { Ticket } from "@/lib/types"
import { Calendar, MapPin, Armchair } from "lucide-react"

interface TicketCardProps {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{ticket.schedule?.film?.title || "Movie Title"}</CardTitle>
          <StatusBadge status={ticket.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {ticket.schedule?.show_time && formatDateTime(ticket.schedule.show_time)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          Studio {ticket.schedule?.studio}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Armchair className="w-4 h-4 mr-2" />
          Seats: {ticket.kursi.join(", ")}
        </div>
        <div className="pt-2 border-t">
          <PriceDisplay price={ticket.total_price} className="text-lg font-bold text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
