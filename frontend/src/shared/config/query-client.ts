import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"

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
      onError: (_error, query) => {
        const message = getErrorMessageFromMeta(query.meta)
        if (message) {
          console.error(message)
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (_error, _variables, _onMutateResult, mutation) => {
        const message = getErrorMessageFromMeta(mutation.meta)
        if (message) {
          console.error(message)
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
