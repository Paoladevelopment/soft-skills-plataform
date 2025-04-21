import useAuthStore from "../features/authentication/store/useAuthStore"
import camelcaseKeys from "camelcase-keys"

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
    const message = data?.detail?.message || "Something went wrong"
    throw new Error(message)
  }

  return camelcaseKeys(data, { deep: true })
}