"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { api } from "@/lib/api"
import { DashboardStats } from "@/components/organisms/dashboard-stats"
import { DashboardActions } from "@/components/organisms/dashboard-actions"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalFilms: 0,
    totalTickets: 0,
    totalPayments: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentTickets: 0,
    totalSchedules: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [filmsRes, ticketsRes, paymentsRes, schedulesRes] = await Promise.all([
        api.get("/films").catch(() => ({ data: null })),
        api.get("/tikets").catch(() => ({ data: null })),
        api.get("/pembayarans").catch(() => ({ data: null })),
        api.get("/jadwals").catch(() => ({ data: null })),
      ])

      // Safely handle potentially null responses
      const films = Array.isArray(filmsRes.data) ? filmsRes.data : []
      const tickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : []
      const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : []
      const schedules = Array.isArray(schedulesRes.data) ? schedulesRes.data : []

      const totalRevenue = payments
        .filter((payment: any) => payment.status === "paid")
        .reduce((sum: number, payment: any) => sum + (payment.jumlah || 0), 0)

      const recentTickets = tickets.filter((ticket: any) => {
        if (!ticket.created_at) return false
        const ticketDate = new Date(ticket.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return ticketDate > weekAgo
      }).length

      setStats({
        totalFilms: films.length,
        totalTickets: tickets.length,
        totalPayments: payments.length,
        totalRevenue,
        totalUsers: 0, // You may need to create a users endpoint
        recentTickets,
        totalSchedules: schedules.length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Set default values on error
      setStats({
        totalFilms: 0,
        totalTickets: 0,
        totalPayments: 0,
        totalRevenue: 0,
        totalUsers: 0,
        recentTickets: 0,
        totalSchedules: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6 border">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Welcome to MovieTix Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your cinema operations efficiently. Monitor films, schedules, tickets, and payments all in one
              place.
            </p>
          </div>
        </div>
        <DashboardStats loading={loading} stats={stats} formatCurrency={formatCurrency} />
        <DashboardActions />
      </div>
    </AdminLayout>
  )
}
