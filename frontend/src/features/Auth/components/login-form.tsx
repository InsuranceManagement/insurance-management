"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { loginSchema, type LoginFormValues } from "../schema"

import { useAuth } from "@/shared/context/auth-context"
import { useLogin } from "@/shared/hooks/use-login"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Typography } from "@/shared/components/ui/typography"

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const loginMutation = useLogin()

  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await loginMutation.mutateAsync({
      body: values,
    })

    login(result.accessToken, result.user)

    router.push("/dashboard")
  })

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

        <Box className="flex-col gap-1.5">
          <Box className="items-center justify-between">
            <Typography
              asChild
              variant="small"
              className="font-medium"
            >
              <label htmlFor="password">Senha</label>
            </Typography>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#06608a] hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </Box>

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

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="
            w-full
            border-0
            text-white
            bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)]
            hover:opacity-90
          "
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </Button>

        <Typography
          asChild
          variant="small"
          className="text-center text-muted-foreground"
        >
          <p>
            Não possui uma conta?{" "}
            <Link
              href="/register"
              className="font-medium text-[#06608a] hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </Typography>
      </form>
    </Box>
  )
}
