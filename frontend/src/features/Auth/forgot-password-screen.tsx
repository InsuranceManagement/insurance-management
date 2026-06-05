"use client"

import { useState } from "react"

import { BrandPanel } from "./components/brand-panel"
import ForgotPasswordForm from "./components/forgot-password-form"

import { Box } from "@/shared/components/ui/box"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

export default function ForgotPasswordScreen() {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleSuccess = (email: string) => {
    setEmail(email)
    setEmailSent(true)
  }

  return (
    <Box className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />

      <Box className="flex items-center justify-center bg-background p-6 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader className="gap-2">
            <CardTitle className="text-2xl">
              {emailSent ? "Verifique seu email" : "Recuperar Senha"}
            </CardTitle>

            {!emailSent && (
              <CardDescription>
                Informe seu email para receber instruções de recuperação de
                senha.
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            <ForgotPasswordForm
              emailSent={emailSent}
              email={email}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
