import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseEnum } from './parseEnum.ts'

describe('parseEnum', () => {
  it('converts basic enum schema', () => {
    const schema: JSONSchema4 = {
      enum: ['a', 'b', 'c'],
    }
    expect(parseEnum(schema, {})).toMatchInlineSnapshot('"v.picklist(["a","b","c"])"')
  })

  it('handles default value', () => {
    const schema: JSONSchema4 = {
      enum: ['a', 'b', 'c'],
      default: 'a',
    }
    expect(parseEnum(schema, {})).toMatchInlineSnapshot(
      '"v.optional(v.picklist(["a","b","c"]), \'a\')"',
    )
  })
})
