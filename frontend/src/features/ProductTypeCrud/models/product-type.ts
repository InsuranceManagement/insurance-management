import { EntityWithName } from "@/shared/models/entity";

export interface ProductType extends EntityWithName {
  description: string;
}

export type ProductTypeUpsertPayload = Pick<
  ProductType,
  "name" | "description"
>;
