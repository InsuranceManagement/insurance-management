"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { useResetPassword } from "@/shared/hooks/use-reset-password"
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schema"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Typography } from "@/shared/components/ui/typography"

type ResetPasswordFormProps = {
  onSuccess: () => void
}

export default function ResetPasswordForm({
  onSuccess,
}: ResetPasswordFormProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const resetPasswordMutation = useResetPassword()
  const [success, setSuccess] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  if (!token) {
    return (
      <Box className="flex-col items-center gap-4 py-6 text-center">
        <Box className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </Box>

        <Typography className="text-lg font-medium">
          Link inválido ou expirado
        </Typography>

        <Typography
          variant="small"
          className="text-muted-foreground"
        >
          Esse link de redefinição de senha não é mais válido. Ele pode ter
          expirado ou já ter sido utilizado.
        </Typography>

        <Button
          asChild
          className="
            w-full
            border-0
            text-white
            bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)]
          "
        >
          <Link href="/forgot-password">Gerar novo link</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full"
        >
          <Link href="/login">Voltar para login</Link>
        </Button>
      </Box>
    )
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    await resetPasswordMutation.mutateAsync({
      body: {
        token,
        password: values.password,
      },
    })

    setSuccess(true)
    onSuccess()
  })

  if (success) {
    return (
      <Box className="flex-col items-center gap-4 py-6 text-center">
        <Box className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </Box>

        <Typography>Sua senha foi redefinida com sucesso.</Typography>

        <Typography
          variant="small"
          className="text-muted-foreground"
        >
          Agora você já pode acessar sua conta utilizando a nova senha.
        </Typography>

        <Button
          asChild
          className="
            w-full
            border-0
            text-white
            bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)]
          "
        >
          <Link href="/login">Ir para o login</Link>
        </Button>
      </Box>
    )
  }

  return (
    <Box asChild>
      <form
        onSubmit={handleSubmit}
        className="flex-col gap-4"
        noValidate
      >
        <Box className="flex-col gap-1.5">
          <Typography
            asChild
            variant="small"
            className="font-medium"
          >
            <label htmlFor="password">Nova senha</label>
          </Typography>

          <Controller
            control={form.control}
            name="password"
            render={({ field }) => (
              <Box className="relative">
                <Input
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  aria-invalid={!!form.formState.errors.password}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </Box>
            )}
          />

          {form.formState.errors.password?.message && (
            <Typography
              variant="small"
              className="text-destructive"
            >
              {form.formState.errors.password.message}
            </Typography>
          )}
        </Box>

        <Box className="flex-col gap-1.5">
          <Typography
            asChild
            variant="small"
            className="font-medium"
          >
            <label htmlFor="confirmPassword">Confirmar senha</label>
          </Typography>

          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <Box className="relative">
                <Input
                  {...field}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  aria-invalid={!!form.formState.errors.confirmPassword}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </Box>
            )}
          />

          {form.formState.errors.confirmPassword?.message && (
            <Typography
              variant="small"
              className="text-destructive"
            >
              {form.formState.errors.confirmPassword.message}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="
            w-full
            border-0
            text-white
            bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)]
          "
        >
          {resetPasswordMutation.isPending ? "Salvando..." : "Redefinir senha"}
        </Button>
      </form>
    </Box>
  )
}
