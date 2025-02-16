import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseEnum } from './parseEnum.ts'

describe('parseEnum', () => {
  it('converts mixed type array', () => {
    const schema: JSONSchema4 = {
      enum: ['a', 1, true, null],
    }
    expect(parseEnum(schema, {})).toMatchInlineSnapshot(
      `"v.union([v.literal("a"),v.literal(1),v.literal(true),v.null()])"`,
    )
  })

  it('handles default value', () => {
    const schema: JSONSchema4 = {
      enum: ['a', 1, true, null],
      default: 'a',
    }
    expect(parseEnum(schema, {})).toMatchInlineSnapshot(
      `"v.optional(v.union([v.literal("a"),v.literal(1),v.literal(true),v.null()]), 'a')"`,
    )
  })
})
