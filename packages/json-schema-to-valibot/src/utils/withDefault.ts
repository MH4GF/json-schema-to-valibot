import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { escapeString } from './escapeString.ts'

export function withDefault(
  schema: JSONSchema4,
  baseSchema: string,
  options: Options = {},
): string {
  if (!options.withoutDefaults && schema.default !== undefined) {
    let defaultValue = schema.default

    if (typeof defaultValue === 'string') {
      const numberValue = Number(defaultValue)
      if (!Number.isNaN(numberValue)) {
        defaultValue = numberValue
      } else if (defaultValue === 'true' || defaultValue === 'false') {
        defaultValue = defaultValue === 'true'
      } else {
        defaultValue = `'${escapeString(defaultValue)}'`
      }
    }

    return `v.optional(${baseSchema}, ${defaultValue})`
  }
  return baseSchema
}
