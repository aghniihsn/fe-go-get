import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { ScanHistoryItem } from "@/components/molecules/scan-history-item"

interface TicketValidationHistoryProps {
  scanHistory: any[]
  onClear: () => void
}

export const TicketValidationHistory: React.FC<TicketValidationHistoryProps> = ({ scanHistory, onClear }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center">
          <RefreshCw className="mr-2 h-5 w-5" />
          Validation History
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={scanHistory.length === 0}
        >
          Clear History
        </Button>
      </CardTitle>
      <CardDescription>Recent ticket validation results</CardDescription>
    </CardHeader>
    <CardContent>
      {scanHistory.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No validation history yet</p>
      ) : (
        <div className="space-y-3">
          {scanHistory.map((result, index) => (
            <ScanHistoryItem key={index} result={result} />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
)
