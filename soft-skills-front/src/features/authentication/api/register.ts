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

    const data = await response.json()

    if (!response.ok) {
        const message = data?.detail?.message || "Oops! Something went wrong while signing you up"
        throw new Error(message)
    }

    return data
}