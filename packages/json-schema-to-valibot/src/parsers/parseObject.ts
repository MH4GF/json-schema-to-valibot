import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDescription } from '../utils/withDescription.ts'
import { parseSchema } from './parseSchema.ts'

const HYPHEN_REGEX = /[-]/

export function parseObject(schema: JSONSchema4, options: Options): string {
  if (!schema.properties) {
    return withDescription(schema, 'v.object({})', options)
  }

  const required = new Set(Array.isArray(schema.required) ? schema.required : [])
  const properties = Object.entries(schema.properties)
    .map(([key, value]) => {
      const parsed = parseSchema(value, options)
      const formattedKey = HYPHEN_REGEX.test(key) ? `"${key}"` : key
      return `${formattedKey}: ${
        required.has(key) || (!options.withoutDefaults && value.default !== undefined)
          ? parsed
          : `v.optional(${parsed})`
      }`
    })
    .join(',')

  const objectSchema = `v.object({${properties}})`
  return withDescription(schema, objectSchema, options)
}
