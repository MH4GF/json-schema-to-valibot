import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { jsonSchemaToValibot } from './jsonSchemaToValibot.js'

describe('jsonSchemaToValibot', () => {
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
})
