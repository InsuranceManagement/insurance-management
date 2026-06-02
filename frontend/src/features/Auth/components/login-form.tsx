"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

import { loginSchema, type LoginFormValues } from "../schema"

import { useLogin } from "@/shared/hooks/use-login"

export default function LoginForm() {
  const router = useRouter()

  const loginMutation = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync(values)

      localStorage.setItem("accessToken", result.accessToken)

      localStorage.setItem("user", JSON.stringify(result.user))

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          {...form.register("email")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>

        <Input
          id="password"
          type="password"
          {...form.register("password")}
        />
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  )
}
