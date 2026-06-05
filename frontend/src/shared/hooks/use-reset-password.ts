import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/features/Auth/models/auth"

import { routes } from "@/shared/constants/routes"
import { useApiMutation } from "./use-api-mutation"

export function useResetPassword() {
  return useApiMutation<ResetPasswordResponse, ResetPasswordRequest>({
    route: routes.users.resetPassword,

    meta: {
      successMessage: "Senha redefinida com sucesso.",
    },
  })
}
