"use client"

import { useEffect, useState } from "react"

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

const STORAGE_EMAIL_KEY = "forgot-password-email"
const STORAGE_RESEND_AT_KEY = "forgot-password-resend-at"

export default function ForgotPasswordScreen() {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
    null,
  )

  useEffect(() => {
    const savedEmail = sessionStorage.getItem(STORAGE_EMAIL_KEY)
    const savedResendAt = sessionStorage.getItem(STORAGE_RESEND_AT_KEY)

    if (!savedEmail || !savedResendAt) {
      return
    }

    const resendAt = Number(savedResendAt)

    if (Date.now() < resendAt) {
      setEmail(savedEmail)
      setEmailSent(true)
      setResendAvailableAt(resendAt)
    } else {
      sessionStorage.removeItem(STORAGE_EMAIL_KEY)
      sessionStorage.removeItem(STORAGE_RESEND_AT_KEY)
    }
  }, [])

  const handleSuccess = (email: string) => {
    const resendAt = Date.now() + 60_000

    setEmail(email)
    setEmailSent(true)
    setResendAvailableAt(resendAt)

    sessionStorage.setItem(STORAGE_EMAIL_KEY, email)
    sessionStorage.setItem(STORAGE_RESEND_AT_KEY, resendAt.toString())
  }

  const handleCooldownFinished = () => {
    sessionStorage.removeItem(STORAGE_EMAIL_KEY)
    sessionStorage.removeItem(STORAGE_RESEND_AT_KEY)

    setEmail("")
    setEmailSent(false)
    setResendAvailableAt(null)
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
              resendAvailableAt={resendAvailableAt}
              setResendAvailableAt={setResendAvailableAt}
              onSuccess={handleSuccess}
              onCooldownFinished={handleCooldownFinished}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
