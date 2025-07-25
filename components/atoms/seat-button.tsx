"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SeatButtonProps {
  seatNumber: string
  isSelected: boolean
  isOccupied: boolean
  onClick: () => void
}

export function SeatButton({ seatNumber, isSelected, isOccupied, onClick }: SeatButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isOccupied}
      onClick={onClick}
      className={cn(
        "w-10 h-10 p-0 text-xs",
        isSelected && "bg-primary text-primary-foreground",
        isOccupied && "bg-red-100 text-red-800 cursor-not-allowed",
      )}
    >
      {seatNumber}
    </Button>
  )
}
