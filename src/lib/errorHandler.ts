import axios from "axios"

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data
    if (data?.Message) return String(data.Message)
    if (data?.message) return String(data.message)
    if (Array.isArray(data?.errors) && data.errors.length > 0) return String(data.errors[0])
    if (err.response?.status === 401) return "Unauthorized. Please log in again."
    if (err.response?.status === 403) return "You don't have permission to do that."
    if (err.response?.status === 404) return "Resource not found."
    if (err.response?.status && err.response.status >= 500) return "Server error. Please try again later."
  }
  if (err instanceof Error) return err.message
  return "An unexpected error occurred."
}
