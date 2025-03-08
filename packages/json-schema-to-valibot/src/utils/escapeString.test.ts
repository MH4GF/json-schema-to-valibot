import { describe, expect, it } from 'vitest'
import { escapeString } from './escapeString.js'

describe('escapeString', () => {
  it('should return empty string for null', () => {
    expect(escapeString(null)).toBe('')
  })

  it('should return empty string for undefined', () => {
    expect(escapeString(undefined)).toBe('')
  })

  it('should escape backslashes', () => {
    expect(escapeString('path\\to\\file')).toBe('path\\\\to\\\\file')
  })

  it('should escape double quotes', () => {
    expect(escapeString('hello "world"')).toBe('hello \\"world\\"')
  })

  it('should escape both backslashes and quotes', () => {
    expect(escapeString('path\\to\\"file"')).toBe('path\\\\to\\\\\\"file\\"')
  })

  it('should convert numbers to strings', () => {
    expect(escapeString(123)).toBe('123')
  })

  it('should convert booleans to strings', () => {
    expect(escapeString(true)).toBe('true')
    expect(escapeString(false)).toBe('false')
  })

  it('should convert objects to strings', () => {
    expect(escapeString({ foo: 'bar' })).toBe('[object Object]')
  })
})
