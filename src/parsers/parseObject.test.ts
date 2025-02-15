import { describe, it, expect } from 'vitest'
import { parseObject } from './parseObject.ts'
import type { JSONSchema4 } from 'json-schema'

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

  it('handles description', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      description: 'test description',
    }
    expect(parseObject(schema, {})).toMatchInlineSnapshot(
      '"v.pipe(v.object({name: v.optional(v.string())}), v.description("test description"))"',
    )
  })
})
