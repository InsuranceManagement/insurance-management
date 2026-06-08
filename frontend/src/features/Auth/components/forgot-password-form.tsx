"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"

import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schema"

import { useForgotPassword } from "@/features/Auth/hooks/use-forgot-password"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Typography } from "@/shared/components/ui/typography"
import { useEffect, useState } from "react"

type ForgotPasswordFormProps = {
  emailSent: boolean
  email: string
  resendAvailableAt: number | null
  setResendAvailableAt: (value: number | null) => void
  onSuccess: (email: string) => void
  onCooldownFinished: () => void
}

export default function ForgotPasswordForm({
  emailSent,
  email,
  resendAvailableAt,
  setResendAvailableAt,
  onSuccess,
  onCooldownFinished,
}: ForgotPasswordFormProps) {
  const forgotPasswordMutation = useForgotPassword()
  const [cooldown, setCooldown] = useState(0)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await forgotPasswordMutation.mutateAsync({
      body: values,
    })

    setResendAvailableAt(Date.now() + 60_000)
    onSuccess(values.email)
  })

  const handleResend = async () => {
    if (!email || cooldown > 0) {
      return
    }

    await forgotPasswordMutation.mutateAsync({
      body: {
        email,
      },
    })

    const resendAt = Date.now() + 60_000

    setResendAvailableAt(resendAt)

    sessionStorage.setItem("forgot-password-resend-at", resendAt.toString())
  }

  useEffect(() => {
    if (!resendAvailableAt) {
      setCooldown(0)
      return
    }

    const updateCooldown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((resendAvailableAt - Date.now()) / 1000),
      )

      setCooldown(remaining)

      if (remaining === 0) {
        emailSent = true
      }
    }

    updateCooldown()

    const interval = setInterval(updateCooldown, 1000)

    return () => clearInterval(interval)
  }, [resendAvailableAt, onCooldownFinished])

  if (emailSent) {
    return (
      <Box className="flex-col items-center gap-4 py-2 text-center">
        <Box className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </Box>

        <Typography className="text-muted-foreground">
          Caso o endereço informado esteja cadastrado em nossa base, enviamos um
          link para redefinição de senha.
        </Typography>

        <Typography
          variant="small"
          className="text-muted-foreground"
        >
          Verifique também sua caixa de spam ou lixo eletrônico.
        </Typography>

        <Button
          variant="outline"
          onClick={handleResend}
          disabled={forgotPasswordMutation.isPending || cooldown > 0}
          className="w-full"
        >
          {forgotPasswordMutation.isPending
            ? "Reenviando..."
            : cooldown > 0
              ? `Reenviar em ${cooldown}s`
              : "Reenviar email"}
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full"
        >
          <Link href="/login">Voltar para o login</Link>
        </Button>
      </Box>
    )
  }

  return (
    <Box asChild>
      <form
        onSubmit={handleSubmit}
        className="w-full flex-col gap-4"
        noValidate
      >
        <Box className="flex-col gap-1.5">
          <Typography
            asChild
            variant="small"
            className="font-medium"
          >
            <label htmlFor="email">Email</label>
          </Typography>

          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="Digite seu email"
                aria-invalid={!!form.formState.errors.email}
              />
            )}
          />

          {form.formState.errors.email?.message && (
            <Typography
              variant="small"
              className="text-destructive"
            >
              {form.formState.errors.email.message}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="
            w-full
            border-0
            text-white
            bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)]
            hover:opacity-90
          "
        >
          {forgotPasswordMutation.isPending
            ? "Enviando..."
            : "Enviar link de recuperação"}
        </Button>

        <Typography
          asChild
          variant="small"
          className="text-center text-muted-foreground"
        >
          <Link
            href="/login"
            className="font-medium text-[#06608a] hover:underline"
          >
            Voltar para o login
          </Link>
        </Typography>
      </form>
    </Box>
  )
}
