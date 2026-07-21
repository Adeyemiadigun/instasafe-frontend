import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { getApiErrorMessage } from "@/lib/errorHandler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BankResponse {
  name: string;
  code: string;
}

const completeProfileSchema = z.object({
  bvn: z.string().length(11, "BVN must be exactly 11 digits").regex(/^\d+$/, "BVN must contain only numbers"),
  nin: z.string().length(11, "NIN must be exactly 11 digits").regex(/^\d+$/, "NIN must contain only numbers").optional().or(z.literal("")),
  payoutBankAccount: z.string().length(10, "Account Number must be exactly 10 digits").regex(/^\d+$/, "Account Number must contain only numbers"),
  payoutBankCode: z.string().min(3, "Bank Code is required"),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export default function CompleteProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<BankResponse[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
  });

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await api.get("/merchants/banks");
        setBanks(res.data);
      } catch (err) {
        console.error("Failed to load banks:", err);
        toast.error("Failed to load bank list. Please try refreshing.");
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  const onSubmit = async (data: CompleteProfileFormData) => {
    setLoading(true);
    try {
      const payload = {
        bvn: data.bvn,
        nin: data.nin || null,
        payoutBankAccount: data.payoutBankAccount,
        payoutBankCode: data.payoutBankCode,
      };

      await api.post(`/merchants/${user?.userId}/complete-profile`, payload);
      toast.success("Profile completed successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-display)] tracking-tight">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We need a few more details to secure your account and set up your payouts.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identity Verification */}
          <div className="bg-card rounded-xl border border-border/50 p-6 space-y-5">
            <h2 className="text-base font-semibold text-foreground font-[family-name:var(--font-display)]">
              Identity Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bvn" className="text-sm font-medium">Bank Verification Number (BVN) *</Label>
                <Input id="bvn" placeholder="Enter 11-digit BVN" {...register("bvn")} className="h-10" />
                {errors.bvn && <p className="text-xs text-destructive">{errors.bvn.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nin" className="text-sm font-medium">National Identity Number (NIN)</Label>
                <Input id="nin" placeholder="Enter 11-digit NIN (Optional)" {...register("nin")} className="h-10" />
                {errors.nin && <p className="text-xs text-destructive">{errors.nin.message}</p>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your BVN is required to verify your identity before you can create orders.
            </p>
          </div>

          {/* Payout Information */}
          <div className="bg-card rounded-xl border border-border/50 p-6 space-y-5">
            <h2 className="text-base font-semibold text-foreground font-[family-name:var(--font-display)]">
              Payout Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="payoutBankAccount" className="text-sm font-medium">Account Number *</Label>
                <Input id="payoutBankAccount" placeholder="Enter 10-digit Account Number" {...register("payoutBankAccount")} className="h-10" />
                {errors.payoutBankAccount && <p className="text-xs text-destructive">{errors.payoutBankAccount.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="payoutBankCode" className="text-sm font-medium">Bank *</Label>
                <select
                  id="payoutBankCode"
                  {...register("payoutBankCode")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors hover:border-ring/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={loadingBanks}
                >
                  <option value="">Select a bank...</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
                {errors.payoutBankCode && <p className="text-xs text-destructive">{errors.payoutBankCode.message}</p>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This is where we will send your funds after an escrow transaction is completed successfully.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[200px]" disabled={loading}>
              {loading ? "Verifying Profile..." : "Complete Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
