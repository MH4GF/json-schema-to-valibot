import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { escapeString } from './escapeString.ts'
import { formatJsDoc } from './formatJsDoc.ts'

export function withDescription(
  schema: JSONSchema4,
  baseSchema: string,
  options: Options = {},
): string {
  let result = baseSchema

  if (schema.description) {
    // Add valibot description pipe if not disabled
    if (!options.withoutDescriptions) {
      result = `v.pipe(${result}, v.description("${escapeString(schema.description)}"))`
    }

    // Add JSDoc comment if enabled
    if (options.withJsdocs) {
      result = `${formatJsDoc(schema.description)}${result}`
    }
  }

  return result
}
