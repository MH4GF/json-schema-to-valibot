import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDefault } from '../utils/withDefault.ts'

export function parseNumber(schema: JSONSchema4, options: Options = {}): string {
  const baseSchema = schema.type === 'integer' ? 'v.pipe(v.number(), v.integer())' : 'v.number()'

  return withDefault(schema, baseSchema, options)
}
