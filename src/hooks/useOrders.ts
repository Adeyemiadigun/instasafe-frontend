import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import type { ApiResult, PaginatedList, OrderDetail, CreateOrderPayload, EscrowLinkPayload, TimelineEntry } from "@/types"
import type { MerchantOrderResponse } from "@/types/merchant"
import { toast } from "sonner"

export function useMerchantOrders(merchantId: string, page: number = 1, pageSize: number = 10, statusFilter?: string) {
  return useQuery({
    queryKey: ["merchantOrders", merchantId, page, pageSize, statusFilter],
    queryFn: () =>
      api.get(`/merchants/${merchantId}/orders`, {
        params: { pageNumber: page, pageSize, statusFilter },
      }),
    select: (res: { data: ApiResult<PaginatedList<MerchantOrderResponse>> }) => res.data.data,
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
    select: (res: { data: ApiResult<OrderDetail> }) => res.data.data,
    enabled: !!orderId,
  })
}

export function useOrderTimeline(orderId: string) {
  return useQuery({
    queryKey: ["orderTimeline", orderId],
    queryFn: () => api.get(`/orders/${orderId}/timeline`),
    select: (res: { data: ApiResult<TimelineEntry[]> }) => res.data.data,
    enabled: !!orderId,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOrderPayload) => api.post("/orders", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["merchantOrders"] }),
  })
}

export function useGenerateEscrowLink(orderId: string) {
  return useMutation({
    mutationFn: (data: EscrowLinkPayload) => api.post(`/orders/${orderId}/escrow-link`, data),
  })
}
