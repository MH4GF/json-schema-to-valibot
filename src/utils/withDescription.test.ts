import type { JSONSchema4 } from 'json-schema'
import { describe, expect, it } from 'vitest'
import { withDescription } from './withDescription.ts'

describe('withDescription', () => {
  it('adds description to schema', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      description: "This helps people discover your package as it's listed in 'npm search'.",
    }
    expect(withDescription(schema, 'v.string()', {})).toMatchInlineSnapshot(
      `"v.pipe(v.string(), v.description("This helps people discover your package as it's listed in 'npm search'."))"`,
    )
  })

  it('returns original schema when no description', () => {
    const schema: JSONSchema4 = {
      type: 'string',
    }
    expect(withDescription(schema, 'v.string()', {})).toMatchInlineSnapshot(`"v.string()"`)
  })

  it('returns original schema when withoutDescriptions option is true', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      description: 'Some description',
    }
    expect(
      withDescription(schema, 'v.string()', { withoutDescriptions: true }),
    ).toMatchInlineSnapshot(`"v.string()"`)
  })

  it('escapes double quotes in description', () => {
    const schema: JSONSchema4 = {
      type: 'string',
      description: 'Note that the "typings" field is synonymous with "types".',
    }
    expect(withDescription(schema, 'v.string()', {})).toMatchInlineSnapshot(
      `"v.pipe(v.string(), v.description("Note that the \\"typings\\" field is synonymous with \\"types\\"."))"`,
    )
  })
})
