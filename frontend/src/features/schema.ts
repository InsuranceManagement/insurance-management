import { z } from "zod";

const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

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
});

export type InsuranceCompanyUpsertFormValues = z.infer<
  typeof insuranceCompanyUpsertSchema
>;

export const productTypeUpsertSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
});

export type ProductTypeUpsertFormValues = z.infer<
  typeof productTypeUpsertSchema
>;

export const productUpsertSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  productTypeId: z.string().min(1, "Selecione um tipo de produto"),
  insuranceCompanyId: z.string().min(1, "Selecione uma seguradora"),
});

export type ProductUpsertFormValues = z.infer<typeof productUpsertSchema>;
