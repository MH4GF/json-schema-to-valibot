import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { parseArray } from './parseArray.ts'
import { parseBoolean } from './parseBoolean.ts'
import { parseEnum } from './parseEnum.ts'
import { parseNumber } from './parseNumber.ts'
import { parseObject } from './parseObject.ts'
import { parseString } from './parseString.ts'

export function parseSchema(schema: JSONSchema4, options: Options): string {
  if (Array.isArray(schema.enum)) {
    return parseEnum(schema, options)
  }

  if (!schema.type) {
    return 'v.any()'
  }

  if (Array.isArray(schema.type)) {
    if (schema.type.includes('null')) {
      const types = schema.type.filter((t) => t !== 'null')
      if (types.length === 1) {
        return `v.nullable(${parseSchema({ ...schema, type: types[0] }, options)})`
      }
    }
    return `v.union([${schema.type
      .map((t) => parseSchema({ ...schema, type: t }, options))
      .join(', ')}])`
  }

  switch (schema.type) {
    case 'string':
      return parseString(schema, options)
    case 'number':
      return parseNumber(schema, options)
    case 'boolean':
      return parseBoolean(schema, options)
    case 'null':
      return 'v.null()'
    case 'object':
      return parseObject(schema, options)
    case 'array':
      return parseArray(schema, options)
    default:
      throw new Error(`Unsupported type: ${schema.type}`)
  }
}
