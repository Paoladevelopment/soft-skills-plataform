import { api } from "../../../config/api"
import { LoginResponse } from "../types/auth";

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

    return await response.json()
}