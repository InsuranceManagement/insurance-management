import { routes } from "@/shared/constants/routes"
import { apiClient } from "@/shared/lib/api-client"

import {
  RegisterRequest,
  type AuthResponse,
  type LoginRequest,
} from "./models/auth"

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse, LoginRequest>({
    route: routes.users.login,
    body: data,
  })
}

export async function register(data: RegisterRequest) {
  return apiClient({
    route: routes.users.create,
    body: data,
  })
}
