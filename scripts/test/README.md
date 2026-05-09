# Workspace Testing & Quality

Distributed testing across all workspace packages using Bun's test runner.

## Test Structure

Each package in the workspace manages its own tests:

- **core** (`packages/manic`)
  - `test:cli` — CLI command tests
  - `test:e2e` — End-to-end integration tests
  - `test:framework` — Framework validation against demo

- **bundler** (`packages/bundler`)
  - Has its own test suite
  
- **plugins** (`plugins/*`)
  - Each plugin has smoke tests

- **demo** (`demo/`)
  - Integration tests

## Running Tests

### Run all workspace tests
```bash
bun test
# or
bun run test
```

### Run tests for a specific package
```bash
cd core && bun run test
cd bundler && bun run test
cd plugins/tailwind && bun run test
```

### Run tests in watch mode
```bash
bun run test:watch
```

## Linting & Formatting

### Lint workspace packages
```bash
bun run lint
```

### Check formatting
```bash
bun run format
```

### CI linting (all files)
```bash
bun run ci:lint
```

### CI formatting check
```bash
bun run ci:format
```

## Pre-commit Hook

Local hook validates workspace integrity on commit:
```bash
bun run hooks
```

CI handles all test validation on push and PR.

## Test Coverage

Each package is responsible for its own tests:

✅ **Core** (`manicjs`)
- CLI commands validation
- Framework integration with demo
- Route generation
- API mounting
- Plugin loading

✅ **Bundler** (`@manicjs/bundler`)
- Build output artifacts
- Code splitting
- Minification
- Tree shaking

✅ **Plugins**
- Plugin descriptor validation
- Config generation
- Integration tests

✅ **Providers**
- Deployment adapter tests

✅ **Demo**
- Framework feature validation
- Real-world usage patterns

## Writing Tests

Add `.test.ts` files in any package:

```typescript
import { describe, it, expect } from "bun:test";

describe("Feature", () => {
  it("should work", () => {
    expect(true).toBe(true);
  });
});
```

Tests are discovered automatically and run with `bun test` or `bun run test`.

## Exit Codes

- `0` — All tests passed
- `1` — One or more tests failed
