import { AuthResponse, LoginRequest } from "@/features/Auth/models/auth"
import { routes } from "@/shared/constants/routes"
import { useApiMutation } from "./use-api-mutation"

export function useLogin() {
  return useApiMutation<AuthResponse, LoginRequest>({
    route: routes.users.login,
    meta: {
      successMessage: "Login realizado com sucesso!",
    },
  })
}
