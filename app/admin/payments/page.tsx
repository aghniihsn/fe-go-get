"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { api } from "@/lib/api"
import type { Payment } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PaymentStats } from "@/components/organisms/payment-stats"
import { PaymentFilters } from "@/components/molecules/payment-filters"
import { PaymentTable } from "@/components/organisms/payment-table"
import { PaymentEmpty } from "@/components/molecules/payment-empty"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter])

  const fetchUserById = async (userId: string): Promise<any> => {
    if (!userId || userId === "null" || userId === "undefined") {
      return null
    }

    try {
      // Try different possible endpoints for user data
      const endpoints = [`/users/${userId}`, `/auth/users/${userId}`, `/user/${userId}`]

      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint)
          if (response.data) {
            return response.data
          }
        } catch (error: any) {
          continue
        }
      }

      // If individual user fetch fails, try to get from all users
      try {
        const allUsersResponse = await api.get("/users")
        const users = Array.isArray(allUsersResponse.data) ? allUsersResponse.data : []
        const user = users.find((u: any) => u._id === userId)
        if (user) {
          return user
        }
      } catch (error) {
        // Silent fail
      }

      return null
    } catch (error) {
      return null
    }
  }

  const fetchPayments = async () => {
    try {
      setIsLoading(true)

      // 1. Fetch all payments
      const paymentsResponse = await api.get("/pembayarans")
      const paymentsData = Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []

      if (paymentsData.length === 0) {
        setPayments([])
        return
      }

      // 2. Fetch tickets, schedules, and films in parallel
      const [ticketsResponse, schedulesResponse, filmsResponse] = await Promise.all([
        api.get("/tikets").catch(() => ({ data: [] })),
        api.get("/jadwals").catch(() => ({ data: [] })),
        api.get("/films").catch(() => ({ data: [] })),
      ])

      const tickets = Array.isArray(ticketsResponse.data) ? ticketsResponse.data : []
      const schedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []
      const films = Array.isArray(filmsResponse.data) ? filmsResponse.data : []

      // 3. Create lookup maps
      const ticketsMap = tickets.reduce((acc: { [key: string]: any }, ticket: any) => {
        acc[ticket._id] = ticket
        return acc
      }, {})

      const schedulesMap = schedules.reduce((acc: { [key: string]: any }, schedule: any) => {
        acc[schedule._id] = schedule
        return acc
      }, {})

      const filmsMap = films.reduce((acc: { [key: string]: any }, film: any) => {
        acc[film._id] = film
        return acc
      }, {})

      // 4. Get unique user IDs from tickets
      const validTickets = paymentsData
        .map((payment: any) => ticketsMap[payment.tiket_id])
        .filter((ticket: any) => ticket)

      const uniqueUserIds = [
        ...new Set(
          validTickets
            .map((ticket: any) => ticket.user_id)
            .filter((userId: any) => userId && userId !== "null" && userId !== "undefined" && userId.trim() !== ""),
        ),
      ]

      // 5. Fetch users individually
      const usersData = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const user = await fetchUserById(userId)
          return { userId, user }
        }),
      )

      // 6. Create users map
      const usersMap = usersData.reduce((acc: { [key: string]: any }, { userId, user }) => {
        acc[userId] = user
        return acc
      }, {})

      // 7. Process payments and enrich with related data
      const processedPayments = paymentsData.map((payment: any) => {
        const ticketId = payment.tiket_id
        const ticket = ticketsMap[ticketId]
        const schedule = ticket ? schedulesMap[ticket.jadwal_id] : null
        const film = schedule ? filmsMap[schedule.film_id] : null
        const user = ticket ? usersMap[ticket.user_id] : null

        return {
          ...payment,
          id: payment.id || payment._id,
          user: user,
          ticket: {
            ...ticket,
            schedule: {
              ...schedule,
              film: film || schedule?.film,
            },
          },
        }
      })

      setPayments(processedPayments)
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      })
      setPayments([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterPayments = () => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.metode_pembayaran?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.ticket?.schedule?.film?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }

  const handleUpdateStatus = async (paymentId: string, status: string) => {
    try {
      await api.put(`/pembayarans/${paymentId}`, { status })
      toast({
        title: "Success",
        description: `Payment status updated to ${status}`,
      })
      fetchPayments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalRevenue = () => {
    return filteredPayments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + payment.jumlah, 0)
  }

  const paidCount = filteredPayments.filter((p) => p.status === "paid").length
  const pendingCount = filteredPayments.filter((p) => p.status === "pending").length
  const totalRevenue = getTotalRevenue()

  return (
    <AdminLayout title="Payment Management">
      <div className="space-y-6">
        <PaymentStats totalRevenue={totalRevenue} paidCount={paidCount} pendingCount={pendingCount} />
        <PaymentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <PaymentEmpty />
        ) : (
          <div className="overflow-x-auto">
            <PaymentTable
              payments={filteredPayments}
              formatDateTime={formatDateTime}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
