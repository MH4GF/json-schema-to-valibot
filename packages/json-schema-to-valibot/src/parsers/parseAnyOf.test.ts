import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseAnyOf } from './parseAnyOf.ts'

describe('parseAnyOf', () => {
  it('converts basic anyOf schema', () => {
    const schema: JSONSchema4 = {
      anyOf: [{ type: 'string' }, { type: 'number' }],
    }
    expect(parseAnyOf(schema, {})).toMatchInlineSnapshot('"v.union([v.string(), v.number()])"')
  })

  it('handles nested anyOf schemas', () => {
    const schema: JSONSchema4 = {
      anyOf: [
        { type: 'string' },
        {
          anyOf: [{ type: 'number' }, { type: 'boolean' }],
        },
      ],
    }
    expect(parseAnyOf(schema, {})).toMatchInlineSnapshot(
      '"v.union([v.string(), v.union([v.number(), v.boolean()])])"',
    )
  })

  it('throws error for empty anyOf array', () => {
    const schema: JSONSchema4 = {
      anyOf: [],
    }
    expect(() => parseAnyOf(schema, {})).toThrow('anyOf must be a non-empty array')
  })

  it('handles anyOf with description', () => {
    const schema: JSONSchema4 = {
      anyOf: [{ type: 'string' }, { type: 'number' }],
      description: 'A string or number value',
    }
    expect(parseAnyOf(schema, {})).toMatchInlineSnapshot(
      `"v.pipe(v.union([v.string(), v.number()]), v.description("A string or number value"))"`,
    )
  })
})
