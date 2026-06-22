<img src="demo/assets/wordmark.svg" alt="Manic" width="300" />

[![npm version](https://img.shields.io/npm/v/manicjs?logo=npm)](https://www.npmjs.com/package/manicjs)
[![Bun](https://img.shields.io/badge/runtime-Bun-black?logo=bun)](https://bun.sh)
[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blue)](https://opensource.org/licenses/GPL-3.0)

Manic is a high-performance React framework built exclusively for Bun.

It ships with a custom build pipeline, first-class plugin architecture, and production-ready DX for local development, deployment, and AI-native workflows.

## Monorepo Workspace

This repository is the monorepo workspace containing core framework packages:

```bash
git clone https://github.com/manic-js/manic.git
cd manic
bun install
```

## Packages

| Package | Directory | Description |
| --- | --- | --- |
| [manicjs](https://www.npmjs.com/package/manicjs) | `packages/manic` | Core framework runtime and CLI |
| [create-manic](https://www.npmjs.com/package/create-manic) | `packages/create-manic` | Project scaffolding CLI |
| [@manicjs/bundler](https://www.npmjs.com/package/@manicjs/bundler) | `packages/bundler` | Custom bundler and build modules |
| [@manicjs/rosetta](https://www.npmjs.com/package/@manicjs/rosetta) | `packages/rosetta` | Vite to Manic plugin adapter |
| [@manicjs/tui](https://www.npmjs.com/package/@manicjs/tui) | `packages/tui` | Shared terminal UI primitives |

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Docs: [manicjs.tech/docs](https://www.manicjs.tech/docs)
- Framework guide: [manicjs.tech/docs/framework](https://www.manicjs.tech/docs/framework)
- Getting started: [manicjs.tech/docs/framework/getting-started](https://www.manicjs.tech/docs/framework/getting-started)
- CLI reference: [manicjs.tech/docs/cli](https://www.manicjs.tech/docs/cli)

## Quick Start

```bash
bunx create-manic my-app
cd my-app
bun install
bun dev
```

## Requirements

- [Bun](https://bun.sh) `>= 1.3.13`

## License

GPL-3.0

