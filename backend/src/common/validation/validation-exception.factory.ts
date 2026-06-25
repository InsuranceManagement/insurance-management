import { BadRequestException } from '@nestjs/common'
import { ValidationError } from 'class-validator'

function extractValidationMessages(errors: ValidationError[], parentProperty = ''): string[] {
  return errors.flatMap((error) => {
    const property = parentProperty ? `${parentProperty}.${error.property}` : error.property
    const constraints = Object.entries(error.constraints ?? {}).map(([constraint, message]) =>
      constraint === 'whitelistValidation' ? `O campo "${property}" não é permitido.` : message,
    )
    const children = extractValidationMessages(error.children ?? [], property)

    return [...constraints, ...children]
  })
}

export function createValidationException(errors: ValidationError[]): BadRequestException {
  return new BadRequestException(extractValidationMessages(errors))
}
