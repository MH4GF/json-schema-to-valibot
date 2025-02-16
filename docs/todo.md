# JSON Schema Support Status

## Basic Data Types

- [x] string
- [x] number
- [x] integer
- [x] boolean
- [x] null
- [x] array
- [x] object

## Validation

- [x] minimum/maximum (numbers)
- [x] exclusiveMinimum/exclusiveMaximum (numbers)
- [x] multipleOf (numbers)
- [x] minLength/maxLength (strings)
- [x] pattern (strings)
- [x] required (objects)
- [ ] dependencies (objects)
- [ ] propertyNames (objects)
- [ ] minProperties/maxProperties (objects)
- [ ] additionalProperties (objects)
- [ ] patternProperties (objects)
- [x] minItems/maxItems (arrays)
- [ ] uniqueItems (arrays)
- [ ] contains (arrays)
- [ ] additionalItems (arrays)

## Schema Composition

- [x] enum
- [x] type (single)
- [x] type (multiple)
- [ ] allOf
- [ ] anyOf
- [ ] oneOf
- [ ] not
- [x] definitions
- [x] $ref

## Metadata

- [x] title
- [x] description
- [x] default
- [ ] examples
- [ ] readOnly
- [ ] writeOnly
- [ ] deprecated

## String Formats

- [x] date
- [x] time
- [x] date-time
- [x] duration
- [x] email
- [x] idn-email
- [x] hostname
- [x] idn-hostname
- [x] ipv4
- [x] ipv6
- [x] uri
- [x] uri-reference
- [x] iri
- [x] iri-reference
- [x] uuid
- [x] json-pointer
- [x] relative-json-pointer
- [x] regex

## Conditional Subschemas

- [ ] if/then/else
- [ ] dependentSchemas
- [ ] dependentRequired

## Miscellaneous

- [ ] contentMediaType
- [ ] contentEncoding
- [ ] $comment
- [ ] $id
- [ ] $schema
