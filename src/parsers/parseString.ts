import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDefault } from '../utils/withDefault.ts'
import { escapeString } from '../utils/escapeString.ts'

export function parseString(schema: JSONSchema4, options: Options = {}): string {
  const validations: string[] = ['v.string()']

  if (typeof schema.minLength === 'number') {
    validations.push(`v.minLength(${schema.minLength})`)
  }

  if (typeof schema.maxLength === 'number') {
    validations.push(`v.maxLength(${schema.maxLength})`)
  }

  if (typeof schema.pattern === 'string') {
    const escapedPattern = schema.pattern.replace(/\//g, '\\/')
    validations.push(`v.regex(/${escapedPattern}/)`)
  }

  if (!options.withoutDescriptions && schema.description) {
    validations.push(`v.description("${escapeString(schema.description)}")`)
  }

  const baseValidation = validations.length > 1 ? `v.pipe(${validations.join(', ')})` : 'v.string()'
  return withDefault(schema, baseValidation, options)
}
