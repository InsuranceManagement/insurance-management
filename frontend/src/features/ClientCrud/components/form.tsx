"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import {
  formatProductLabel,
  type Product,
} from "@/features/ProductCrud/models/product"
import {
  clientUpsertSchema,
  type ClientUpsertFormValues,
} from "@/features/schema"
import { useListEntity } from "@/shared/components/CrudScreen/hooks/use-list-entity"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { MultiSelectInput } from "@/shared/components/ui/multi-select-input"
import { Typography } from "@/shared/components/ui/typography"
import { routes } from "@/shared/constants/routes"

type ClientFormProps = {
  initialValues?: Partial<ClientUpsertFormValues>
  onSubmit: (values: ClientUpsertFormValues) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

const DEFAULT_VALUES: ClientUpsertFormValues = {
  name: "",
  email: "",
  cpf: "",
  cnpj: "",
  phoneNumber: "",
  birthDate: "",
  address: {
    cep: "",
    street: "",
    district: "",
    state: "",
    city: "",
    number: "",
    complement: "",
  },
  productIds: [],
}

function optionalTrimmed(value?: string) {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : undefined
}

export function ClientForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  isSubmitting = false,
}: Readonly<ClientFormProps>) {
  const { rows: products, areRowsLoading: areProductsLoading } =
    useListEntity<Product>({
      title: "Produtos",
      listRoute: routes.products.list,
    })

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: formatProductLabel(product),
        value: product.id,
      })),
    [products],
  )

  const normalizedInitialValues = useMemo<ClientUpsertFormValues>(
    () => ({
      ...DEFAULT_VALUES,
      ...initialValues,
      address: {
        ...DEFAULT_VALUES.address,
        ...initialValues?.address,
      },
      productIds: initialValues?.productIds ?? [],
    }),
    [initialValues],
  )

  const form = useForm<ClientUpsertFormValues>({
    resolver: zodResolver(clientUpsertSchema),
    defaultValues: normalizedInitialValues,
  })

  useEffect(() => {
    form.reset(normalizedInitialValues)
  }, [form, normalizedInitialValues])

  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: ClientUpsertFormValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      cpf: optionalTrimmed(values.cpf),
      cnpj: optionalTrimmed(values.cnpj),
      phoneNumber: values.phoneNumber.trim(),
      birthDate: values.birthDate,
      address: {
        cep: optionalTrimmed(values.address.cep),
        street: values.address.street.trim(),
        district: values.address.district.trim(),
        state: values.address.state.trim(),
        city: values.address.city.trim(),
        number: values.address.number.trim(),
        complement: optionalTrimmed(values.address.complement),
      },
      productIds: values.productIds ?? [],
    }

    await onSubmit(payload)
  })

  return (
    <Box asChild>
      <form
        className="max-h-[76vh] w-full flex-col gap-6 overflow-x-hidden overflow-y-auto pr-1"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Typography
            variant="small"
            className="font-medium sm:col-span-2"
          >
            Dados pessoais
          </Typography>

          <Box className="flex-col gap-1.5">
            <Label htmlFor="client-name">Nome</Label>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="client-name"
                  placeholder="Ex.: Maria Souza"
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
            <Label htmlFor="client-email">E-mail</Label>
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  id="client-email"
                  type="email"
                  placeholder="cliente@email.com"
                  aria-invalid={!!form.formState.errors.email}
                />
              )}
            />
            {form.formState.errors.email?.message ? (
              <Typography variant="small" className="text-destructive">
                {form.formState.errors.email.message}
              </Typography>
            ) : null}
          </Box>

          <Box className="flex-col gap-1.5">
            <Label htmlFor="client-cpf">CPF</Label>
            <Controller
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <Input
                  {...field}
                  id="client-cpf"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="Somente numeros"
                  aria-invalid={!!form.formState.errors.cpf}
                />
              )}
            />
            {form.formState.errors.cpf?.message ? (
              <Typography variant="small" className="text-destructive">
                {form.formState.errors.cpf.message}
              </Typography>
            ) : null}
          </Box>

          <Box className="flex-col gap-1.5">
            <Label htmlFor="client-cnpj">CNPJ</Label>
            <Controller
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <Input
                  {...field}
                  id="client-cnpj"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="Somente numeros"
                  aria-invalid={!!form.formState.errors.cnpj}
                />
              )}
            />
            {form.formState.errors.cnpj?.message ? (
              <Typography variant="small" className="text-destructive">
                {form.formState.errors.cnpj.message}
              </Typography>
            ) : null}
          </Box>

          <Box className="flex-col gap-1.5">
            <Label htmlFor="client-phone">Telefone</Label>
            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <Input
                  {...field}
                  id="client-phone"
                  inputMode="numeric"
                  placeholder="11999999999"
                  aria-invalid={!!form.formState.errors.phoneNumber}
                />
              )}
            />
            {form.formState.errors.phoneNumber?.message ? (
              <Typography variant="small" className="text-destructive">
                {form.formState.errors.phoneNumber.message}
              </Typography>
            ) : null}
          </Box>

          <Box className="flex-col gap-1.5">
            <Label htmlFor="client-birth-date">Data de nascimento</Label>
            <Controller
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <Input
                  {...field}
                  id="client-birth-date"
                  type="date"
                  aria-invalid={!!form.formState.errors.birthDate}
                />
              )}
            />
            {form.formState.errors.birthDate?.message ? (
              <Typography variant="small" className="text-destructive">
                {form.formState.errors.birthDate.message}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box className="min-w-0 flex-col gap-3 border-t pt-4">
          <Typography variant="small" className="font-medium">
            Endereço
          </Typography>

          <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-cep">CEP</Label>
              <Controller
                control={form.control}
                name="address.cep"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="client-cep"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="Somente numeros"
                    aria-invalid={!!form.formState.errors.address?.cep}
                  />
                )}
              />
              {form.formState.errors.address?.cep?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.address.cep.message}
                </Typography>
              ) : null}
            </Box>

            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-state">Estado</Label>
              <Controller
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="client-state"
                    placeholder="SP"
                    aria-invalid={!!form.formState.errors.address?.state}
                  />
                )}
              />
              {form.formState.errors.address?.state?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.address.state.message}
                </Typography>
              ) : null}
            </Box>

            <Box className="flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="client-street">Rua</Label>
              <Controller
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="client-street"
                    placeholder="Rua das Flores"
                    aria-invalid={!!form.formState.errors.address?.street}
                  />
                )}
              />
              {form.formState.errors.address?.street?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.address.street.message}
                </Typography>
              ) : null}
            </Box>

            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-district">Bairro</Label>
              <Controller
                control={form.control}
                name="address.district"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="client-district"
                    placeholder="Centro"
                    aria-invalid={!!form.formState.errors.address?.district}
                  />
                )}
              />
              {form.formState.errors.address?.district?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.address.district.message}
                </Typography>
              ) : null}
            </Box>

            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-city">Cidade</Label>
              <Controller
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="client-city"
                    placeholder="Sao Paulo"
                    aria-invalid={!!form.formState.errors.address?.city}
                  />
                )}
              />
              {form.formState.errors.address?.city?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.address.city.message}
                </Typography>
              ) : null}
            </Box>

            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-number">Numero</Label>
              <Controller
                control={form.control}
                name="address.number"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="client-number"
                    placeholder="123"
                    aria-invalid={!!form.formState.errors.address?.number}
                  />
                )}
              />
              {form.formState.errors.address?.number?.message ? (
                <Typography variant="small" className="text-destructive">
                  {form.formState.errors.address.number.message}
                </Typography>
              ) : null}
            </Box>

            <Box className="flex-col gap-1.5">
              <Label htmlFor="client-complement">Complemento</Label>
              <Controller
                control={form.control}
                name="address.complement"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="client-complement"
                    placeholder="Apto 12"
                  />
                )}
              />
            </Box>
          </Box>
        </Box>

        <Box className="min-w-0 flex-col gap-3 border-t pt-4">
          <Typography variant="small" className="font-medium">
            Produtos vinculados
          </Typography>

          <Controller
            control={form.control}
            name="productIds"
            render={({ field, fieldState }) => (
              <MultiSelectInput
                id="client-products"
                value={field.value ?? []}
                onChange={field.onChange}
                options={productOptions}
                placeholder={
                  areProductsLoading
                    ? "Carregando produtos..."
                    : "Selecione os produtos"
                }
                searchPlaceholder="Pesquisar por produto ou seguradora..."
                emptyMessage="Nenhum produto encontrado."
                disabled={areProductsLoading}
                isInvalid={!!fieldState.error}
              />
            )}
          />
        </Box>

        <Box className="sticky bottom-0 justify-end gap-2 border-t bg-popover pt-4">
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
  )
}
