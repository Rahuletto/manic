#!/usr/bin/env bash
set -euo pipefail

paths=(
  "packages/bundler"
  "packages/create-manic"
  "packages/manic"
  "packages/providers"
  "packages/tui"
  "plugins/api-docs"
  "plugins/mcp"
  "plugins/mdx"
  "plugins/seo"
  "plugins/sitemap"
  "plugins/tailwind"
  "plugins/unocss"
)

for p in "${paths[@]}"; do
  echo "==> bun test: ${p}"
  (cd "$p" && bun run test)
done

if [ "${RUN_MANIC_INTEGRATION_TESTS:-0}" = "1" ]; then
  echo "==> bun test: packages/manic (integration)"
  (cd packages/manic && bun run test:integration)
fi

echo "All workspace package tests passed."
