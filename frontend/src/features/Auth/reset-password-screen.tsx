"use client"

import { useState } from "react"

import ResetPasswordForm from "./components/reset-password-form"

import { AuthCard } from "@/features/Auth/components/auth-card"
import { AuthLayoutCentered } from "./components/auth-layout-centered"

export default function ResetPasswordScreen() {
  const [success, setSuccess] = useState(false)

  return (
    <AuthLayoutCentered>
      <AuthCard
        title={success ? "Senha redefinida" : "Redefinir senha"}
        description={success ? undefined : "Informe sua nova senha."}
      >
        <ResetPasswordForm onSuccess={() => setSuccess(true)} />
      </AuthCard>
    </AuthLayoutCentered>
  )
}
