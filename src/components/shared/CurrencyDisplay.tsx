import { formatCurrency } from "@/lib/utils"

export default function CurrencyDisplay({ amount }: { amount: number }) {
  return <span>{formatCurrency(amount)}</span>
}
