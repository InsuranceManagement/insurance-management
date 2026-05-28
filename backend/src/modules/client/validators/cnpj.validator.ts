import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

const CNPJ_LENGTH = 14
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

function calculateCheckDigit(value: string, weights: number[]): number {
  let sum = 0
  for (let index = 0; index < weights.length; index += 1) {
    sum += Number(value[index]) * weights[index]
  }

  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

function isValidCnpj(value: string): boolean {
  if (!/^\d{14}$/.test(value)) {
    return false
  }

  if (/^(\d)\1{13}$/.test(value)) {
    return false
  }

  const firstCheck = calculateCheckDigit(value, FIRST_WEIGHTS)
  if (firstCheck !== Number(value[12])) {
    return false
  }

  const secondCheck = calculateCheckDigit(value, SECOND_WEIGHTS)
  return secondCheck === Number(value[13])
}

@ValidatorConstraint({ name: 'cnpj', async: false })
export class CnpjValidator implements ValidatorConstraintInterface {
  validate(value?: string): boolean {
    if (value === undefined || value === null) {
      return true
    }

    if (value.length !== CNPJ_LENGTH) {
      return false
    }

    return isValidCnpj(value)
  }

  defaultMessage(): string {
    return 'cnpj is invalid'
  }
}
