import { type Client } from "@/features/ClientCrud/models/client"
import { routes } from "@/shared/constants/routes"
import { useApiQuery } from "@/shared/hooks/use-api-query"

export function useVisitClients() {
  return useApiQuery<Client[]>({
    route: routes.clients.list,
    queryKey: ["visits", "clients"],
    meta: { errorMessage: "Erro ao carregar clientes para as visitas." },
  })
}
