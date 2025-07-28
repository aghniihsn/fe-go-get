import React, { useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Camera, Upload, CameraOff } from "lucide-react"

interface TicketValidationScannerProps {
  isScanning: boolean
  cameraError: string | null
  detectedQR: string | null
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  fileInputRef: React.RefObject<HTMLInputElement>
  startCamera: () => void
  stopCamera: () => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  parseQRData: (data: string) => string
}

export const TicketValidationScanner: React.FC<TicketValidationScannerProps> = ({
  isScanning,
  cameraError,
  detectedQR,
  videoRef,
  canvasRef,
  fileInputRef,
  startCamera,
  stopCamera,
  handleFileUpload,
  parseQRData,
}) => (
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
)
