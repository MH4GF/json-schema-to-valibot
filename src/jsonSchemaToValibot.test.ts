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

  it('should include defaults', () => {
    const result = jsonSchemaToValibot({
      type: 'string',
      default: 'foo',
    } as JSONSchema4)
    expect(result).toMatchInlineSnapshot(`"v.optional(v.string(), 'foo')"`)
  })

  it('should include falsy defaults', () => {
    const result = jsonSchemaToValibot({
      type: 'string',
      default: '',
    } as JSONSchema4)
    expect(result).toMatchInlineSnapshot(`"v.optional(v.string(), '')"`)
  })

  it('can exclude defaults', () => {
    const result = jsonSchemaToValibot(
      {
        type: 'string',
        default: 'foo',
      } as JSONSchema4,
      { withoutDefaults: true },
    )
    expect(result).toMatchInlineSnapshot(`"v.string()"`)
  })

  it('should include descriptions', () => {
    const result = jsonSchemaToValibot({
      type: 'string',
      description: 'foo',
    } as JSONSchema4)
    expect(result).toMatchInlineSnapshot(`"v.pipe(v.string(), v.description("foo"))"`)
  })

  it('can exclude descriptions', () => {
    const result = jsonSchemaToValibot(
      {
        type: 'string',
        description: 'foo',
      } as JSONSchema4,
      { withoutDescriptions: true },
    )
    expect(result).toMatchInlineSnapshot(`"v.string()"`)
  })

  it('will remove optionality if default is present', () => {
    const result = jsonSchemaToValibot({
      type: 'object',
      properties: {
        prop: {
          type: 'string',
          default: 'def',
        },
      },
    } as JSONSchema4)
    expect(result).toMatchInlineSnapshot(`"v.object({prop: v.optional(v.string(), 'def')})"`)
  })

  it('will handle falsy defaults', () => {
    const result = jsonSchemaToValibot({
      type: 'boolean',
      default: false,
    } as JSONSchema4)
    expect(result).toMatchInlineSnapshot(`"v.optional(v.boolean(), false)"`)
  })

  it('will ignore undefined as default', () => {
    const result = jsonSchemaToValibot({
      type: 'null',
      default: undefined,
    } as JSONSchema4)
    expect(result).toMatchInlineSnapshot(`"v.null()"`)
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

  it('handles both nullable and optional properties', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        name: {
          type: ['string', 'null'],
          optional: true,
        },
      },
    }

    const result = jsonSchemaToValibot(schema)
    expect(result).toMatchInlineSnapshot(`"v.object({name: v.optional(v.nullable(v.string()))})"`)
  })

  it('handles array with null type', () => {
    const schema: JSONSchema4 = {
      type: 'array',
      items: {
        type: ['string', 'null'],
      },
    }

    const result = jsonSchemaToValibot(schema)
    expect(result).toMatchInlineSnapshot(`"v.array(v.nullable(v.string()))"`)
  })

  it('handles unknown types', () => {
    const schema = {
      type: 'unknown',
    } as unknown as JSONSchema4

    expect(() => jsonSchemaToValibot(schema)).toThrow('Unsupported type: unknown')
  })

  it('handles object without properties', () => {
    const schema: JSONSchema4 = {
      type: 'object',
    }

    const result = jsonSchemaToValibot(schema)
    expect(result).toMatchInlineSnapshot(`"v.object({})"`)
  })

  it('should handle description with single quotes', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      description: "A string with 'quotes'",
    }

    const result = jsonSchemaToValibot(schema)
    expect(result).toMatchInlineSnapshot(
      `"v.pipe(v.string(), v.description(\"A string with 'quotes'\"))"`,
    )
  })

  it('should handle description with double quotes', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      description: 'A string with "quotes"',
    }

    const result = jsonSchemaToValibot(schema)
    expect(result).toMatchInlineSnapshot(
      `"v.pipe(v.string(), v.description(\"A string with \\"quotes\\"\"))"`
    )
  })
})
