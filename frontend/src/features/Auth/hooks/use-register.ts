import { AuthResponse, RegisterRequest } from "@/features/Auth/models/auth"
import { routes } from "../../../shared/constants/routes"
import { useApiMutation } from "../../../shared/hooks/use-api-mutation"

export function useRegister() {
  return useApiMutation<AuthResponse, RegisterRequest>({
    route: routes.users.create,
    meta: {
      successMessage: "Cadastro realizado com sucesso!",
    },
  })
}
