import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseNumber } from './parseNumber.ts'

describe('parseNumber', () => {
  it('converts basic number schema', () => {
    const schema: JSONSchema4 = { type: 'number' }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.number()"')
  })

  it('converts integer schema', () => {
    const schema: JSONSchema4 = { type: 'integer' }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.pipe(v.number(), v.integer())"')
  })

  it('handles minimum validation', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      minimum: 0,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.pipe(v.number(), v.minValue(0))"')
  })

  it('handles maximum validation', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      maximum: 100,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.pipe(v.number(), v.maxValue(100))"')
  })

  it('handles exclusive minimum validation', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      minimum: 0,
      exclusiveMinimum: true,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.pipe(v.number(), v.minValue(1))"')
  })

  it('handles exclusive maximum validation', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      maximum: 100,
      exclusiveMaximum: true,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.pipe(v.number(), v.maxValue(99))"')
  })

  it('handles multiple of validation', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      multipleOf: 5,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.pipe(v.number(), v.multipleOf(5))"')
  })

  it('combines multiple validations', () => {
    const schema: JSONSchema4 = {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      multipleOf: 5,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot(
      '"v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(100), v.multipleOf(5))"',
    )
  })

  it('converts number schema with default value', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 42,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.optional(v.number(), 42)"')
  })

  it('ignores default value when withoutDefaults option is enabled', () => {
    const schema: JSONSchema4 = {
      type: 'number',
      default: 42,
    }
    expect(parseNumber(schema, { withoutDefaults: true })).toMatchInlineSnapshot('"v.number()"')
  })

  it('handles integer with default value', () => {
    const schema: JSONSchema4 = {
      type: 'integer',
      default: 42,
    }
    expect(parseNumber(schema)).toMatchInlineSnapshot(
      '"v.optional(v.pipe(v.number(), v.integer()), 42)"',
    )
  })
})
