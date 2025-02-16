import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { parseAnyOf } from './parseAnyOf.ts'
import { parseArray } from './parseArray.ts'
import { parseBoolean } from './parseBoolean.ts'
import { parseEnum } from './parseEnum.ts'
import { parseNumber } from './parseNumber.ts'
import { parseObject } from './parseObject.ts'
import { parseString } from './parseString.ts'

export function parseSchema(schema: JSONSchema4, options: Options): string {
  let baseSchema: string | undefined

  if (Array.isArray(schema.enum)) {
    baseSchema = parseEnum(schema, options)
  } else if (Array.isArray(schema.type)) {
    if (schema.type.includes('null')) {
      const types = schema.type.filter((t) => t !== 'null')
      if (types.length === 1) {
        return `v.nullable(${parseSchema({ ...schema, type: types[0] }, options)})`
      }
    }
    baseSchema = `v.union([${schema.type
      .map((t) => parseSchema({ ...schema, type: t }, options))
      .join(', ')}])`
  } else if (schema.type) {
    switch (schema.type) {
      case 'string':
        baseSchema = parseString(schema, options)
        break
      case 'number':
      case 'integer':
        baseSchema = parseNumber(schema, options)
        break
      case 'boolean':
        baseSchema = parseBoolean(schema, options)
        break
      case 'null':
        baseSchema = 'v.null()'
        break
      case 'object':
        baseSchema = parseObject(schema, options)
        break
      case 'array':
        baseSchema = parseArray(schema, options)
        break
      default:
        throw new Error(`Unsupported type: ${schema.type}`)
    }
  }

  if (Array.isArray(schema.anyOf)) {
    if (baseSchema) {
      return `v.intersect([${baseSchema}, ${parseAnyOf(schema, options)}])`
    }
    return parseAnyOf(schema, options)
  }

  return baseSchema || 'v.any()'
}
