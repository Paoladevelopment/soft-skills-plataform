import useAuthStore from "../features/authentication/store/useAuthStore"
import camelcaseKeys from "camelcase-keys"

export type FetchError = Error & { 
  status?: number
  data?: unknown
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const token = useAuthStore.getState().accessToken

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.detail?.message || data?.error || "Something went wrong"
    const error = new Error(message) as FetchError

    error.status = response.status
    error.data = data
    
    throw error
  }

  return camelcaseKeys(data, { deep: true })
}