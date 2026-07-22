import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PackageCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "@/lib/axios";

// Retrieve the persistent device fingerprint
const getDeviceFingerprint = () => {
  return localStorage.getItem("instasafe_device_fp") || "";
};

export default function ScanDeliver() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleConfirmDelivery = () => {
    setStatus("loading");

    if (!orderId || !token) {
      setStatus("error");
      setMessage("Invalid scanning link. Missing order details.");
      return;
    }

    const sessionId = localStorage.getItem(`delivery_session_${orderId}`);
    if (!sessionId) {
      setStatus("error");
      setMessage("No active delivery session found on this device for this order. Did you scan the pickup QR code first?");
      return;
    }

    // Attempt to get location, but proceed even if denied
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => sendRequest(sessionId, position.coords.latitude, position.coords.longitude),
        (error) => sendRequest(sessionId, null, null), // user denied or error
        { timeout: 5000 }
      );
    } else {
      sendRequest(sessionId, null, null);
    }
  };

  const sendRequest = async (sessionId: string, lat: number | null, lng: number | null) => {
    try {
      const fingerprint = getDeviceFingerprint();
      
      await api.post(`/api/delivery-sessions/${orderId}/deliver`, {
        sessionId: sessionId,
        buyerQrToken: token,
        deviceFingerprint: fingerprint,
        latitude: lat,
        longitude: lng
      });

      // Clear the session from local storage since it's completed
      localStorage.removeItem(`delivery_session_${orderId}`);

      setStatus("success");
      setMessage("Delivery confirmed! The funds have been successfully released to the merchant.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.errors?.[0] || "Failed to confirm delivery. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">Confirm Delivery</CardTitle>
          <p className="text-sm text-slate-500">InstaSafe Escrow Delivery System</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6 text-center space-y-6">
          {status === "idle" && (
            <>
              <div className="bg-primary/10 p-4 rounded-full mb-2">
                <PackageCheck className="h-12 w-12 text-primary" />
              </div>
              <p className="text-slate-600">
                You are about to complete the delivery for Order <strong>{orderId?.substring(0, 8)}...</strong>
              </p>
              <div className="bg-slate-100 text-sm p-4 rounded-lg text-left text-slate-600">
                This will verify your device identity and release the escrow funds to the merchant.
              </div>
              <Button onClick={handleConfirmDelivery} className="w-full text-lg h-12">
                Complete Delivery
              </Button>
            </>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <p className="text-slate-600 font-medium">Verifying Custody & Releasing Funds...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
              <h3 className="text-xl font-bold text-slate-800">Delivery Complete</h3>
              <p className="text-slate-600">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
              <h3 className="text-xl font-bold text-slate-800">Verification Failed</h3>
              <p className="text-red-600">{message}</p>
              <Button variant="outline" onClick={() => setStatus("idle")} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
