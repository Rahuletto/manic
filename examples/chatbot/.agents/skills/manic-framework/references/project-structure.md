# Project Structure

Manic projects follow a simple, file-based structure:

```
app/
├── api/          # API routes (Hono)
├── routes/       # Page routes
├── system/       # System files (manic.md, benchmarks.md)
├── ~manic.ts     # Server entry point
└── index.html    # HTML shell
```

## Key Files

| File                       | Purpose                         |
| -------------------------- | ------------------------------- |
| `app/routes/*.tsx`         | Page routes (filename → URL)    |
| `app/api/*/index.ts`       | API routes                      |
| `app/system/manic.md`      | Framework documentation context |
| `app/system/benchmarks.md` | Performance benchmarks context  |
| `~manic.ts`                | Server entry point              |
| `manic.config.ts`          | Framework configuration         |

## Conventions

- `~` prefix = excluded from routing
- `app/routes/index.tsx` → `/`
- `app/routes/about.tsx` → `/about`
- `app/api/users/index.ts` → `/api/users`
