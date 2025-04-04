import { RegisterPayload } from "./register.api";
import { User } from "./user.store";

export interface AuthProps {
  defaultMode?: "login" | "register";
}

export interface IAuth {
  user: User | null
  isLoading: boolean
  accessToken: string | null
  tokenType: string | null
  error: string | null
  successMessage: string | null
  login: (username: string, password: string) => Promise<void>
  signUp: (userData: RegisterPayload) => Promise<void>
  logout: () => void
  isLoggedIn: () => boolean
}