import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDescription } from '../utils/withDescription.ts'
import { parseSchema } from './parseSchema.ts'

export function parseArray(schema: JSONSchema4, options: Options = {}, currentDepth = 0): string {
  if (options.depth !== undefined && currentDepth >= options.depth) {
    return withDescription(schema, 'v.array(v.any())', options)
  }

  if (!schema.items) {
    return withDescription(schema, 'v.array(v.any())', options)
  }

  const items = schema.items as JSONSchema4
  const itemsSchema = parseSchema(items, options, currentDepth + 1)
  const arraySchema = `v.array(${itemsSchema})`

  return withDescription(schema, arraySchema, options)
}
