"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/atoms/status-badge"
import { PriceDisplay } from "@/components/atoms/price-display"
import { api } from "@/lib/api"
import type { Payment } from "@/lib/types"
import { Search, Loader2, Eye, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

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

  return (
    <AdminLayout title="Payment Management">
      <div className="space-y-6">
        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <PriceDisplay price={getTotalRevenue()} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPayments.filter((p) => p.status === "paid").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPayments.filter((p) => p.status === "pending").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Payments</CardTitle>
                <CardDescription>Manage all payment transactions</CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-[250px]"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Movie</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-mono text-xs">#{(payment.id || payment._id)?.toString().slice(-8)}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {payment.user?.firstname && payment.user?.lastname
                                ? `${payment.user.firstname} ${payment.user.lastname}`
                                : payment.user?.username || "Unknown User"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.user?.email || "No email available"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div>{payment.ticket?.schedule?.film?.title || "Unknown Movie"}</div>
                            {payment.ticket?.schedule?.ruangan && (
                              <div className="text-sm text-muted-foreground">{payment.ticket.schedule.ruangan}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{payment.metode_pembayaran}</TableCell>
                        <TableCell>
                          <PriceDisplay price={payment.jumlah} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell>{formatDateTime(payment.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {payment.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(payment.id, "paid")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(payment.id, "failed")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isLoading && filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payments found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
