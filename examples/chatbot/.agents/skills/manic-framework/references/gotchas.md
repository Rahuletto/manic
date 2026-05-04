# Gotchas

This page covers common issues and best practices for working with Manic.

<Callout type="note">
This is a note callout.
</Callout>

## Common Issues

### 1. Routes not showing up

<Callout type="caution">
Files starting with `~` are automatically ignored by the router.
</Callout>

- Check `app/routes/` directory
- Ensure file is `*.tsx` (not `*.ts`)
- Files starting with `~` are ignored

### 2. API routes 404

<Callout type="important">
API routes must follow the `app/api/*/index.ts` naming convention.
</Callout>

- API routes must be in `app/api/*/index.ts`
- Folder name becomes the route path

### 3. Build errors

<Callout type="tip">
Run `manic lint` before building to catch issues early.
</Callout>

- Run `manic lint` first
- Check for TypeScript errors
- Ensure all imports exist

### 4. Dev server not hot-reloading

<Callout type="warning">
Ensure `~manic.ts` exists in your project root - it's required for the dev server.
</Callout>

- Check `~manic.ts` is present
- Ensure `bun dev` is running
- Check for file permission issues

### 5. Provider deployment issues

<Callout type="important">
Always verify `bun build` succeeds before deploying to any provider.
</Callout>

- Ensure `bun build` succeeds first
- Check provider-specific docs
- Verify `.manic/` output exists

## Best Practices

<Callout type="tip">
Follow these practices for a smoother development experience.
</Callout>

- Always run `manic lint` before commit
- Use `bun dev` for local testing
- Test builds with `bun build && bun start`
- Check provider docs for deployment
