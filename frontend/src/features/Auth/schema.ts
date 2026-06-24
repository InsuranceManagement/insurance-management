import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
    "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
  )

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),

  password: z.string().min(1, "Informe sua senha"),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, "O nome deve possuir pelo menos 2 caracteres"),

  email: z.string().email("Informe um e-mail válido"),

  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,

    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas devem ser iguais",
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
