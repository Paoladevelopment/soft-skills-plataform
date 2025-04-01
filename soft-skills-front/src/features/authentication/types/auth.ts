import { User } from "./user";

export interface AuthProps {
  defaultMode?: "login" | "register";
}

export interface LoginResponse {
  user: User
  accessToken: string
  tokenType: string
  refreshToken?: string
}


export interface IAuth {
  user: User | null
  isLoading: boolean
  accessToken: string | null
  tokenType: string | null
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoggedIn: () => boolean
}