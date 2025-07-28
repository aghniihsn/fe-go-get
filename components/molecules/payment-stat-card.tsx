import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface PaymentStatCardProps {
  title: string
  value: React.ReactNode
}

export const PaymentStatCard: React.FC<PaymentStatCardProps> = ({ title, value }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)
