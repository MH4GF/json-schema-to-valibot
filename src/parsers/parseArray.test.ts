import { describe, it, expect } from 'vitest'
import { parseArray } from './parseArray.ts'
import type { JSONSchema4 } from 'json-schema'

describe('parseArray', () => {
  it('converts basic array schema without items', () => {
    const schema: JSONSchema4 = { type: 'array' }
    expect(parseArray(schema, {})).toMatchInlineSnapshot('"v.array(v.any())"')
  })

  it('converts array schema with string items', () => {
    const schema: JSONSchema4 = {
      type: 'array',
      items: { type: 'string' },
    }
    expect(parseArray(schema, {})).toMatchInlineSnapshot('"v.array(v.string())"')
  })

  it('converts array schema with number items', () => {
    const schema: JSONSchema4 = {
      type: 'array',
      items: { type: 'number' },
    }
    expect(parseArray(schema, {})).toMatchInlineSnapshot('"v.array(v.number())"')
  })
})
