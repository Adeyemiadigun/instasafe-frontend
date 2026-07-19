import { useMutation, useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { DeliverySessionStatus } from "@/types/delivery"

export function useGenerateQrCodes(orderId: string) {
  return useMutation({
    mutationFn: () => api.post(`/delivery-sessions/${orderId}/qr-codes`),
  })
}

export function useCreatePickup(orderId: string) {
  return useMutation({
    mutationFn: (data: { merchantQrToken: string; deviceFingerprint: string; latitude?: number; longitude?: number }) =>
      api.post(`/delivery-sessions/${orderId}/pickup`, data),
  })
}

export function useConfirmDelivery(orderId: string) {
  return useMutation({
    mutationFn: (data: { sessionId: string; buyerQrToken: string; deviceFingerprint: string; latitude?: number; longitude?: number }) =>
      api.post(`/delivery-sessions/${orderId}/deliver`, data),
  })
}

export function useDeliverySessionStatus(sessionId: string) {
  return useQuery({
    queryKey: ["deliverySession", sessionId],
    queryFn: () => api.get(`/delivery-sessions/sessions/${sessionId}`),
    select: (res: { data: DeliverySessionStatus }) => res.data,
    enabled: !!sessionId,
  })
}
