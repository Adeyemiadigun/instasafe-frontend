import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "@/lib/axios";

// Generate or retrieve a persistent device fingerprint
const getDeviceFingerprint = () => {
  let fp = localStorage.getItem("instasafe_device_fp");
  if (!fp) {
    fp = "fp_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem("instasafe_device_fp", fp);
  }
  return fp;
};

export default function ScanPickup() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleConfirmPickup = () => {
    setStatus("loading");

    if (!orderId || !token) {
      setStatus("error");
      setMessage("Invalid scanning link. Missing order details.");
      return;
    }

    // Attempt to get location, but proceed even if denied
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => sendRequest(position.coords.latitude, position.coords.longitude),
        (error) => sendRequest(null, null), // user denied or error
        { timeout: 5000 }
      );
    } else {
      sendRequest(null, null);
    }
  };

  const sendRequest = async (lat: number | null, lng: number | null) => {
    try {
      const fingerprint = getDeviceFingerprint();
      
      const response = await api.post(`/api/delivery-sessions/${orderId}/pickup`, {
        merchantQrToken: token,
        deviceFingerprint: fingerprint,
        latitude: lat,
        longitude: lng
      });

      // Save the session ID to local storage so we can use it for delivery
      if (response.data && response.data.id) {
        localStorage.setItem(`delivery_session_${orderId}`, response.data.id);
      }

      setStatus("success");
      setMessage("Pickup confirmed successfully! You can now proceed to the buyer.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.errors?.[0] || "Failed to confirm pickup. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">Confirm Pickup</CardTitle>
          <p className="text-sm text-slate-500">InstaSafe Escrow Delivery System</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6 text-center space-y-6">
          {status === "idle" && (
            <>
              <div className="bg-blue-50 p-4 rounded-full mb-2">
                <MapPin className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-slate-600">
                You are about to confirm pickup for Order <strong>{orderId?.substring(0, 8)}...</strong>
              </p>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-lg text-left">
                <strong>Important:</strong> Your current device will be securely linked to this delivery. You must use this exact same phone to confirm the final delivery to the buyer. Do not clear your browser cache.
              </div>
              <Button onClick={handleConfirmPickup} className="w-full text-lg h-12">
                Confirm Pickup
              </Button>
            </>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <p className="text-slate-600 font-medium">Securing Chain of Custody...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
              <h3 className="text-xl font-bold text-slate-800">Pickup Verified</h3>
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
