import type { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import type { Options } from '../types.ts'
import { withDefault } from '../utils/withDefault.ts'
import { withDescription } from '../utils/withDescription.ts'

export function parseEnum(schema: JSONSchema4, options: Options = {}): string {
  const values = schema.enum as Array<string | number>
  const picklistSchema = `v.picklist([${values.map((value) => JSON.stringify(value)).join(',')}])`

  const schemaWithType = { ...schema, type: 'string' as JSONSchema4TypeName }
  const baseSchema = withDefault(schemaWithType, picklistSchema, options)

  return withDescription(schema, baseSchema, options)
}
