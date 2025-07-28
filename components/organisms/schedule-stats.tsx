import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

interface ScheduleStatsProps {
  totalSchedules: number
  todaySchedules: number
  upcomingSchedules: number
}

export const ScheduleStats: React.FC<ScheduleStatsProps> = ({ totalSchedules, todaySchedules, upcomingSchedules }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Total Schedules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalSchedules}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Today's Shows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{todaySchedules}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Upcoming Shows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{upcomingSchedules}</div>
      </CardContent>
    </Card>
  </div>
)
