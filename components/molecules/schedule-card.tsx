import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/atoms/price-display"
import type { Schedule } from "@/lib/types"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"

interface ScheduleCardProps {
  schedule: Schedule
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return date
    }
  }

  const formatDateTime = () => {
    if (schedule.tanggal && schedule.waktu) {
      return `${formatDate(schedule.tanggal)} - ${schedule.waktu}`
    }
    return "N/A"
  }

  const getStudioName = () => {
    return schedule.ruangan || "Unknown Studio"
  }

  const getPrice = () => {
    return schedule.harga || schedule.price || 0
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{getStudioName()}</span>
          <PriceDisplay price={getPrice()} className="text-primary font-bold" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDateTime()}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          {getStudioName()}
        </div>
        <Button asChild className="w-full">
          <Link href={`/booking/${schedule._id}`}>Book Now</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
