# Technical Specifications and Guidelines

## Project Structure (Monorepo)

This repository is organized as a monorepo with the following packages:

### packages/json-schema-to-valibot (CLI Tool)

The main CLI tool for converting JSON Schema to Valibot schemas.

### packages/website

A Next.js-based web application that provides an interactive playground for the JSON Schema to Valibot conversion.

The root-level package.json manages shared build, test, formatting, and linting tasks across all packages.

## Shared Development Standards

- **Type Safety**: Strict TypeScript usage across all packages
- **Code Quality**: ESLint for linting, Prettier for formatting
- **Documentation**: JSDoc for functions and components
- **Testing**: Maintain high test coverage
- **Git Workflow**: Conventional commits and branch naming

## CLI Package

### Overview

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

### Build and Dependencies

- **Build Tool**: `tsup`
  - Uses the `build` script from the root-level package.json (i.e. `npm run build --workspaces`) to execute build tasks in all packages. Specifically, the CLI tool in `packages/json-schema-to-valibot` is built using `tsup src/index.ts src/cli.ts`.
- **Testing**: `vitest`
  - Employs unit tests and snapshot tests to verify individual parsers and CLI behavior.
  - Generates coverage reports to ensure major logic is sufficiently tested.
- **CLI Library**: `commander`
  - Handles CLI option parsing, including `--help` and `--version`.
- **JSON Schema**: `json-schema` / `json-refs`
  - Used for reading schema definitions and resolving `$ref` references.
- **Valibot**
  - The validation library for which code is generated; the output references Valibot's API.

### Implementation Policy

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
   - Integration tests with `spawnSync` verify CLI usage from a user's standpoint.

### Coding Standards and Style

- **Type Safety**: Employ TypeScript's strict mode and avoid careless use of `any`.
- **Parser Extensibility**: Future features like `oneOf`, `allOf`, `anyOf` may be added, so keep the code open to enhancements within `parseSchema.ts`.
- **Minimal Side Effects**: Emphasize a functional approach that transforms the input JSON with minimal side effects, deferring file I/O tasks to the CLI.
- **JSDoc Comments**: Provide concise JSDoc comments for functions and public methods (also relevant when using the `--withJsdocs` feature to document the output).

### Testing and Quality Assurance

- **Unit Tests**
  - Create file-based tests (e.g., `parseSchema.test.ts`) to verify correctness of the type conversion logic, including snapshots.
- **Integration Tests (CLI)**
  - Use `cli.test.ts` to test actual command execution, verifying option inputs and file outputs.
- **Coverage**
  - Use coverage tools in `vitest` to measure how much of the core logic is tested.

### Operations and Future Outlook

- Since JSON Schema includes multiple drafts (post–Draft 4), additional scenarios (e.g., heavy use of `$ref`, complex schemas, format restrictions) might require more advanced handling.
- Consider extending CLI options, such as an `--overrideParser` mechanism to inject custom parsers (already some placeholders in the code).
- For very large or complex JSON Schemas, watch out for deep nesting in `v.union` or `v.object`, which may impact code size and readability.

## Website Package

### Overview

- **Interactive Playground**

  - Real-time conversion of JSON Schema to Valibot code
  - Built with Next.js 14 and shadcn/ui components
  - Uses the core conversion logic from the CLI package

- **Key Components**
  - `SchemaConverter`: Main component handling the conversion interface
  - UI Components: Leverages shadcn/ui for consistent design
  - Layout: Responsive design with header and footer components

### Build and Dependencies

- **Framework**: Next.js 14
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Development**:
  - `next dev` for local development
  - `next build` for production builds

### Implementation

1. **Interactive Conversion**

   - Real-time preview of conversion results
   - Error handling and validation feedback
   - Copy-to-clipboard functionality

2. **User Experience**
   - Responsive design for various screen sizes
   - Intuitive interface for schema input
   - Clear display of conversion results

### Testing

No tests are implemented yet.
