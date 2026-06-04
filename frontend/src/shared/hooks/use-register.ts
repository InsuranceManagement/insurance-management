import { AuthResponse, RegisterRequest } from "@/features/Auth/models/auth"
import { routes } from "../constants/routes"
import { useApiMutation } from "./use-api-mutation"

export function useRegister() {
  return useApiMutation<AuthResponse, RegisterRequest>({
    route: routes.users.create,
    meta: {
      successMessage: "Cadastro realizado com sucesso!",
    },
  })
}
