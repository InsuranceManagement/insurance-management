"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { routes } from "@/shared/constants/routes"
import { apiClient, resetCsrfToken } from "@/shared/lib/api-client"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextData = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextData | null>(null)

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let active = true

    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")

    void apiClient<User>({ route: routes.users.me })
      .then((currentUser) => {
        if (active) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      })
      .catch(() => {
        if (active) {
          setUser(null)
          setIsAuthenticated(false)
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = (user: User) => {
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await apiClient({ route: routes.users.logout })
    } catch {
      // The local state must be cleared even if the server is unavailable.
    } finally {
      resetCsrfToken()
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
