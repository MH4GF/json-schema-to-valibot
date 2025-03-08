# System Patterns

## Architecture Overview
```mermaid
flowchart TD
    CLI[CLI Interface] --> Core[Core Parser]
    Web[Web Interface] --> Core
    Core --> Parsers[Schema Parsers]
    Parsers --> Utils[Utility Functions]
```

## Project Structure
- Monorepo Architecture
  - packages/json-schema-to-valibot (Core Package)
  - packages/website (Web Interface)

## Core Package Patterns
### Parser Architecture
- Modular parser design
- Recursive depth tracking system:
  - Depth parameter propagation
  - Fallback to v.any() at depth limit
  - Consistent depth handling across parsers
- Individual parsers for different schema types:
  - Array schemas
  - Object schemas
  - String schemas
  - Number schemas
  - Boolean schemas
  - Enum schemas
  - AnyOf schemas

### CLI Architecture
- Command-line interface patterns:
  - Consistent shorthand flags (-ni, -j)
  - Option validation (type requirements)
  - Default value handling
  - Depth limitation support

### Testing Strategy
- Unit tests for each parser
- Snapshot testing for CLI output
- Fixture-based testing for complex schemas

### Utility Functions
- Schema enhancement utilities
  - Default value handling
  - Description preservation
  - String escaping

## Website Patterns
### Component Architecture
- Next.js framework
- React components hierarchy
- UI component library integration
- Custom hooks for functionality

### State Management
- Local component state
- Custom hooks for shared logic
- Toast notifications for user feedback

## Common Patterns
### Code Organization
- Clear module boundaries
- Separation of concerns
- Type-driven development
- Comprehensive testing

### Error Handling
- Structured error types
- Descriptive error messages
- Graceful fallbacks

### Development Practices
- Test-Driven Development (TDD):
  - Write failing tests first
  - Implement minimum code to pass
  - Refactor while maintaining tests
  - Test coverage for all features
- TypeScript for type safety
- Biome for code formatting
- Monorepo package management