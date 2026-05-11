import { z } from "zod"

const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/

export const insuranceCompanyUpsertSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatorio.")
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(120, "Nome deve ter no maximo 120 caracteres."),
  color: z
    .string()
    .trim()
    .min(1, "Cor é obrigatoria.")
    .regex(hexColorRegex, "Cor deve estar no formato HEX (#RRGGBB)."),
})

export type InsuranceCompanyUpsertFormValues = z.infer<
  typeof insuranceCompanyUpsertSchema
>
