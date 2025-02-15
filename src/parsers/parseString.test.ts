import { describe, it, expect } from 'vitest'
import { parseString } from './parseString.ts'
import type { JSONSchema4 } from 'json-schema'

describe('parseString', () => {
  it('converts basic string schema', () => {
    const schema: JSONSchema4 = { type: 'string' }
    expect(parseString(schema)).toMatchInlineSnapshot('"v.string()"')
  })

  it('handles minLength validation', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      minLength: 3,
    }
    expect(parseString(schema)).toMatchInlineSnapshot('"v.pipe(v.string(), v.minLength(3))"')
  })

  it('handles maxLength validation', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      maxLength: 10,
    }
    expect(parseString(schema)).toMatchInlineSnapshot('"v.pipe(v.string(), v.maxLength(10))"')
  })

  it('handles pattern validation', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      pattern: '^[a-z]+$',
    }
    expect(parseString(schema)).toMatchInlineSnapshot('"v.pipe(v.string(), v.regex(/^[a-z]+$/))"')
  })

  it('handles description', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      description: 'test description',
    }
    expect(parseString(schema)).toMatchInlineSnapshot(
      '"v.pipe(v.string(), v.description("test description"))"',
    )
  })

  it('ignores description when withoutDescriptions is true', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      description: 'test description',
    }
    expect(parseString(schema, { withoutDescriptions: true })).toMatchInlineSnapshot('"v.string()"')
  })

  it('handles default value', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      default: 'test',
    }
    expect(parseString(schema)).toMatchInlineSnapshot('"v.optional(v.string(), \'test\')"')
  })

  it('combines multiple validations', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      minLength: 3,
      maxLength: 10,
      pattern: '^[a-z]+$',
      description: 'test description',
    }
    expect(parseString(schema)).toMatchInlineSnapshot(
      '"v.pipe(v.string(), v.minLength(3), v.maxLength(10), v.regex(/^[a-z]+$/), v.description("test description"))"',
    )
  })
})
