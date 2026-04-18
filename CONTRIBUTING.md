# Contributing to Manic

Thanks for your interest in contributing! Manic is built on Bun and moves fast — please read this before opening a PR.

## Requirements

- [Bun](https://bun.sh) v1.3.0+
- Node.js is **not** used — Bun only.

## Setup

```bash
git clone https://github.com/your-org/manic
cd manic
bun install   # always run at the root
```

## Development Workflow

1. Make changes in `packages/manic/src/`
2. Validate in the demo app:
   ```bash
   cd demo
   bun dev                    # dev server
   bun build && bun start     # production build
   ```
3. Lint and format before committing:
   ```bash
   manic lint
   manic fmt
   ```

## Project Structure

| Path                     | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `packages/manic/`        | Core framework (CLI, router, server, build engine)   |
| `packages/create-manic/` | `bunx create-manic` scaffolding tool                 |
| `packages/providers/`    | Vercel, Netlify, Cloudflare deployment adapters      |
| `plugins/`               | Official plugins (`sitemap`, `api-docs`)             |
| `demo/`                  | Local dev testbench — the source of truth for builds |
| `examples/`              | Reference apps                                       |

## Guidelines

- **No new dependencies** without discussion. Prefer Bun built-ins.
- **No `any`** — strict TypeScript throughout.
- **Zero-config principle** — features should work by scanning `app/` structure, not config.
- Keep PRs focused. One feature or fix per PR.
- All production builds must pass in `demo/` before a PR is mergeable.

## Submitting a PR

1. Fork the repo and create a branch from `main`.
2. Follow the PR template — fill every section.
3. Ensure `manic lint` and `manic fmt` pass.
4. Confirm `bun build && bun start` works in `demo/`.

## Reporting Issues

Use the GitHub issue templates:

- **Bug report** — for unexpected behavior
- **Feature request** — for new ideas

## License

By contributing, you agree your contributions will be licensed under the [GPL-3.0 License](./LICENSE).
