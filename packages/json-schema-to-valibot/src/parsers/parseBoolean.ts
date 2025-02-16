import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDefault } from '../utils/withDefault.ts'

export function parseBoolean(schema: JSONSchema4, options: Options = {}): string {
  return withDefault(schema, 'v.boolean()', options)
}
