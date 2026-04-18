# Gotchas

## Common Issues

### 1. Routes not showing up

- Check `app/routes/` directory
- Ensure file is `*.tsx` (not `*.ts`)
- Files starting with `~` are ignored

### 2. API routes 404

- API routes must be in `app/api/*/index.ts`
- Folder name becomes the route path

### 3. Build errors

- Run `manic lint` first
- Check for TypeScript errors
- Ensure all imports exist

### 4. Dev server not hot-reloading

- Check `~manic.ts` is present
- Ensure `bun dev` is running
- Check for file permission issues

### 5. Provider deployment issues

- Ensure `bun build` succeeds first
- Check provider-specific docs
- Verify `.manic/` output exists

## Best Practices

- Always run `manic lint` before commit
- Use `bun dev` for local testing
- Test builds with `bun build && bun start`
- Check provider docs for deployment
