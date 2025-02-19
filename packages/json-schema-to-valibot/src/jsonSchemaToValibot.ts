import type { JSONSchema4 } from 'json-schema'
import { parseSchema } from './parsers/parseSchema.ts'
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
    return generateEsmExports(schemaCode, options)
  }
  return generateCjsExports(schemaCode, options)
}

function generateEsmExports(schemaCode: string, options: Options): string[] {
  if (options.name) {
    return [`export const ${options.name} = ${schemaCode};`, ...generateTypeExport(options)].filter(
      Boolean,
    )
  }

  return [`export default ${schemaCode};`]
}

function generateTypeExport(options: Options): string[] {
  if (!(options.type && options.name)) {
    return []
  }

  const typeName =
    typeof options.type === 'string'
      ? options.type
      : options.name.charAt(0).toUpperCase() + options.name.slice(1)

  return [`export type ${typeName} = v.Input<typeof ${options.name}>;`]
}

function generateCjsExports(schemaCode: string, options: Options): string[] {
  return options.name
    ? [`module.exports = { ${options.name}: ${schemaCode} };`]
    : [`module.exports = ${schemaCode};`]
}
