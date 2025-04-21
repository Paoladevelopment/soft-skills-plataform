import { api } from "../../../config/api"
import { LoginResponse } from "../types/login.api";
import camelcaseKeys from 'camelcase-keys';

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)

    const response = await fetch(api.auth.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData
    })

    const data = await response.json()

    if (!response.ok) {
        const message = data?.detail?.message || "Invalid credentials. Please try again."
        throw new Error(message)
    }

    const camelData = camelcaseKeys(data, {deep: true})

    camelData.user.lastLogin = new Date(camelData.user.lastLogin)

    return camelData as LoginResponse
}