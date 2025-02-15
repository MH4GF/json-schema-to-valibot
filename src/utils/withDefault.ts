import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { escapeString } from './escapeString.ts'

export function withDefault(
  schema: JSONSchema4,
  baseSchema: string,
  options: Options = {},
): string {
  if (!options.withoutDefaults && schema.default !== undefined) {
    const defaultValue =
      schema.type === 'string' ? `'${escapeString(schema.default)}'` : schema.default
    return `v.optional(${baseSchema}, ${defaultValue})`
  }
  return baseSchema
}
