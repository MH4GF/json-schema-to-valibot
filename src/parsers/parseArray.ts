import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { parseSchema } from './parseSchema.ts'

export function parseArray(schema: JSONSchema4, options: Options): string {
  if (!schema.items) {
    return 'v.array(v.any())'
  }

  return `v.array(${parseSchema(schema.items, options)})`
}
