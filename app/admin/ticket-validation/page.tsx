"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AdminLayout } from "@/components/templates/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import {
  QrCode,
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  MapPin,
  Ticket,
  CameraOff,
  RefreshCw,
} from "lucide-react"

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span>
      case "used":
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">Used</span>
      case "waiting_for_payment":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Waiting Payment</span>
      case "cancelled":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Cancelled</span>
      default:
        return <span className="border px-2 py-1 rounded">{status}</span>
    }
  }

  const getValidationIcon = (valid: boolean) => {
    return valid ? <CheckCircle className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-500" />
  }

  return (
    <AdminLayout>
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

          {/* QR Scanner Tab */}
          <TabsContent value="scanner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="mr-2 h-5 w-5" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>Scan ticket QR codes using your camera or upload an image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera Controls */}
                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button onClick={startCamera} className="flex items-center">
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="outline" className="flex items-center bg-transparent">
                      <CameraOff className="mr-2 h-4 w-4" />
                      Stop Camera
                    </Button>
                  )}

                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Camera Error */}
                {cameraError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{cameraError}</AlertDescription>
                  </Alert>
                )}

                {/* Camera View */}
                {isScanning && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full max-w-md mx-auto rounded-lg border"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-white border-dashed rounded-lg w-48 h-48 flex items-center justify-center">
                        <div className="text-white text-center">
                          <QrCode className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Position QR code here</p>
                        </div>
                      </div>
                    </div>

                    {/* Detection Status */}
                    {detectedQR && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                        QR Detected!
                      </div>
                    )}
                  </div>
                )}

                {/* Detected QR Data */}
                {detectedQR && (
                  <Alert>
                    <QrCode className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Detected QR:</strong> {parseQRData(detectedQR)}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-6">
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
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
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
                    onClick={() => setScanHistory([])}
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
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getValidationIcon(result.valid)}
                            <span className="font-medium">{result.valid ? "Valid Ticket" : "Invalid Ticket"}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm mt-1">{result.message}</p>
                        {result.ticket && (
                          <div className="text-xs text-muted-foreground mt-2">
                            ID: {result.ticket._id} | {result.ticket.film_title}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Validation Result */}
        {validationResult && (
          <Card className={validationResult.valid ? "border-green-200" : "border-red-200"}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getValidationIcon(validationResult.valid)}
                <span className="ml-2">{validationResult.valid ? "Valid Ticket" : "Invalid Ticket"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={validationResult.valid ? "border-green-200" : "border-red-200"}>
                <AlertDescription>{validationResult.message}</AlertDescription>
              </Alert>

              {validationResult.valid && validationResult.ticket && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span className="font-medium">Customer:</span>
                        <span className="ml-2">{validationResult.ticket.user_name || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <Ticket className="mr-2 h-4 w-4" />
                        <span className="font-medium">Movie:</span>
                        <span className="ml-2">{validationResult.ticket.film_title || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span className="font-medium">Show Time:</span>
                        <span className="ml-2">
                          {validationResult.ticket.jadwal_tanggal && validationResult.ticket.jadwal_waktu
                            ? `${validationResult.ticket.jadwal_tanggal} ${validationResult.ticket.jadwal_waktu}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="font-medium">Studio:</span>
                        <span className="ml-2">{validationResult.ticket.jadwal_ruangan || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Seats:</span>
                        <span className="ml-2">{validationResult.ticket.kursi.join(", ")}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Status:</span>
                        <span className="ml-2">{getStatusBadge(validationResult.ticket.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Price:</span>
                      <span className="text-lg font-bold">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(validationResult.ticket.total_price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">Booking Date:</span>
                      <span>{formatDateTime(validationResult.ticket.booking_date)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
