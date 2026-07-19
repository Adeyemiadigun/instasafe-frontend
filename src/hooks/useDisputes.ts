import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import type { ApiResult } from "@/types"
import type { Dispute, RaiseDisputePayload, ResolveDisputePayload } from "@/types/dispute"

export function useDispute(disputeId: string) {
  return useQuery({
    queryKey: ["dispute", disputeId],
    queryFn: () => api.get(`/disputes/${disputeId}`),
    select: (res: { data: ApiResult<Dispute> }) => res.data.data,
    enabled: !!disputeId,
  })
}

export function useOrderDispute(orderId: string) {
  return useQuery({
    queryKey: ["orderDispute", orderId],
    queryFn: () => api.get(`/disputes/order/${orderId}`),
    select: (res: { data: ApiResult<Dispute | null> }) => res.data.data,
    enabled: !!orderId,
  })
}

export function useRaiseDispute() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RaiseDisputePayload) => api.post("/disputes", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disputes"] }),
  })
}

export function useResolveDispute(disputeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ResolveDisputePayload) => api.put(`/disputes/${disputeId}/resolve`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["disputes"] })
      qc.invalidateQueries({ queryKey: ["dispute", disputeId] })
    },
  })
}

export function useExecutePayout(orderId: string) {
  return useMutation({
    mutationFn: () => api.post(`/disputes/order/${orderId}/payout`),
  })
}
