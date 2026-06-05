import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/features/Auth/models/auth"

import { routes } from "@/shared/constants/routes"
import { useApiMutation } from "./use-api-mutation"

export function useForgotPassword() {
  return useApiMutation<ForgotPasswordResponse, ForgotPasswordRequest>({
    route: routes.users.forgotPassword,

    meta: {
      successMessage:
        "Se o email existir, enviaremos um link para redefinição.",
    },
  })
}
