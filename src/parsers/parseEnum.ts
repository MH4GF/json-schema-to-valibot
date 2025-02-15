import type { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import type { Options } from '../types.ts'
import { withDefault } from '../utils/withDefault.ts'
import { escapeString } from '../utils/escapeString.ts'

export function parseEnum(schema: JSONSchema4, options: Options): string {
  const picklistSchema = `v.picklist(${JSON.stringify(schema.enum)})`

  const schemaWithType = { ...schema, type: 'string' as JSONSchema4TypeName }
  const baseSchema = withDefault(schemaWithType, picklistSchema, options)

  if (!options.withoutDescriptions && schema.description) {
    return `v.pipe(${baseSchema}, v.description("${escapeString(schema.description)}"))`
  }

  return baseSchema
}
