"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketValidationScanner } from "@/components/organisms/ticket-validation-scanner"
import { TicketValidationManual } from "@/components/organisms/ticket-validation-manual"
import { TicketValidationHistory } from "@/components/organisms/ticket-validation-history"
import { TicketValidationResult } from "@/components/molecules/ticket-validation-result"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"


// Import jsQR for QR code scanning
import jsQR from "jsqr"

interface TicketValidationResult {
  valid: boolean
  ticket?: {
    _id: string
    user_id: string
    jadwal_id: string
    kursi: string[]
    status: string
    total_price: number
    booking_date: string
    film_title?: string
    jadwal_tanggal?: string
    jadwal_waktu?: string
    jadwal_ruangan?: string
    user_name?: string
  }
  message: string
}

export default function TicketValidationPage() {
  const [validationResult, setValidationResult] = useState<TicketValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [manualTicketId, setManualTicketId] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [detectedQR, setDetectedQR] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<TicketValidationResult[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const validateTicket = async (ticketId: string) => {
    if (!ticketId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a ticket ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/tikets/validate", { ticket_id: ticketId.trim() })
      const result: TicketValidationResult = response.data

      setValidationResult(result)

      // Add to scan history
      setScanHistory((prev) => [result, ...prev.slice(0, 9)]) // Keep last 10 scans

      if (result.valid) {
        toast({
          title: "Valid Ticket",
          description: result.message,
        })
      } else {
        toast({
          title: "Invalid Ticket",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Validation error:", error)
      const errorMessage = error.response?.data?.message || "Failed to validate ticket"

      const errorResult: TicketValidationResult = {
        valid: false,
        message: errorMessage,
      }

      setValidationResult(errorResult)
      setScanHistory((prev) => [errorResult, ...prev.slice(0, 9)])

      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleManualValidation = () => {
    validateTicket(manualTicketId)
  }

  const startCamera = async () => {
    try {
      setCameraError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start scanning after video is ready
        videoRef.current.onloadedmetadata = () => {
          startQRScanning()
        }
      }
    } catch (error: any) {
      console.error("Camera error:", error)
      setCameraError("Unable to access camera. Please check permissions.")
      setIsScanning(false)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    setIsScanning(false)
    setDetectedQR(null)
    setCameraError(null)
  }

  const startQRScanning = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    scanIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          setDetectedQR(code.data)
          console.log("QR Code detected:", code.data)

          // Auto-validate detected QR code
          validateTicket(code.data)

          // Stop scanning after successful detection
          setTimeout(() => {
            stopCamera()
          }, 1000)
        }
      }
    }, 100) // Scan every 100ms
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          console.log("QR Code detected from image:", code.data)
          setDetectedQR(code.data)
          validateTicket(code.data)
          toast({
            title: "QR Code Detected",
            description: "Processing ticket validation...",
          })
        } else {
          toast({
            title: "No QR Code Found",
            description: "Please upload an image containing a QR code",
            variant: "destructive",
          })
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // Reset file input
    event.target.value = ""
  }

  const parseQRData = (data: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(data)
      return parsed.ticketId || parsed.id || data
    } catch {
      // If not JSON, check if it's a URL
      try {
        const url = new URL(data)
        const ticketId = url.searchParams.get("ticket") || url.pathname.split("/").pop()
        return ticketId || data
      } catch {
        // If not URL, return as is (probably direct ticket ID)
        return data
      }
    }
  }

  const formatDateTime = (dateTime: string) => {
    try {
      return new Date(dateTime).toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateTime
    }
  }

  // StatusBadge and ValidationIcon are now atoms

  return (
    <AdminLayout title="Ticket Validation">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Validation</h1>
          <p className="text-muted-foreground">Validate movie tickets using QR codes or manual entry</p>
        </div>
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
          </TabsList>
          <TabsContent value="scanner" className="space-y-6">
            <TicketValidationScanner
              isScanning={isScanning}
              cameraError={cameraError}
              detectedQR={detectedQR}
              videoRef={videoRef}
              canvasRef={canvasRef}
              fileInputRef={fileInputRef}
              startCamera={startCamera}
              stopCamera={stopCamera}
              handleFileUpload={handleFileUpload}
              parseQRData={parseQRData}
            />
          </TabsContent>
          <TabsContent value="manual" className="space-y-6">
            <TicketValidationManual
              manualTicketId={manualTicketId}
              setManualTicketId={setManualTicketId}
              loading={loading}
              handleManualValidation={handleManualValidation}
            />
          </TabsContent>
          <TabsContent value="history" className="space-y-6">
            <TicketValidationHistory
              scanHistory={scanHistory}
              onClear={() => setScanHistory([])}
            />
          </TabsContent>
        </Tabs>
        {validationResult && <TicketValidationResult result={validationResult} />}
      </div>
    </AdminLayout>
  )
}
