"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import {
  type ProductUpsertFormValues,
  productUpsertSchema,
} from "@/features/schema"
import { type InsuranceCompany } from "@/features/InsuranceCompanyCrud/models/insurance-company"
import { type ProductType } from "@/features/ProductTypeCrud/models/product-type"
import { useListEntity } from "@/shared/components/CrudScreen/hooks/use-list-entity"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Typography } from "@/shared/components/ui/typography"
import { SelectInput } from "@/shared/components/ui/select-input" // Importação nova!
import { routes } from "@/shared/constants/routes"

type ProductFormProps = {
  initialValues?: Partial<ProductUpsertFormValues>
  onSubmit: (values: ProductUpsertFormValues) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

const DEFAULT_VALUES: ProductUpsertFormValues = {
  name: "",
  productTypeId: "",
  insuranceCompanyId: "",
}

export function ProductForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting = false,
}: Readonly<ProductFormProps>) {
  const { rows: productTypes, areRowsLoading: isLoadingTypes } =
    useListEntity<ProductType>({
      title: "Tipos de Produto",
      listRoute: routes.productTypes.list,
    })

  const { rows: insuranceCompanies, areRowsLoading: isLoadingCompanies } =
    useListEntity<InsuranceCompany>({
      title: "Seguradoras",
      listRoute: routes.insuranceCompanies.list,
    })

  const productTypeOptions = useMemo(
    () => productTypes.map((pt) => ({ label: pt.name, value: pt.id })),
    [productTypes],
  )

  const insuranceCompanyOptions = useMemo(
    () => insuranceCompanies.map((ic) => ({ label: ic.name, value: ic.id })),
    [insuranceCompanies],
  )

  const normalizedInitialValues = useMemo(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
    }),
    [initialValues],
  )

  const form = useForm<ProductUpsertFormValues>({
    resolver: zodResolver(productUpsertSchema),
    defaultValues: normalizedInitialValues,
  })

  useEffect(() => {
    form.reset(normalizedInitialValues)
  }, [form, normalizedInitialValues])

  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: ProductUpsertFormValues = {
      name: values.name.trim(),
      productTypeId: values.productTypeId,
      insuranceCompanyId: values.insuranceCompanyId,
    }
    await onSubmit(payload)
  })

  return (
    <Box asChild>
      <form
        className="w-full flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="flex-col gap-1.5">
          <Label htmlFor="product-name">Nome</Label>
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                id="product-name"
                placeholder="Ex.: Seguro de Vida Premium"
                aria-invalid={!!form.formState.errors.name}
              />
            )}
          />
          {form.formState.errors.name && (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.name.message}
            </Typography>
          )}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="product-type">Tipo de Produto</Label>
          <Controller
            control={form.control}
            name="productTypeId"
            render={({ field }) => (
              <SelectInput
                id="product-type"
                value={field.value}
                onChange={field.onChange}
                options={productTypeOptions}
                placeholder={
                  isLoadingTypes ? "Carregando..." : "Selecione o tipo"
                }
                disabled={isLoadingTypes}
                isInvalid={!!form.formState.errors.productTypeId}
              />
            )}
          />
          {form.formState.errors.productTypeId && (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.productTypeId.message}
            </Typography>
          )}
        </Box>

        <Box className="flex-col gap-1.5">
          <Label htmlFor="insurance-company">Seguradora</Label>
          <Controller
            control={form.control}
            name="insuranceCompanyId"
            render={({ field }) => (
              <SelectInput
                id="insurance-company"
                value={field.value}
                onChange={field.onChange}
                options={insuranceCompanyOptions}
                placeholder={
                  isLoadingCompanies
                    ? "Carregando..."
                    : "Selecione a seguradora"
                }
                disabled={isLoadingCompanies}
                isInvalid={!!form.formState.errors.insuranceCompanyId}
              />
            )}
          />
          {form.formState.errors.insuranceCompanyId && (
            <Typography variant="small" className="text-destructive">
              {form.formState.errors.insuranceCompanyId.message}
            </Typography>
          )}
        </Box>

        <Box className="justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitDisabled}>
            {submitLabel}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
