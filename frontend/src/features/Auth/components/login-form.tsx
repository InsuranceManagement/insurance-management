"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

import { useLogin } from "@/shared/hooks/use-login"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/dist/client/link"
import { useState } from "react"
import { loginSchema, type LoginFormValues } from "../schema"

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

  const [showPassword, setShowPassword] = useState(false)

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

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
            className="pr-10"
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
        </div>
      </div>

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

      <p className="text-center text-sm text-muted-foreground">
        Não possui uma conta?{" "}
        <Link
          href="/register"
          className="font-medium text-[#06608a] hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  )
}
