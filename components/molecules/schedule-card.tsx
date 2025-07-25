import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/atoms/price-display"
import type { Schedule } from "@/lib/types"
import { Calendar, Users } from "lucide-react"
import Link from "next/link"

interface ScheduleCardProps {
  schedule: Schedule
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
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
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Studio {schedule.studio}</span>
          <PriceDisplay price={schedule.price} className="text-primary font-bold" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDateTime(schedule.show_time)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          {schedule.available_seats?.length || 0} seats available
        </div>
        <Button asChild className="w-full">
          <Link href={`/booking/${schedule.id}`}>Book Now</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
