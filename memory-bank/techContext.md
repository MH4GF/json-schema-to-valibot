# Technical Context

## Technology Stack

### Core Package
- TypeScript/Node.js
- Valibot (schema validation)
- Vitest (testing framework)
- Biome (linting/formatting)

### Website
- Next.js
- React
- Tailwind CSS
- shadcn/ui components
- TypeScript

## Development Environment
- Node.js version specified in .node-version
- Package management with npm
- Monorepo structure
- VSCode as recommended editor

## Build and Test Setup
### Core Package
- Test-Driven Development (TDD) workflow:
  - Vitest for test runner
  - Test-first development approach
  - Comprehensive test coverage (`npm run test:coverage`)
  - Continuous test feedback
- Testing infrastructure:
  - Unit tests for each feature
  - Snapshot testing enabled
  - Test fixtures for complex cases
  - Integration tests for CLI
- CLI features:
  - Commander.js for option parsing
  - Depth-limited schema parsing
  - Standardized flag patterns
- Parser enhancements:
  - Recursive depth tracking
  - Fallback mechanisms
  - Type validation

### Website
- Next.js development server
- Tailwind CSS processing
- PostCSS configuration
- TypeScript strict mode

## Code Quality Tools
- Biome for consistent code style
- TypeScript for type safety
- Comprehensive test suites
- Snapshot testing for regressions

## Project Organization
### Directory Structure
```
├── packages/
│   ├── json-schema-to-valibot/
│   │   ├── src/
│   │   │   ├── parsers/
│   │   │   └── utils/
│   │   └── test/
│   └── website/
│       ├── app/
│       ├── components/
│       └── lib/
```

## Dependencies Management
- Shared dependencies at root
- Package-specific dependencies
- Development tools configuration
- Type definitions

## Deployment Considerations
### Core Package
- npm package distribution
- CLI tool packaging
- Type definitions publishing

### Website
- Next.js deployment
- Static asset optimization
- Client-side performance