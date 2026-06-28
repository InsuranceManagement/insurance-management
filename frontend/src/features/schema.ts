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

const optionalDigitsSchema = z.string().trim().optional();

export const clientUpsertSchema = z
  .object({
    name: z.string().trim().min(1, "O nome e obrigatorio"),
    email: z.string().trim().email("Informe um e-mail valido"),
    cpf: optionalDigitsSchema.refine(
      (value) => !value || /^\d{11}$/.test(value),
      "O CPF deve conter exatamente 11 numeros",
    ),
    cnpj: optionalDigitsSchema.refine(
      (value) => !value || /^\d{14}$/.test(value),
      "O CNPJ deve conter exatamente 14 numeros",
    ),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\d{10,15}$/, "O telefone deve conter entre 10 e 15 numeros"),
    birthDate: z.string().trim().min(1, "A data de nascimento e obrigatoria"),
    address: z.object({
      cep: optionalDigitsSchema.refine(
        (value) => !value || /^\d{8}$/.test(value),
        "O CEP deve conter exatamente 8 numeros",
      ),
      street: z.string().trim().min(1, "A rua e obrigatoria"),
      district: z.string().trim().min(1, "O bairro e obrigatorio"),
      state: z.string().trim().min(1, "O estado e obrigatorio"),
      city: z.string().trim().min(1, "A cidade e obrigatoria"),
      number: z.string().trim().min(1, "O numero e obrigatorio"),
      complement: z.string().trim().optional(),
    }),
    productIds: z.array(z.string()),
  })
  .superRefine((values, context) => {
    if (values.cpf || values.cnpj) {
      return;
    }

    context.addIssue({
      code: "custom",
      path: ["cpf"],
      message: "Informe pelo menos um CPF ou CNPJ",
    });
  });

export type ClientUpsertFormValues = z.infer<typeof clientUpsertSchema>;

