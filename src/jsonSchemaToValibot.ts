import type { JSONSchema4 } from 'json-schema'
import type { Options } from './types.ts'

export function jsonSchemaToValibot(schema: JSONSchema4, options: Options = {}) {
  const schemaCode = parseSchema(schema)
  return generateModule(schemaCode, options)
}

function generateModule(schemaCode: string, options: Options = {}): string {
  if (options.module === 'none' || !options.module) {
    return schemaCode
  }

  const lines = generateImports(options)
  const exportLines = generateExports(schemaCode, options)

  return [...lines, ...exportLines].join('\n')
}

function generateImports(options: Options): string[] {
  if (options.noImport) {
    return []
  }

  const importLine =
    options.module === 'esm' ? 'import * as v from "valibot";' : 'const v = require("valibot");'

  return [importLine, '']
}

function generateExports(schemaCode: string, options: Options): string[] {
  if (options.module === 'esm') {
    if (options.type && options.name) {
      const typeName =
        typeof options.type === 'string'
          ? options.type
          : options.name.charAt(0).toUpperCase() + options.name.slice(1)

      return [
        `export const ${options.name} = ${schemaCode};`,
        `export type ${typeName} = v.Input<typeof ${options.name}>;`,
      ]
    }
    return [`export default ${schemaCode};`]
  }

  return options.name
    ? [`module.exports = { ${options.name}: ${schemaCode} };`]
    : [`module.exports = ${schemaCode};`]
}

function parseSchema(schema: JSONSchema4): string {
  if (!schema.type) {
    return 'v.any()'
  }

  switch (schema.type) {
    case 'string':
      return 'v.string()'
    case 'number':
      return 'v.number()'
    case 'boolean':
      return 'v.boolean()'
    case 'null':
      return 'v.null()'
    case 'object':
      return parseObject(schema)
    case 'array':
      return parseArray(schema)
    default:
      return 'v.any()'
  }
}

function parseObject(schema: JSONSchema4): string {
  if (!schema.properties) {
    return 'v.object({})'
  }

  const required = new Set(Array.isArray(schema.required) ? schema.required : [])
  const properties = Object.entries(schema.properties)
    .map(([key, value]) => {
      const parsed = parseSchema(value)
      return `${key}: ${required.has(key) ? parsed : `v.optional(${parsed})`}`
    })
    .join(',')

  return `v.object({${properties}})`
}

function parseArray(schema: JSONSchema4): string {
  if (!schema.items) {
    return 'v.array(v.any())'
  }

  return `v.array(${parseSchema(schema.items)})`
}
