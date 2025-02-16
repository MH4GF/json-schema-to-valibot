import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { parseArray } from './parseArray.ts'

describe('parseArray', () => {
  it('converts basic array schema', () => {
    const schema: JSONSchema4 = {
      type: 'array',
      items: {
        type: 'string',
      },
    }
    expect(parseArray(schema, {})).toMatchInlineSnapshot(`"v.array(v.string())"`)
  })

  it('converts array schema without items', () => {
    const schema: JSONSchema4 = {
      type: 'array',
    }
    expect(parseArray(schema, {})).toMatchInlineSnapshot(`"v.array(v.any())"`)
  })
})
