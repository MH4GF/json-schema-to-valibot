import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { withDefault } from '../utils/withDefault.ts'
import { withDescription } from '../utils/withDescription.ts'

export function parseEnum(schema: JSONSchema4, options: Options = {}): string {
  const literals =
    schema.enum?.map((value) => {
      if (value === null) {
        return 'v.null()'
      }
      return `v.literal(${JSON.stringify(value)})`
    }) ?? []

  const unionSchema = `v.union([${literals.join(',')}])`
  const baseSchema = withDefault(schema, unionSchema, options)

  return withDescription(schema, baseSchema, options)
}
