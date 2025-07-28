import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  buttonText: React.ReactNode
}

export const DashboardActionCard: React.FC<DashboardActionCardProps> = ({ icon, title, description, href, buttonText }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">{icon}{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <Button asChild className="w-full">
        <Link href={href}>{buttonText}</Link>
      </Button>
    </CardContent>
  </Card>
)
