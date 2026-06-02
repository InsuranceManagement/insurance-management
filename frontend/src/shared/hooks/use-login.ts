import { useMutation } from "@tanstack/react-query"

import { login } from "@/features/Auth/auth.service"

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
