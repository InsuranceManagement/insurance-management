import { type EntityWithName } from "@/shared/models/entity"

export interface Lead extends EntityWithName {
  phoneNumber: string
  createdAt: string
}

export type LeadCreatePayload = Pick<Lead, "name" | "phoneNumber">
