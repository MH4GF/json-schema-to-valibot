import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDefault } from '../utils/withDefault.ts'

export function parseNumber(schema: JSONSchema4, options: Options = {}): string {
  const validations: string[] = ['v.number()']

  if (schema.type === 'integer') {
    validations.push('v.integer()')
  }

  if (typeof schema.minimum === 'number') {
    const value = schema.exclusiveMinimum === true ? schema.minimum + 1 : schema.minimum
    validations.push(`v.minValue(${value})`)
  }

  if (typeof schema.maximum === 'number') {
    const value = schema.exclusiveMaximum === true ? schema.maximum - 1 : schema.maximum
    validations.push(`v.maxValue(${value})`)
  }

  if (typeof schema.multipleOf === 'number') {
    validations.push(`v.multipleOf(${schema.multipleOf})`)
  }

  const baseValidation = validations.length > 1 ? `v.pipe(${validations.join(', ')})` : 'v.number()'
  return withDefault(schema, baseValidation, options)
}
