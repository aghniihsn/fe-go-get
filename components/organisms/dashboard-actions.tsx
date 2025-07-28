import React from "react"
import { DashboardActionCard } from "@/components/molecules/dashboard-action-card"
import { Film, Ticket, CreditCard, Plus, TrendingUp, Calendar } from "lucide-react"

export const DashboardActions: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <DashboardActionCard
      icon={<Film className="mr-2 h-5 w-5" />}
      title="Film Management"
      description="Add new movies and manage existing ones"
      href="/admin/films"
      buttonText={<><Plus className="mr-2 h-4 w-4" />Manage Films</>}
    />
    <DashboardActionCard
      icon={<Calendar className="mr-2 h-5 w-5" />}
      title="Schedule Management"
      description="Create and manage movie showtimes"
      href="/admin/schedules"
      buttonText={<><Plus className="mr-2 h-4 w-4" />Manage Schedules</>}
    />
    <DashboardActionCard
      icon={<Ticket className="mr-2 h-5 w-5" />}
      title="Ticket Management"
      description="View and manage all ticket bookings"
      href="/admin/tickets"
      buttonText={"View All Tickets"}
    />
    <DashboardActionCard
      icon={<CreditCard className="mr-2 h-5 w-5" />}
      title="Payment Management"
      description="Monitor payments and transactions"
      href="/admin/payments"
      buttonText={"View All Payments"}
    />
  </div>
)
