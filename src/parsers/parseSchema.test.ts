import type { JSONSchema4, JSONSchema4TypeName } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseSchema } from './parseSchema.ts'

describe('parseSchema', () => {
  it('handles schema without type', () => {
    const schema: JSONSchema4 = {}
    expect(parseSchema(schema, {})).toMatchInlineSnapshot('"v.any()"')
  })

  it('handles nullable types', () => {
    const schema: JSONSchema4 = {
      type: ['null', 'string'],
    }
    expect(parseSchema(schema, {})).toMatchInlineSnapshot('"v.nullable(v.string())"')
  })

  it('handles union types', () => {
    const schema: JSONSchema4 = {
      type: ['string', 'number'],
    }
    expect(parseSchema(schema, {})).toMatchInlineSnapshot('"v.union([v.string(), v.number()])"')
  })

  it('throws error for unsupported type', () => {
    const schema: JSONSchema4 = { type: 'invalid' as JSONSchema4TypeName }
    expect(() => parseSchema(schema, {})).toThrow('Unsupported type: invalid')
  })
})
