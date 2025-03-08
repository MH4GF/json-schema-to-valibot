import { describe, expect, it } from 'vitest'
import { formatJsDoc } from './formatJsDoc.ts'

describe('formatJsDoc', () => {
  it('should format single line description', () => {
    const description = 'Description for prop'
    expect(formatJsDoc(description)).toMatchInlineSnapshot(`
      "/**Description for prop*/
      "
    `)
  })

  it('should format multi-line description', () => {
    const description = 'Description for object that is multiline\nMore content\n\nAnd whitespace'
    expect(formatJsDoc(description)).toMatchInlineSnapshot(`
      "/**
       * Description for object that is multiline
       * More content
       *  
       * And whitespace
       */
      "
    `)
  })

  it('should handle empty description', () => {
    expect(formatJsDoc('')).toMatchInlineSnapshot(`
      "/**/
      "
    `)
  })

  it('should handle description with special characters', () => {
    const description = 'Description with * and / characters'
    expect(formatJsDoc(description)).toMatchInlineSnapshot(
      `
      "/**Description with * and / characters*/
      "
    `,
    )
  })
})
