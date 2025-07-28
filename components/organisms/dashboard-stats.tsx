import React from "react"
import { DashboardStatCard } from "@/components/molecules/dashboard-stat-card"
import { Film, Ticket, TrendingUp, Calendar } from "lucide-react"

interface DashboardStatsProps {
  loading: boolean
  stats: {
    totalFilms: number
    totalTickets: number
    totalRevenue: number
    totalSchedules: number
    recentTickets: number
  }
  formatCurrency: (amount: number) => string
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ loading, stats, formatCurrency }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <DashboardStatCard
      title="Total Films"
      icon={<Film className="h-4 w-4 text-muted-foreground" />}
      value={loading ? "..." : stats.totalFilms}
      description="Active movies"
    />
    <DashboardStatCard
      title="Total Schedules"
      icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      value={loading ? "..." : stats.totalSchedules}
      description="Movie showtimes"
    />
    <DashboardStatCard
      title="Total Tickets"
      icon={<Ticket className="h-4 w-4 text-muted-foreground" />}
      value={loading ? "..." : stats.totalTickets}
      description={`+${stats.recentTickets} this week`}
    />
    <DashboardStatCard
      title="Total Revenue"
      icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      value={loading ? "..." : formatCurrency(stats.totalRevenue)}
      description="Paid transactions"
    />
  </div>
)
