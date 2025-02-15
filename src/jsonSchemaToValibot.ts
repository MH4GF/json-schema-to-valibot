import type { JSONSchema4 } from 'json-schema'
import type { Options } from './types.ts'

export function jsonSchemaToValibot(schema: JSONSchema4, options: Options = {}) {
  if (options.type && (!options.name || options.module !== 'esm')) {
    throw new Error('Option `type` requires `name` to be set and `module` to be `esm`')
  }

  const schemaCode = parseSchema(schema, options)
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

function parseSchema(schema: JSONSchema4, options: Options): string {
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
    return `v.union([${schema.type.map((t) => parseSchema({ ...schema, type: t }, options)).join(', ')}])`
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

function parseString(schema: JSONSchema4, options: Options = {}): string {
  if (!options.withoutDefaults && schema.default !== undefined) {
    return `v.optional(v.string(), '${schema.default}')`
  }

  if (!options.withoutDescriptions && schema.description) {
    return `v.pipe(v.string(), v.description('${schema.description}'))`
  }

  return 'v.string()'
}

function parseNumber(schema: JSONSchema4, options: Options = {}): string {
  if (!options.withoutDefaults && schema.default !== undefined) {
    return `v.optional(v.number(), ${schema.default})`
  }
  return 'v.number()'
}

function parseBoolean(schema: JSONSchema4, options: Options = {}): string {
  if (!options.withoutDefaults && schema.default !== undefined) {
    return `v.optional(v.boolean(), ${schema.default})`
  }
  return 'v.boolean()'
}

function parseObject(schema: JSONSchema4, options: Options): string {
  if (!schema.properties) {
    return 'v.object({})'
  }

  const required = new Set(Array.isArray(schema.required) ? schema.required : [])
  const properties = Object.entries(schema.properties)
    .map(([key, value]) => {
      const parsed = parseSchema(value, options)
      if (!options.withoutDefaults && value.default !== undefined) {
        return `${key}: v.optional(v.string(), '${value.default}')`
      }
      return `${key}: ${required.has(key) ? parsed : `v.optional(${parsed})`}`
    })
    .join(',')

  return `v.object({${properties}})`
}

function parseArray(schema: JSONSchema4, options: Options): string {
  if (!schema.items) {
    return 'v.array(v.any())'
  }

  return `v.array(${parseSchema(schema.items, options)})`
}
