import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
function getErrorMessageFromMeta(meta: unknown) {
  if (typeof meta !== "object" || meta === null) {
    return undefined
  }

  const errorMessage = (meta as Record<string, unknown>).errorMessage
  if (typeof errorMessage !== "string") {
    return undefined
  }

  return errorMessage
}

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(getErrorMessageFromMeta(error))
      },
    }),

    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(getErrorMessageFromMeta(error))
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
