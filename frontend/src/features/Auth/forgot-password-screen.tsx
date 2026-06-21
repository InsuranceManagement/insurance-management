"use client"

import { useEffect, useState } from "react"

import ForgotPasswordForm from "./components/forgot-password-form"

import { Box } from "@/shared/components/ui/box"
import { Skeleton } from "@/shared/components/ui/skeleton"

import { AuthCard } from "@/features/Auth/components/auth-card"
import { AuthLayoutSplit } from "@/features/Auth/components/auth-layout-split"

const STORAGE_EMAIL_KEY = "forgot-password-email"
const STORAGE_RESEND_AT_KEY = "forgot-password-resend-at"

export default function ForgotPasswordScreen() {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedEmail = sessionStorage.getItem(STORAGE_EMAIL_KEY)
    const savedResendAt = sessionStorage.getItem(STORAGE_RESEND_AT_KEY)

    if (savedEmail && savedResendAt) {
      const resendAt = Number(savedResendAt)

      if (Date.now() < resendAt) {
        setEmail(savedEmail)
        setEmailSent(true)
        setResendAvailableAt(resendAt)
      } else {
        sessionStorage.removeItem(STORAGE_EMAIL_KEY)
        sessionStorage.removeItem(STORAGE_RESEND_AT_KEY)
      }
    }

    setIsLoading(false)
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

  if (isLoading) {
    return (
      <AuthLayoutSplit>
        <Box className="w-full max-w-md">
          <AuthCard title="">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </AuthCard>
        </Box>
      </AuthLayoutSplit>
    )
  }

  return (
    <AuthLayoutSplit>
      <AuthCard
        title={emailSent ? "Verifique seu email" : "Recuperar senha"}
        description={
          emailSent
            ? undefined
            : "Informe seu email para receber instruções de recuperação de senha."
        }
      >
        <ForgotPasswordForm
          emailSent={emailSent}
          email={email}
          resendAvailableAt={resendAvailableAt}
          setResendAvailableAt={setResendAvailableAt}
          onSuccess={handleSuccess}
          onCooldownFinished={handleCooldownFinished}
        />
      </AuthCard>
    </AuthLayoutSplit>
  )
}
