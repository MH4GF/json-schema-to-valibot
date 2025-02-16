import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseObject } from './parseObject.ts'

describe('parseObject', () => {
  it('converts empty object schema', () => {
    const schema: JSONSchema4 = { type: 'object' }
    expect(parseObject(schema, {})).toMatchInlineSnapshot('"v.object({})"')
  })

  it('converts object schema with properties', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
    }
    expect(parseObject(schema, {})).toMatchInlineSnapshot(
      '"v.object({name: v.optional(v.string()),age: v.optional(v.number())})"',
    )
  })

  it('handles required properties', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name'],
    }
    expect(parseObject(schema, {})).toMatchInlineSnapshot(
      '"v.object({name: v.string(),age: v.optional(v.number())})"',
    )
  })

  it('handles property names with hyphens', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        'shared-node-browser': { type: 'boolean' },
        normalName: { type: 'string' },
      },
    }
    expect(parseObject(schema, {})).toMatchInlineSnapshot(
      '"v.object({"shared-node-browser": v.optional(v.boolean()),normalName: v.optional(v.string())})"',
    )
  })
})
