import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, PackageSearch } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || "Unknown Order";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center justify-center space-x-2">
        <PackageSearch className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold tracking-tight text-slate-900">InstaSafe</span>
      </div>

      <Card className="max-w-md w-full text-center shadow-xl border-t-4 border-t-green-500">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Payment Secured!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            Your funds are now securely held in Escrow for Order <strong>#{reference}</strong>.
          </p>
          <div className="bg-slate-100 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-800 mb-2">Next Steps:</h3>
            <ul className="text-sm text-slate-600 space-y-2 text-left list-disc list-inside">
              <li>We have sent your Delivery QR Code to your Email and WhatsApp.</li>
              <li>Wait for the dispatcher to arrive with your item.</li>
              <li>Have the dispatcher scan your QR code with their phone camera to confirm you've received it.</li>
            </ul>
          </div>
          <p className="text-sm text-slate-500 italic mt-6">
            You can safely close this window.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
