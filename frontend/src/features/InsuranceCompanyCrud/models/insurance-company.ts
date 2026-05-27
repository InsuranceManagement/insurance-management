import { EntityWithName } from "@/shared/models/entity"

export interface InsuranceCompany extends EntityWithName {
  color: string
}

export type InsuranceCompanyUpsertPayload = Pick<
  InsuranceCompany,
  "name" | "color"
>
