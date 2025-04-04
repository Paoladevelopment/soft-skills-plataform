import { api } from "../../../config/api"
import { RegisterResponse, RegisterPayload } from "../types/register.api";

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await fetch(api.auth.register, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const errBody = await response.json()
        const message = errBody.detail.message
        throw new Error(message)
    }

    return await response.json()
}