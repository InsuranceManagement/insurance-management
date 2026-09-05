import { type Entity } from "@/shared/models/entity"

export interface Visit extends Entity {
  name: string
  description: string
  clientId: string
  date: string
}

export type VisitUpsertPayload = Pick<Visit, "name" | "description" | "clientId" | "date">

export type VisitDateRange = {
  startDate: string
  endDate: string
}
