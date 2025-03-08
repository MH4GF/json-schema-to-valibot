import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { jsonSchemaToValibot } from './jsonSchemaToValibot.js'

describe('jsonSchemaToValibot', () => {
  describe('depth option', () => {
    const nestedObject = {
      type: 'object',
      properties: {
        level1: {
          type: 'object',
          properties: {
            level2: {
              type: 'object',
              properties: {
                level3: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    } as JSONSchema4

    it('should parse full depth when depth is not set', () => {
      const result = jsonSchemaToValibot(nestedObject)
      expect(result).toMatchInlineSnapshot(
        `"v.object({level1: v.optional(v.object({level2: v.optional(v.object({level3: v.optional(v.string())}))}))})"`,
      )
    })

    it('should limit parsing to specified depth', () => {
      const result = jsonSchemaToValibot(nestedObject, { depth: 1 })
      expect(result).toMatchInlineSnapshot(`"v.object({level1: v.optional(v.any())})"`)
    })

    it('should use v.any() at max depth', () => {
      const result = jsonSchemaToValibot(nestedObject, { depth: 2 })
      expect(result).toMatchInlineSnapshot(
        `"v.object({level1: v.optional(v.object({level2: v.optional(v.any())}))})"`,
      )
    })
  })

  const myObject = {
    type: 'object',
    properties: {
      hello: {
        type: 'string',
      },
    },
  } as JSONSchema4

  it('should generate just schema', () => {
    const result = jsonSchemaToValibot(myObject)
    expect(result).toMatchInlineSnapshot(`"v.object({hello: v.optional(v.string())})"`)
  })

  it('should generate ESM module', () => {
    const result = jsonSchemaToValibot(myObject, { module: 'esm' })
    expect(result).toMatchInlineSnapshot(`
      "import * as v from "valibot";

      export default v.object({hello: v.optional(v.string())});"
    `)
  })

  it('should generate ESM module with name', () => {
    const result = jsonSchemaToValibot(myObject, { module: 'esm', name: 'mySchema' })
    expect(result).toMatchInlineSnapshot(`
      "import * as v from "valibot";

      export const mySchema = v.object({hello: v.optional(v.string())});"
    `)
  })

  it('should generate ESM module with type', () => {
    const result = jsonSchemaToValibot(myObject, {
      name: 'mySchema',
      module: 'esm',
      type: true,
    })
    expect(result).toMatchInlineSnapshot(`
      "import * as v from "valibot";

      export const mySchema = v.object({hello: v.optional(v.string())});
      export type MySchema = v.Input<typeof mySchema>;"
    `)
  })

  it('should generate CJS module', () => {
    const result = jsonSchemaToValibot(myObject, {
      module: 'cjs',
      name: 'mySchema',
    })
    expect(result).toMatchInlineSnapshot(`
      "const v = require("valibot");

      module.exports = { mySchema: v.object({hello: v.optional(v.string())}) };"
    `)
  })

  it('should throw when given module cjs and type', () => {
    expect(() =>
      jsonSchemaToValibot({ type: 'string' } as JSONSchema4, {
        name: 'hello',
        module: 'cjs',
        type: true,
      }),
    ).toThrow()
  })

  it('should throw when given type but no name', () => {
    expect(() =>
      jsonSchemaToValibot({ type: 'string' } as JSONSchema4, {
        module: 'esm',
        type: true,
      }),
    ).toThrow()
  })

  it('should generate ESM module with custom type name', () => {
    const result = jsonSchemaToValibot(myObject, {
      name: 'mySchema',
      module: 'esm',
      type: 'CustomType',
    })
    expect(result).toMatchInlineSnapshot(`
      "import * as v from "valibot";

      export const mySchema = v.object({hello: v.optional(v.string())});
      export type CustomType = v.Input<typeof mySchema>;"
    `)
  })

  it('should generate module without imports', () => {
    const result = jsonSchemaToValibot(myObject, {
      module: 'esm',
      noImport: true,
    })
    expect(result).toMatchInlineSnapshot(`
      "export default v.object({hello: v.optional(v.string())});"
    `)
  })

  it('should generate default CJS module export', () => {
    const result = jsonSchemaToValibot(myObject, {
      module: 'cjs',
    })
    expect(result).toMatchInlineSnapshot(`
      "const v = require("valibot");

      module.exports = v.object({hello: v.optional(v.string())});"
    `)
  })
})
