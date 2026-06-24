import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data

    if (responseData && typeof responseData === "object") {
      if (
        error.response?.status === 429 &&
        "remainingSeconds" in responseData
      ) {
        return `Você poderá solicitar um novo email em ${responseData.remainingSeconds}s`
      }

      if ("message" in responseData) {
        const message = responseData.message

        if (Array.isArray(message)) {
          return message.join(", ")
        }

        if (typeof message === "string") {
          return message
        }
      }
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Ocorreu um erro inesperado."
}

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(getErrorMessage(error))
      },
    }),

    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(getErrorMessage(error))
      },

      onSuccess: (_data, _variables, _context, mutation) => {
        const successMessage = mutation.meta?.successMessage

        if (typeof successMessage === "string") {
          toast.success(successMessage)
        }
      },
    }),

    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}
