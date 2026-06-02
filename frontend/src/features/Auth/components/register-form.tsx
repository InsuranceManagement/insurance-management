"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

import { useRegister } from "@/shared/hooks/use-register"

import { registerSchema, type RegisterFormValues } from "../schema"

export default function RegisterForm() {
  const router = useRouter()

  const registerMutation = useRegister()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: RegisterFormValues) => {
    await registerMutation.mutateAsync(values)

    router.push("/login")
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>

        <Input
          id="name"
          {...form.register("name")}
        />
      </div>

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

      <p className="text-center text-sm text-muted-foreground">
        Já possui uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-[#06608a] hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  )
}
