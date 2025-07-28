import React from "react"
import { ValidationIcon } from "@/components/atoms/validation-icon"

interface Ticket {
  _id?: string
  film_title?: string
}

interface ScanHistoryItemProps {
  result: {
    valid: boolean
    ticket?: Ticket
    message: string
    time?: string
  }
}

export const ScanHistoryItem: React.FC<ScanHistoryItemProps> = ({ result }) => (
  <div
    className={`p-3 rounded-lg border ${
      result.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <ValidationIcon valid={result.valid} />
        <span className="font-medium">{result.valid ? "Valid Ticket" : "Invalid Ticket"}</span>
      </div>
      <span className="text-sm text-muted-foreground">{result.time || new Date().toLocaleTimeString()}</span>
    </div>
    <p className="text-sm mt-1">{result.message}</p>
    {result.ticket && (
      <div className="text-xs text-muted-foreground mt-2">
        ID: {result.ticket._id} | {result.ticket.film_title}
      </div>
    )}
  </div>
)
