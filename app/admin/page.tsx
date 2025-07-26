"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Film, Ticket, CreditCard, Plus, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Films</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalFilms}</div>
              <p className="text-xs text-muted-foreground">Active movies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalSchedules}</div>
              <p className="text-xs text-muted-foreground">Movie showtimes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalTickets}</div>
              <p className="text-xs text-muted-foreground">+{stats.recentTickets} this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Paid transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Film className="mr-2 h-5 w-5" />
                Film Management
              </CardTitle>
              <CardDescription>Add new movies and manage existing ones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/films">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Films
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Management
              </CardTitle>
              <CardDescription>Create and manage movie showtimes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/schedules">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Schedules
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="mr-2 h-5 w-5" />
                Ticket Management
              </CardTitle>
              <CardDescription>View and manage all ticket bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/tickets">View All Tickets</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Management
              </CardTitle>
              <CardDescription>Monitor payments and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/payments">View All Payments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
