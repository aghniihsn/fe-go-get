"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../components/atoms/Button"

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { nama, jumlah, totalHarga } = location.state || {}
  const [showSuccess, setShowSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handlePayment = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setShowSuccess(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-600 mt-1">Complete your ticket purchase</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="text-gray-900">{nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets:</span>
                  <span className="text-gray-900">{jumlah}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-semibold text-gray-900">Rp {totalHarga?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-gray-900 rounded-lg p-3 text-center cursor-pointer">
                  <div className="text-sm font-medium">Credit Card</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-gray-300">
                  <div className="text-sm font-medium">Bank Transfer</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-gray-300">
                  <div className="text-sm font-medium">E-Wallet</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handlePayment} className="flex-1" disabled={processing}>
                {processing ? "Processing..." : "Pay Now"}
              </Button>
              <Button onClick={() => navigate(-1)} variant="secondary">
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your tickets have been booked successfully.</p>
              <Button onClick={() => navigate("/pesanan")} className="w-full">
                View Tickets
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentPage
