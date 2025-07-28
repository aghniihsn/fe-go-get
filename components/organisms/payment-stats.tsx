import React from "react"
import { PaymentStatCard } from "@/components/molecules/payment-stat-card"
import { PriceDisplay } from "@/components/atoms/price-display"

interface PaymentStatsProps {
  totalRevenue: number
  paidCount: number
  pendingCount: number
}

export const PaymentStats: React.FC<PaymentStatsProps> = ({ totalRevenue, paidCount, pendingCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <PaymentStatCard title="Total Revenue" value={<PriceDisplay price={totalRevenue} />} />
    <PaymentStatCard title="Paid Payments" value={paidCount} />
    <PaymentStatCard title="Pending Payments" value={pendingCount} />
  </div>
)
