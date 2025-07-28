import React from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentTableRow } from "@/components/molecules/payment-table-row"

interface PaymentTableProps {
  payments: any[]
  formatDateTime: (dateTime: string) => string
  onUpdateStatus: (paymentId: string, status: string) => void
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ payments, formatDateTime, onUpdateStatus }) => (
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
      {payments.map((payment) => (
        <PaymentTableRow
          key={payment.id}
          payment={payment}
          formatDateTime={formatDateTime}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </TableBody>
  </Table>
)
