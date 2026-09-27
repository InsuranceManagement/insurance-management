"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AuthCard } from "./components/auth-card"
import { AuthLayoutSplit } from "./components/auth-layout-split"
import LoginForm from "./components/login-form"
import { Box } from "@/shared/components/ui/box"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useAuth } from "@/shared/context/auth-context"

export default function LoginScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) {
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
        title="Entrar"
        description="Acesse sua conta para gerenciar seus segurados."
        plainOnMobile
      >
        <LoginForm />
      </AuthCard>
    </AuthLayoutSplit>
  )
}
