import { describe, it, expect } from 'vitest'
import { parseNumber } from './parseNumber.ts'
import type { JSONSchema4 } from 'json-schema'

describe('parseNumber', () => {
  it('converts basic number schema', () => {
    const schema: JSONSchema4 = { type: 'number' }
    expect(parseNumber(schema)).toMatchInlineSnapshot('"v.number()"')
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
})
