"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  type ProductTypeUpsertFormValues,
  productTypeUpsertSchema,
} from "@/features/schema";
import { Box } from "@/shared/components/ui/box";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Typography } from "@/shared/components/ui/typography";

type ProductTypeFormProps = {
  initialValues?: Partial<ProductTypeUpsertFormValues>;
  onSubmit: (values: ProductTypeUpsertFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

const DEFAULT_VALUES: ProductTypeUpsertFormValues = {
  name: "",
  description: "",
};

export function ProductTypeForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting = false,
}: Readonly<ProductTypeFormProps>) {
  const normalizedInitialValues = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
    }),
    [initialValues],
  );

  const form = useForm<ProductTypeUpsertFormValues>({
    resolver: zodResolver(productTypeUpsertSchema),
    defaultValues: normalizedInitialValues,
  });

  useEffect(() => {
    form.reset(normalizedInitialValues);
  }, [form, normalizedInitialValues]);

  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: ProductTypeUpsertFormValues = {
      name: values.name.trim(),
      description: values.description.trim(),
    };

    await onSubmit(payload);
  });

  return (
    <Box asChild>
      <form
        className="w-full flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="flex-col gap-1.5">
          <Typography asChild variant="small" className="font-medium">
            <label htmlFor="product-type-name">Nome</label>
          </Typography>

          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                id="product-type-name"
                placeholder="Ex.: Seguro de Vida"
                aria-invalid={!!form.formState.errors.name}
              />
            )}
          />

          {form.formState.errors.name?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.name.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="flex-col gap-1.5">
          <Typography asChild variant="small" className="font-medium">
            <label htmlFor="product-type-description">Descrição</label>
          </Typography>

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Input
                {...field}
                id="product-type-description"
                placeholder="Ex.: Cobertura para morte ou invalidez"
                aria-invalid={!!form.formState.errors.description}
              />
            )}
          />

          {form.formState.errors.description?.message ? (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.description.message}
            </Typography>
          ) : null}
        </Box>

        <Box className="justify-end gap-2 pt-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}

          <Button type="submit" disabled={isSubmitDisabled}>
            {submitLabel}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
