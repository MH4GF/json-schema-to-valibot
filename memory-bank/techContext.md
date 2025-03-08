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
  - Current test challenges:
    - Snapshot updates needed for CLI help text
    - Integration test failures with complex schemas
    - Depth option test failures
    - Need for additional edge case coverage
- CLI features:
  - Commander.js for option parsing
  - Depth-limited schema parsing (in progress)
  - Standardized flag patterns (-j for withJsdocs)
  - No-import flag handling (--no-import)
  - Type validation with module requirements
- Parser enhancements:
  - Recursive depth tracking with currentDepth parameter
  - Fallback to v.any() at depth limits
  - Type validation for CLI options
  - Depth propagation through parser chain
  - Integration with existing parsers:
    - parseObject with depth tracking
    - parseArray with depth tracking
    - parseSchema as depth controller

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
- Test coverage tracking
- Integration test fixtures:
  - package.json schema
  - tbls schema
  - Complex nested structures

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
