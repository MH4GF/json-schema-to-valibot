import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDescription } from '../utils/withDescription.ts'
import { parseSchema } from './parseSchema.ts'

export function parseAnyOf(schema: JSONSchema4, options: Options): string {
  if (!Array.isArray(schema.anyOf) || schema.anyOf.length === 0) {
    throw new Error('anyOf must be a non-empty array')
  }

  const subSchemas = schema.anyOf.map((subSchema) => {
    // If the subschema only has a pattern, treat it as a string schema with that pattern
    if (subSchema.pattern && Object.keys(subSchema).length === 1) {
      return parseSchema({ type: 'string', pattern: subSchema.pattern }, options)
    }
    return parseSchema(subSchema, options)
  })
  const unionSchema = `v.union([${subSchemas.join(', ')}])`

  return withDescription(schema, unionSchema, options)
}
