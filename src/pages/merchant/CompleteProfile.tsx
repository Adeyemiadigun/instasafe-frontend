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
import { ShieldCheck, Landmark, CheckCircle } from "lucide-react";

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
      // Force a reload to refresh auth state and redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Complete Your Profile</h1>
            <p className="text-slate-500 text-lg">
              We need a few more details to secure your account and set up your payouts.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center mb-6">
                <ShieldCheck className="h-5 w-5 mr-2 text-indigo-600" />
                Identity Verification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bvn" className="text-slate-700 font-medium">Bank Verification Number (BVN) *</Label>
                  <Input 
                    id="bvn" 
                    placeholder="Enter 11-digit BVN" 
                    {...register("bvn")} 
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.bvn && <p className="text-sm text-destructive">{errors.bvn.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nin" className="text-slate-700 font-medium">National Identity Number (NIN)</Label>
                  <Input 
                    id="nin" 
                    placeholder="Enter 11-digit NIN (Optional)" 
                    {...register("nin")} 
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.nin && <p className="text-sm text-destructive">{errors.nin.message}</p>}
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Your BVN is required to verify your identity before you can create orders.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center mb-6">
                <Landmark className="h-5 w-5 mr-2 text-indigo-600" />
                Payout Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="payoutBankAccount" className="text-slate-700 font-medium">Account Number *</Label>
                  <Input 
                    id="payoutBankAccount" 
                    placeholder="Enter 10-digit Account Number" 
                    {...register("payoutBankAccount")} 
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.payoutBankAccount && <p className="text-sm text-destructive">{errors.payoutBankAccount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutBankCode" className="text-slate-700 font-medium">Bank *</Label>
                  <select 
                    id="payoutBankCode" 
                    {...register("payoutBankCode")} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loadingBanks}
                  >
                    <option value="">Select a bank...</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  {errors.payoutBankCode && <p className="text-sm text-destructive">{errors.payoutBankCode.message}</p>}
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                This is where we will send your funds after an escrow transaction is completed successfully.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[200px]" disabled={loading}>
                {loading ? "Verifying Profile..." : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Complete Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
