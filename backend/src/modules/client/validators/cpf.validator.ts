import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

const CPF_LENGTH = 11

function isValidCpf(value: string): boolean {
  if (!/^\d{11}$/.test(value)) {
    return false
  }

  if (/^(\d)\1{10}$/.test(value)) {
    return false
  }

  let sum = 0
  for (let index = 0; index < 9; index += 1) {
    sum += Number(value[index]) * (10 - index)
  }

  let firstCheck = (sum * 10) % 11
  if (firstCheck === 10) {
    firstCheck = 0
  }

  if (firstCheck !== Number(value[9])) {
    return false
  }

  sum = 0
  for (let index = 0; index < 10; index += 1) {
    sum += Number(value[index]) * (11 - index)
  }

  let secondCheck = (sum * 10) % 11
  if (secondCheck === 10) {
    secondCheck = 0
  }

  return secondCheck === Number(value[10])
}

@ValidatorConstraint({ name: 'cpf', async: false })
export class CpfValidator implements ValidatorConstraintInterface {
  validate(value?: string): boolean {
    if (value === undefined || value === null) {
      return true
    }

    if (value.length !== CPF_LENGTH) {
      return false
    }

    return isValidCpf(value)
  }

  defaultMessage(): string {
    return 'cpf is invalid'
  }
}
