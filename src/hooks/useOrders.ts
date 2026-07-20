import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import type { PaginatedList, OrderDetail, CreateOrderPayload, EscrowLinkPayload, TimelineEntry } from "@/types"
import type { MerchantOrderResponse } from "@/types/merchant"

export function useMerchantOrders(merchantId: string, page: number = 1, pageSize: number = 10, statusFilter?: string) {
  return useQuery({
    queryKey: ["merchantOrders", merchantId, page, pageSize, statusFilter],
    queryFn: () =>
      api.get(`/merchants/${merchantId}/orders`, {
        params: { pageNumber: page, pageSize, statusFilter },
      }),
    select: (res: { data: PaginatedList<MerchantOrderResponse> }) => res.data,
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
    select: (res: { data: OrderDetail }) => res.data,
    enabled: !!orderId,
  })
}

export function useOrderTimeline(orderId: string) {
  return useQuery({
    queryKey: ["orderTimeline", orderId],
    queryFn: () => api.get(`/orders/${orderId}/timeline`),
    select: (res: { data: TimelineEntry[] }) => res.data,
    enabled: !!orderId,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOrderPayload) => api.post("/orders", data) as Promise<{ data: { orderId: string; orderReference?: string } }>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["merchantOrders"] }),
  })
}

export function useGenerateEscrowLink(orderId: string) {
  return useMutation({
    mutationFn: (data: EscrowLinkPayload) => api.post(`/orders/${orderId}/escrow-link`, data),
  })
}

export function useDeleteOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => api.delete(`/orders/${orderId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["merchantOrders"] }),
  })
}
