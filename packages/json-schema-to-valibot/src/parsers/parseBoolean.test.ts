import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseBoolean } from './parseBoolean.ts'

describe('parseBoolean', () => {
  it('converts basic boolean schema', () => {
    const schema: JSONSchema4 = { type: 'boolean' }
    expect(parseBoolean(schema)).toMatchInlineSnapshot('"v.boolean()"')
  })

  it('handles default value', () => {
    const schema: JSONSchema4 = {
      type: 'boolean',
      default: true,
    }
    expect(parseBoolean(schema)).toMatchInlineSnapshot('"v.optional(v.boolean(), true)"')
  })

  it('ignores default when withoutDefaults is true', () => {
    const schema: JSONSchema4 = {
      type: 'boolean',
      default: false,
    }
    expect(parseBoolean(schema, { withoutDefaults: true })).toMatchInlineSnapshot('"v.boolean()"')
  })
})
