import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { escapeString } from './escapeString.ts'

export function withDescription(
  schema: JSONSchema4,
  baseSchema: string,
  options: Options = {},
): string {
  if (!options.withoutDescriptions && schema.description) {
    return `v.pipe(${baseSchema}, v.description("${escapeString(schema.description)}"))`
  }
  return baseSchema
}
