import type { JSONSchema4 } from 'json-schema'
import type { Options } from '../types.ts'
import { escapeString } from '../utils/escapeString.ts'
import { withDefault } from '../utils/withDefault.ts'

const formatValidations: Record<string, string> = {
  date: 'v.isoDate()',
  time: 'v.regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)',
  'date-time': 'v.isoDateTime()',
  duration:
    'v.regex(/^P(?!$)(\\d+Y)?(\\d+M)?(\\d+W)?(\\d+D)?(T(?=\\d)(\\d+H)?(\\d+M)?(\\d+S)?)?$/)',
  email: 'v.email()',
  'idn-email': 'v.email()',
  hostname:
    'v.regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)',
  'idn-hostname':
    'v.regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)',
  ipv4: 'v.ipv4()',
  ipv6: 'v.ipv6()',
  uri: 'v.url()',
  'uri-reference': 'v.url()',
  iri: 'v.url()',
  'iri-reference': 'v.url()',
  uuid: 'v.uuid()',
  'json-pointer': 'v.regex(/^(?:\\/(?:[^~\\/]|~0|~1)*)*$/)',
  'relative-json-pointer': 'v.regex(/^(?:0|[1-9][0-9]*)(?:#|(?:\\/(?:[^~\\/]|~0|~1)*)*)$/)',
  regex: 'v.regex(/^(\\/)(.*)(\\/)([gimuy]*)$/)',
}

export function parseString(schema: JSONSchema4, options: Options = {}): string {
  const validations: string[] = ['v.string()']

  if (typeof schema.minLength === 'number') {
    validations.push(`v.minLength(${schema.minLength})`)
  }

  if (typeof schema.maxLength === 'number') {
    validations.push(`v.maxLength(${schema.maxLength})`)
  }

  if (typeof schema.pattern === 'string') {
    const escapedPattern = schema.pattern.replace(/\//g, '\\/')
    validations.push(`v.regex(/${escapedPattern}/)`)
  }

  if (schema.format) {
    const formatValidation = formatValidations[schema.format]
    if (formatValidation) {
      validations.push(formatValidation)
    }
  }

  if (!options.withoutDescriptions && schema.description) {
    validations.push(`v.description("${escapeString(schema.description)}")`)
  }

  const baseValidation = validations.length > 1 ? `v.pipe(${validations.join(', ')})` : 'v.string()'
  return withDefault(schema, baseValidation, options)
}
