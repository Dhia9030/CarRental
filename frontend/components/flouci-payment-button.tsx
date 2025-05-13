/**
 * Flouci Payment Button Component
 *
 * IMPORTANT: This component currently simulates payment processing.
 *
 * When implementing with a real API:
 * 1. Replace the simulated payment processing with real Flouci API calls
 * 2. Handle real payment responses and errors
 * 3. Implement proper security measures for payment processing
 * 4. Update the UI based on real payment statuses
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"

interface FlouciPaymentButtonProps {
  amount: number
  carId: string
  onPaymentComplete?: (paymentId: string) => void
}

export function FlouciPaymentButton({ amount, carId, onPaymentComplete }: FlouciPaymentButtonProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [paymentId, setPaymentId] = useState<string>("")

  const handlePayment = () => {
    setPaymentStatus("processing")

    // REPLACE THIS: In production, this will make a real API call to Flouci
    // Example:
    // const response = await fetch('/api/payments/process', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount, carId })
    // });
    // const data = await response.json();
    // setPaymentId(data.paymentId);
    // setPaymentStatus(data.status === 'success' ? 'success' : 'error');

    // Simulate Flouci API payment processing
    setTimeout(() => {
      // Generate a mock payment ID
      const mockPaymentId = "FL-" + Math.floor(Math.random() * 1000000000).toString()
      setPaymentId(mockPaymentId)
      setPaymentStatus("success")

      // Call the callback if provided
      if (onPaymentComplete) {
        onPaymentComplete(mockPaymentId)
      }
    }, 2000)
  }

  return (
    <>
      <Button className="w-full bg-sky-600 hover:bg-sky-700" onClick={() => setIsPaymentOpen(true)}>
        <CreditCard className="mr-2 h-4 w-4" />
        Book Now
      </Button>

      <Dialog
        open={isPaymentOpen}
        onOpenChange={(open) => {
          if (!open && paymentStatus !== "processing") {
            setIsPaymentOpen(false)
            // Reset payment status when dialog is closed
            if (paymentStatus !== "success") {
              setPaymentStatus("idle")
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Flouci Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {paymentStatus === "idle" && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-medium">Payment Amount</p>
                      <p className="text-sm text-slate-500">Car rental fee</p>
                    </div>
                    <p className="text-xl font-bold">${amount}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Card Number</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="4242 4242 4242 4242"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Name on Card</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="John Smith" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Expiry Date</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">CVC</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-md p-3 text-sm">
                  <p className="font-medium text-sky-800">Payment Process:</p>
                  <ol className="list-decimal ml-5 text-sky-700 space-y-1 mt-1">
                    <li>Your payment will be processed via Flouci</li>
                    <li>Booking will be in "Pending" status until agency confirms</li>
                    <li>If rejected, your payment will be automatically refunded</li>
                  </ol>
                </div>

                <Button className="w-full bg-sky-600 hover:bg-sky-700" onClick={handlePayment}>
                  Pay ${amount}
                </Button>

                <div className="text-center text-xs text-slate-500">
                  <p>Secured by Flouci Payment Gateway</p>
                  <p>Your card information is encrypted and secure</p>
                </div>
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium">Processing Payment</p>
                <p className="text-sm text-slate-500">Please wait while we process your payment...</p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium">Payment Successful!</p>
                <p className="text-sm text-slate-500 text-center mb-2">Your payment has been processed successfully.</p>
                <p className="text-sm font-medium text-center mb-4">Payment ID: {paymentId}</p>
                <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm mb-4 max-w-xs">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800">
                      Your booking is now <span className="font-bold">pending approval</span> from the agency. You'll be
                      notified once it's confirmed.
                    </p>
                  </div>
                </div>
                <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => setIsPaymentOpen(false)}>
                  Done
                </Button>
              </div>
            )}

            {paymentStatus === "error" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-lg font-medium">Payment Failed</p>
                <p className="text-sm text-slate-500 text-center mb-4">
                  There was an issue processing your payment. Please try again.
                </p>
                <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => setPaymentStatus("idle")}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
