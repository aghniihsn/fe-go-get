import React from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface ValidationIconProps {
  valid: boolean
}

export const ValidationIcon: React.FC<ValidationIconProps> = ({ valid }) => {
  return valid ? (
    <CheckCircle className="h-8 w-8 text-green-500" />
  ) : (
    <XCircle className="h-8 w-8 text-red-500" />
  )
}
