import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { withDefault } from './withDefault.ts'

describe('withDefault', () => {
  it('returns base schema when no default value is provided', () => {
    const schema: JSONSchema4 = { type: 'string' }
    expect(withDefault(schema, 'v.string()')).toBe('v.string()')
  })

  it('handles string default values correctly', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      default: 'test',
    }
    expect(withDefault(schema, 'v.string()')).toBe("v.optional(v.string(), 'test')")
  })

  it('handles numeric default values correctly', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 42,
    }
    expect(withDefault(schema, 'v.number()')).toBe('v.optional(v.number(), 42)')
  })

  it('converts string default to number for numeric enums', () => {
    const schema: JSONSchema4 = {
      enum: [3, 5, 6],
      default: '5',
    }
    expect(withDefault(schema, 'v.picklist([3, 5, 6])')).toBe(
      'v.optional(v.picklist([3, 5, 6]), 5)',
    )
  })

  it('preserves string values for string enums', () => {
    const schema: JSONSchema4 = {
      enum: ['a', 'b', 'c'],
      default: 'b',
    }
    expect(withDefault(schema, "v.picklist(['a', 'b', 'c'])")).toBe(
      "v.optional(v.picklist(['a', 'b', 'c']), 'b')",
    )
  })

  it('handles boolean defaults correctly', () => {
    const stringSchema: JSONSchema4 = {
      type: 'boolean',
      default: 'false',
    }
    expect(withDefault(stringSchema, 'v.boolean()')).toBe('v.optional(v.boolean(), false)')

    const nativeSchema: JSONSchema4 = {
      type: 'boolean',
      default: true,
    }
    expect(withDefault(nativeSchema, 'v.boolean()')).toBe('v.optional(v.boolean(), true)')
  })

  it('returns base schema when withoutDefaults option is true', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 42,
    }
    expect(withDefault(schema, 'v.number()', { withoutDefaults: true })).toBe('v.number()')
  })

  it('handles default value of 0 correctly', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 0,
    }
    expect(withDefault(schema, 'v.number()')).toBe('v.optional(v.number(), 0)')
  })
})
