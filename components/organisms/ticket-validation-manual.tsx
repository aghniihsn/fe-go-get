import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Ticket } from "lucide-react"

interface TicketValidationManualProps {
  manualTicketId: string
  setManualTicketId: (id: string) => void
  loading: boolean
  handleManualValidation: () => void
}

export const TicketValidationManual: React.FC<TicketValidationManualProps> = ({
  manualTicketId,
  setManualTicketId,
  loading,
  handleManualValidation,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Ticket className="mr-2 h-5 w-5" />
        Manual Ticket Validation
      </CardTitle>
      <CardDescription>Enter ticket ID manually for validation</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ticketId">Ticket ID</Label>
        <div className="flex gap-2">
          <Input
            id="ticketId"
            placeholder="Enter ticket ID..."
            value={manualTicketId}
            onChange={(e) => setManualTicketId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleManualValidation()}
          />
          <Button onClick={handleManualValidation} disabled={loading || !manualTicketId.trim()}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Validate
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)
