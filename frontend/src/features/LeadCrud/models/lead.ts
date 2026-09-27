import { type EntityWithName } from "@/shared/models/entity"

export interface Lead extends EntityWithName {
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export type LeadUpsertPayload = Pick<Lead, "name" | "phoneNumber">

