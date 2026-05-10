"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

import { createQueryClient } from "@/shared/config/query-client"

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider({ children }: Readonly<QueryProviderProps>) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
