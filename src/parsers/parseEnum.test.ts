import { describe, it, expect } from 'vitest'
import { parseEnum } from './parseEnum.ts'
import type { JSONSchema4 } from 'json-schema'

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
    expect(parseEnum(schema, {})).toMatchInlineSnapshot('"v.optional(v.picklist(["a","b","c"]), \'a\')"')
  })

  it('handles description', () => {
    const schema: JSONSchema4 = {
      enum: ['a', 'b', 'c'],
      description: 'test description',
    }
    expect(parseEnum(schema, {})).toMatchInlineSnapshot(
      '"v.pipe(v.picklist(["a","b","c"]), v.description("test description"))"',
    )
  })
})