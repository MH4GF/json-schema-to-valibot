# Technical Specifications and Guidelines

This document outlines the overall technical policies and design guidelines for converting JSON Schema into Valibot-type definitions within a TypeScript/Node.js-based CLI tool.

## Overview

- **CLI (cli.ts)**

  - Uses `commander` to parse CLI options, receive input sources (files or stdin), and then executes the conversion logic after reading the JSON Schema.
  - Outputs the conversion result (Valibot code) to a specified file or to stdout.

- **Conversion Core (jsonSchemaToValibot.ts)**

  - Receives JSON Schema from the CLI, calls various parsers such as `parseSchema.ts`, and generates code for Valibot.
  - Offers options for module format (ESM / CJS / none), handling default values, adding JSDoc comments, etc.

- **Schema Parsers (src/parsers)**

  - Centered around `parseSchema.ts`, which dispatches JSON Schema `type` to methods such as `parseString.ts`, `parseNumber.ts`, etc.
  - For enums/unions/nullables, it generates union types or nullable forms of Valibot code.
  - In `parseObject.ts`, it recursively processes object properties, separating required and optional fields when generating code.

- **Utilities (src/utils)**
  - `escapeString.ts`: A utility function for escaping string literals.
  - `withDefault.ts`: Applies the `default` value from JSON Schema to the validation chain.
  - `withDescription.ts`: Leverages the `description` field to generate `v.description()` in Valibot.

## Build and Dependencies

- **Build Tool**: `tsup`
  - Uses the `build` script in `package.json` to run `tsup src/index.ts src/cli.ts` and produce the bundle.
- **Testing**: `vitest`
  - Employs unit tests and snapshot tests to verify individual parsers and CLI behavior.
  - Generates coverage reports to ensure major logic is sufficiently tested.
- **CLI Library**: `commander`
  - Handles CLI option parsing, including `--help` and `--version`.
- **JSON Schema**: `json-schema` / `json-refs`
  - Used for reading schema definitions and resolving `$ref` references.
- **Valibot**
  - The validation library for which code is generated; the output references Valibot's API.

## Implementation Policy

1. **Flow Centered on CLI**

   1. Capture options and input via the CLI (`cli.ts`).
   2. Invoke the `jsonSchemaToValibot` function to convert the JSON Schema into Valibot code.
   3. Write the conversion result to a file or stdout.

2. **Parser Modules for Separation of Concerns**

   - Break down logic by type in files like `parseString.ts`, `parseNumber.ts`, and `parseObject.ts` for maintainability.
   - `parseSchema.ts` acts as an entry point, examining `type`, `enum`, or constructs like `oneOf` / `anyOf` / `allOf` (for future implementation) to route to the right parser.

3. **Configurable Options**

   - `module` option: Switch the output format among ESM / CJS / none.
   - `type` option: In an ESM environment, output named exports along with a type definition, e.g., `export const MySchema = ...` and `export type MySchema = ...`.
   - `noImport` option: Omits the `valibot` import line if desired.
   - `withJsdocs` option: Generates JSDoc comments based on `description` (or calls `v.description()` depending on implementation).
   - `withoutDefaults`: Controls whether or not to ignore the `default` field in JSON Schema.
   - `withoutDescriptions`: Controls whether or not to ignore `description` fields.

4. **Test-Driven Development (TDD) and Snapshots**
   - Use `vitest` to cover individual parser modules and the CLI.
   - Snapshot tests help visualize how any changes to the code might affect the generated output.
   - Integration tests with `spawnSync` verify CLI usage from a user’s standpoint.

## Coding Standards and Style

- **Type Safety**: Employ TypeScript’s strict mode and avoid careless use of `any`.
- **Parser Extensibility**: Future features like `oneOf`, `allOf`, `anyOf` may be added, so keep the code open to enhancements within `parseSchema.ts`.
- **Minimal Side Effects**: Emphasize a functional approach that transforms the input JSON with minimal side effects, deferring file I/O tasks to the CLI.
- **JSDoc Comments**: Provide concise JSDoc comments for functions and public methods (also relevant when using the `--withJsdocs` feature to document the output).

## Testing and Quality Assurance

- **Unit Tests**
  - Create file-based tests (e.g., `parseSchema.test.ts`) to verify correctness of the type conversion logic, including snapshots.
- **Integration Tests (CLI)**
  - Use `cli.test.ts` to test actual command execution, verifying option inputs and file outputs.
- **Coverage**
  - Use coverage tools in `vitest` to measure how much of the core logic is tested.

## Operations and Future Outlook

- Since JSON Schema includes multiple drafts (post–Draft 4), additional scenarios (e.g., heavy use of `$ref`, complex schemas, format restrictions) might require more advanced handling.
- Consider extending CLI options, such as an `--overrideParser` mechanism to inject custom parsers (already some placeholders in the code).
- For very large or complex JSON Schemas, watch out for deep nesting in `v.union` or `v.object`, which may impact code size and readability.
