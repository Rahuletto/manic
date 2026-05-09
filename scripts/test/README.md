# Workspace Test Suite

Bun test runner for validating the Manic workspace across all packages and the demo app.

## Test Files

- **`scripts/test/workspace.test.ts`** — Workspace structure and package validation
  - Verifies bun.lock exists
  - Validates package.json workspaces config
  - Checks required documentation files
  - Verifies quality config files (.oxlintrc.json, .oxfmt.json)
  - Validates all packages and plugins exist

- **`demo/app/routes/index.test.tsx`** — Demo page routes tests
- **`demo/app/api/health.test.ts`** — Demo API routes tests

Each package under `packages/*/`, `plugins/*/`, and the demo can have its own `.test.ts` files.

## Usage

### Run all tests
```bash
bun test
```

### Run tests in watch mode
```bash
bun run test:watch
```

### Run specific test file
```bash
bun test scripts/test/workspace.test.ts
```

### Run with filtering
```bash
bun test --name "Workspace"
```

## Pre-push Hook

The `.githooks/pre-push` hook automatically runs `bun test` before each push.

Install the hook:
```bash
bun run hooks
```

Skip the hook (not recommended):
```bash
git push --no-verify
```

## Test Coverage

✅ **Workspace Structure**
- bun.lock present and valid
- package.json has workspaces config
- All required documentation files exist
- Quality config files (.oxlintrc.json, .oxfmt.json) present
- Git hooks configured

✅ **Packages**
- Core, bundler, providers, create-manic, tui
- Each has valid package.json
- Entry points defined

✅ **Plugins**
- tailwind, unocss, mdx, mcp, seo, sitemap, api-docs
- Each has valid package.json
- Main export defined

✅ **Demo App**
- Page routes have test files
- API routes have test files
- Tests run successfully

## Writing Tests

Add test files anywhere in the workspace:

```typescript
// demo/app/routes/about.test.tsx
import { describe, it, expect } from "bun:test";

describe("About Page", () => {
  it("should render about page", () => {
    expect(true).toBe(true);
  });
});
```

Tests are discovered automatically by Bun and run with `bun test`.

## Exit Codes

- `0` — All tests passed
- `1` — One or more tests failed
