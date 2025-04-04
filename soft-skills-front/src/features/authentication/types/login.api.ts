import { User } from "./user.store";

export interface LoginResponse {
  user: User
  accessToken: string
  tokenType: string
  refreshToken?: string
}