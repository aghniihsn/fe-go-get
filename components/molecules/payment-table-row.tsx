import React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/atoms/status-badge"
import { PriceDisplay } from "@/components/atoms/price-display"
import { Eye, CheckCircle, XCircle } from "lucide-react"

interface PaymentTableRowProps {
  payment: any
  formatDateTime: (dateTime: string) => string
  onUpdateStatus: (paymentId: string, status: string) => void
}

export const PaymentTableRow: React.FC<PaymentTableRowProps> = ({ payment, formatDateTime, onUpdateStatus }) => (
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
              onClick={() => onUpdateStatus(payment.id, "paid")}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(payment.id, "failed")}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </TableCell>
  </TableRow>
)
