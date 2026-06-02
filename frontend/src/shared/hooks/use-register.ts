import { useMutation } from "@tanstack/react-query"

import { register } from "@/features/Auth/auth.service"

export function useRegister() {
  return useMutation({
    mutationFn: register,

    meta: {
      successMessage: "Cadastro realizado com sucesso!",
    },
  })
}
