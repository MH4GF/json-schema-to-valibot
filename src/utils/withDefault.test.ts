import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { withDefault } from './withDefault.ts'

describe('withDefault', () => {
  it('returns base schema when no default value is provided', () => {
    const schema: JSONSchema4 = { type: 'number' }
    expect(withDefault(schema, 'v.number()')).toMatchInlineSnapshot('"v.number()"')
  })

  it('wraps schema with optional when default value is provided', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 42,
    }
    expect(withDefault(schema, 'v.number()')).toMatchInlineSnapshot('"v.optional(v.number(), 42)"')
  })

  it('returns base schema when withoutDefaults option is true', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 42,
    }
    expect(withDefault(schema, 'v.number()', { withoutDefaults: true })).toMatchInlineSnapshot(
      '"v.number()"',
    )
  })

  it('handles default value of 0 correctly', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 0,
    }
    expect(withDefault(schema, 'v.number()')).toMatchInlineSnapshot('"v.optional(v.number(), 0)"')
  })

  it('works with different base schemas', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      default: 'test',
    }
    expect(withDefault(schema, 'v.string()')).toMatchInlineSnapshot(
      '"v.optional(v.string(), \'test\')"',
    )
  })
})
