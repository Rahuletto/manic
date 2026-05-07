#!/usr/bin/env bun
import { resolve, basename } from 'path';

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._/-]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}

function pluginFnName(pkgName: string): string {
  const raw = pkgName.replace(/^@[^/]+\//u, '');
  const parts = raw.split(/[-_/]/gu).filter(Boolean);
  return (
    parts[0] +
    parts
      .slice(1)
      .map(part => part[0].toUpperCase() + part.slice(1))
      .join('')
  );
}

function template(pluginPackage: string): string {
  const fn = pluginFnName(pluginPackage);
  return `# AGENTS.md — ${pluginPackage} Plugin Development Guide

This package is a Manic plugin. Keep dev/prod behavior consistent and provider-agnostic.

## Scope

- Plugin package name: \`${pluginPackage}\`
- Main factory export: \`${fn}()\`
- Runtime target: Bun
- Framework API: \`manicjs/config\` (\`createPlugin\`, \`defineConfig\`)

## Rules

1. Always build plugins with \`createPlugin\` from \`manicjs/config\`.
2. Prefer \`staticFiles\` for anything that must work in both dev and production.
3. Never hardcode plugin-owned script tags in \`app/index.html\`; inject with \`injectHtml()\`.
4. Avoid provider-specific logic in plugin code (Vercel/Cloudflare/Netlify branching).
5. If using \`configureServer()\` routes, provide equivalent production output via \`staticFiles\` or \`build()\`.
6. Keep plugin options typed and documented at the factory function boundary.

## Starter Implementation

\`\`\`ts
import { createPlugin } from 'manicjs/config';

interface PluginOptions {
  enabled?: boolean;
}

export function ${fn}(options: PluginOptions = {}) {
  return createPlugin({
    name: '${toSlug(pluginPackage)}',
    staticFiles: [
      {
        path: '/${toSlug(pluginPackage)}.txt',
        content: 'ok',
        contentType: 'text/plain; charset=utf-8',
      },
    ],
    configureServer(ctx) {
      if (options.enabled === false) return;
      ctx.addLinkHeader('</${toSlug(pluginPackage)}.txt>; rel="preload"; as="fetch"');
    },
    build(ctx) {
      if (options.enabled === false) return;
      ctx.injectHtml('<meta name="${toSlug(pluginPackage)}" content="enabled">');
    },
  });
}
\`\`\`

## Verification Checklist

- \`bunx manic dev\` runs with plugin enabled and no runtime errors.
- \`bunx manic build\` succeeds (lint + bundle + plugin hooks).
- Static outputs from \`staticFiles\` appear in \`.manic/client/\`.
- Any HTML tags injected by plugin appear in built \`index.html\`.
- No provider-specific code is present in this package.
`;
}

async function main() {
  const args = process.argv.slice(2);
  const outEqArg = args.find(a => a.startsWith('--out='))?.split('=')[1];
  const outFlagIndex = args.indexOf('--out');
  const pluginPackage =
    args.find(a => a.startsWith('--package='))?.split('=')[1] ??
    args[0] ??
    '@acme/manic-plugin';
  const outputArg =
    outEqArg ?? (outFlagIndex > -1 ? args[outFlagIndex + 1] : undefined) ?? 'AGENTS.md';

  const outputPath = resolve(process.cwd(), outputArg);
  await Bun.write(outputPath, template(pluginPackage));
  console.log(`Generated ${basename(outputPath)} for ${pluginPackage}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
