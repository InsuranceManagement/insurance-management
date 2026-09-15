import { type EntityWithName } from "@/shared/models/entity"

export interface NotificationTemplate extends EntityWithName {
  description: string | null
  subject: string
  body: string
  variableSchema: Record<string, string> | null
  isActive: boolean
  notificationTypeId: string
}

export type NotificationTemplateUpsertPayload = {
  name: string
  description: string | null
  subject: string
  body: string
  isActive: boolean | null
  // O serviço externo exige notificationTypeId/variableSchema como string/objeto
  // de verdade na criação (rejeita null explícito), mas exige as 7 chaves
  // sempre presentes (null permitido) na edição. Por isso ficam opcionais aqui:
  // omitidos na criação quando vazios, sempre presentes (com null) na edição.
  variableSchema?: Record<string, string> | null
  notificationTypeId?: string | null
}
