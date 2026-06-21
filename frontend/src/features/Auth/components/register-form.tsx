"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { useRegister } from "@/features/Auth/hooks/use-register"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Typography } from "@/shared/components/ui/typography"

import { registerSchema, type RegisterFormValues } from "../schema"

export default function RegisterForm() {
  const router = useRouter()

  const registerMutation = useRegister()

  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await registerMutation.mutateAsync({
      body: values,
    })

    router.push("/login")
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
            <label htmlFor="name">Nome</label>
          </Typography>

          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                aria-invalid={!!form.formState.errors.name}
              />
            )}
          />

          {form.formState.errors.name?.message && (
            <Typography
              variant="small"
              className="text-destructive"
            >
              {form.formState.errors.name.message}
            </Typography>
          )}
        </Box>

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
          <Typography
            asChild
            variant="small"
            className="font-medium"
          >
            <label htmlFor="password">Senha</label>
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

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="
            w-full
            border-0
            text-white
            bg-[linear-gradient(135deg,#044766_0%,#06608a_50%,#0b7fb4_100%)]
            hover:opacity-90
          "
        >
          {registerMutation.isPending ? "Cadastrando..." : "Cadastrar"}
        </Button>

        <Typography
          asChild
          variant="small"
          className="text-center text-muted-foreground"
        >
          <p>
            Já possui uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-[#06608a] hover:underline"
            >
              Entrar
            </Link>
          </p>
        </Typography>
      </form>
    </Box>
  )
}
