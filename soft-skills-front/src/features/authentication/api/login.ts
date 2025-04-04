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

    if (!response.ok) {
        const errBody = await response.json()
        const message = errBody.detail.message
        throw new Error(message)
    }

    const rawData = await response.json()
    const camelData = camelcaseKeys(rawData, {deep: true})

    camelData.user.lastLogin = new Date(camelData.user.lastLogin)

    return camelData as LoginResponse
}