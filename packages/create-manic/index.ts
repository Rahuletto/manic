#!/usr/bin/env bun
/**
 * @file Manic Project Scaffolder
 * @description Interactive CLI tool for creating new Manic projects.
 * Prompts for project configuration and generates a complete project structure.
 *
 * @example
 * # Create a new project
 * bun create manic my-app
 *
 * @example
 * # Or use bunx
 * bunx create-manic my-app
 */
import { mkdir, cp, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve as resolvePath, join } from 'path';
import { $ } from 'bun';
import {
  red,
  green,
  cyan,
  yellow,
  dim,
  brandTitle,
  PromptSession,
} from '@manicjs/tui';
const MIN_BUN_VERSION = '1.3.13';

function toPackageName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/gu, '-')
    .replace(/^-+|-+$/gu, '') || 'my-manic-app';
}

interface CliOptions {
  yes: boolean;
  projectName?: string;
  projectPath?: string;
  mode?: 'fullstack' | 'frontend';
  port?: string;
  includeDocs?: boolean;
  viewTransitions?: boolean;
  install?: boolean;
}

async function fetchLatestVersion(packageName: string): Promise<string | null> {
  const encodedName = encodeURIComponent(packageName);
  try {
    const response = await fetch(`https://registry.npmjs.org/${encodedName}/latest`);
    if (!response.ok) return null;
    const payload = (await response.json()) as { version?: string };
    if (!payload.version || typeof payload.version !== 'string') return null;
    return payload.version;
  } catch {
    return null;
  }
}

async function lockLatestTaggedDeps(pkg: any): Promise<void> {
  const sections: Array<'dependencies' | 'devDependencies'> = [
    'dependencies',
    'devDependencies',
  ];

  for (const section of sections) {
    const deps = pkg[section] as Record<string, string> | undefined;
    if (!deps) continue;
    const entries = Object.entries(deps).filter(([, version]) => version === 'latest');
    for (const [name] of entries) {
      process.stdout.write(dim(`Resolving ${name}@latest... `));
      const version = await fetchLatestVersion(name);
      if (!version) {
        process.stdout.write(`${yellow('failed')}\n`);
        console.log(
          dim(`  Could not resolve ${name}. Keeping "latest" for now.`)
        );
        continue;
      }
      deps[name] = version;
      process.stdout.write(`${green(version)}\n`);
    }
  }
}

function parseVersion(version: string): number[] {
  const [core] = version.trim().split('-');
  const parts = core.split('.').map(part => parseInt(part, 10));
  while (parts.length < 3) parts.push(0);
  return parts.slice(0, 3).map(v => (Number.isNaN(v) ? 0 : v));
}

function isVersionAtLeast(current: string, minimum: string): boolean {
  const a = parseVersion(current);
  const b = parseVersion(minimum);
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return true;
}

async function getBunVersion(): Promise<string | null> {
  const result = await $`bun --version`.quiet().nothrow();
  if (result.exitCode !== 0) return null;
  return result.stdout.toString().trim() || null;
}

async function ensureBunVersion(
  options: CliOptions,
  prompts: PromptSession
): Promise<void> {
  const version = await getBunVersion();
  if (!version) {
    console.log(`\n${red('Error:')} Bun is not installed or not available in PATH.`);
    console.log(
      dim('Install Bun: https://bun.sh/docs/installation') +
        `\n${dim(`Required minimum version: ${MIN_BUN_VERSION}`)}`
    );
    process.exit(1);
  }

  if (isVersionAtLeast(version, MIN_BUN_VERSION)) {
    return;
  }

  console.log(
    `\n${yellow('Warning:')} Detected Bun ${cyan(version)} but Manic requires ${cyan(`${MIN_BUN_VERSION}+`)}.`
  );

  if (options.yes) {
    console.log(
      dim(
        'Cannot prompt for upgrade in --yes mode. Please run "bun upgrade" and try again.'
      )
    );
    process.exit(1);
  }

  const shouldUpgrade = await prompts.confirm('Upgrade Bun now?');

  if (!shouldUpgrade) {
    console.log(
      dim('Please upgrade Bun manually with "bun upgrade" and rerun create-manic.')
    );
    process.exit(1);
  }

  console.log(dim('\nUpgrading Bun...\n'));
  const upgrade = await $`bun upgrade`.nothrow();
  if (upgrade.exitCode !== 0) {
    console.log(
      `\n${red('Error:')} Auto-upgrade failed. Please upgrade manually with ${cyan('bun upgrade')}.`
    );
    if (upgrade.stderr.length > 0) {
      console.log(dim(upgrade.stderr.toString().trim()));
    }
    process.exit(1);
  }

  const upgradedVersion = await getBunVersion();
  if (!upgradedVersion || !isVersionAtLeast(upgradedVersion, MIN_BUN_VERSION)) {
    console.log(
      `\n${red('Error:')} Bun upgrade did not reach required version ${cyan(`${MIN_BUN_VERSION}+`)}.`
    );
    console.log(dim('Please run "bun upgrade" manually and retry.'));
    process.exit(1);
  }

  console.log(
    `${green('Success!')} Bun upgraded to ${cyan(upgradedVersion)} (required: ${cyan(`${MIN_BUN_VERSION}+`)})`
  );
}

function parseArgs(args: string[]): {
  positionalPath?: string;
  options: CliOptions;
} {
  const options: CliOptions = { yes: false };
  let positionalPath: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if (arg === '-y' || arg === '--yes') {
      options.yes = true;
      continue;
    }
    if (arg === '--project-name' && next) {
      options.projectName = next;
      i++;
      continue;
    }
    if (arg === '--project-path' && next) {
      options.projectPath = next;
      i++;
      continue;
    }
    if (arg === '--mode' && (next === 'fullstack' || next === 'frontend')) {
      options.mode = next;
      i++;
      continue;
    }
    if (arg === '--port' && next) {
      options.port = next;
      i++;
      continue;
    }
    if (arg === '--docs') {
      options.includeDocs = true;
      continue;
    }
    if (arg === '--no-docs') {
      options.includeDocs = false;
      continue;
    }
    if (arg === '--view-transitions') {
      options.viewTransitions = true;
      continue;
    }
    if (arg === '--no-view-transitions') {
      options.viewTransitions = false;
      continue;
    }
    if (arg === '--install') {
      options.install = true;
      continue;
    }
    if (arg === '--no-install') {
      options.install = false;
      continue;
    }
    if (!arg.startsWith('-') && !positionalPath) {
      positionalPath = arg;
    }
  }

  return { positionalPath, options };
}

async function main() {
  const prompts = new PromptSession();
  const { positionalPath, options } = parseArgs(process.argv.slice(2));
  await ensureBunVersion(options, prompts);

  console.log(`
${brandTitle()}
${dim('--- --- --- --- ---')}
`);

  const normalizedPath = options.yes
    ? (options.projectPath ?? positionalPath ?? 'my-manic-app')
    : (options.projectPath ??
      positionalPath ??
      (await prompts.input('Project path', 'my-manic-app')));
  const projectPath = resolvePath(process.cwd(), normalizedPath);
  const pathParts = normalizedPath.split('/').filter(Boolean);
  const pathName = pathParts[pathParts.length - 1] || 'my-manic-app';
  const projectName = options.yes
    ? (options.projectName ?? pathName)
    : (options.projectName ?? (await prompts.input('Project name', pathName)));

  if (existsSync(projectPath)) {
    console.log(
      `\n${red('Error:')} Directory ${cyan(normalizedPath)} already exists.`
    );
    prompts.close();
    process.exit(1);
  }

  const mode = options.yes
    ? (options.mode ?? 'fullstack')
    : (options.mode ??
      (await prompts.select('Project mode', ['fullstack', 'frontend'], 0)));
  const port = options.yes
    ? (options.port ?? '6070')
    : (options.port ?? (await prompts.input('Port', '6070')));
  const isFrontend = mode === 'frontend';
  const includeDocs = isFrontend
    ? false
    : options.yes
      ? (options.includeDocs ?? true)
      : (options.includeDocs ??
        (await prompts.confirm('Include API documentation (Scalar)?', true)));
  const viewTransitions = options.yes
    ? (options.viewTransitions ?? true)
    : (options.viewTransitions ?? (await prompts.confirm('Enable View Transitions?', true)));
  const installPackages = options.yes
    ? (options.install ?? false)
    : (options.install ?? (await prompts.confirm('Install packages now?', true)));

  console.log(`\n${dim('Creating project...')}\n`);

  const templatePath = join(import.meta.dir, 'template');
  await mkdir(projectPath, { recursive: true });
  await cp(templatePath, projectPath, { recursive: true });

  if (isFrontend) {
    const apiDir = join(projectPath, 'app', 'api');
    if (existsSync(apiDir)) {
      await rm(apiDir, { recursive: true, force: true });
    }
  }

  const pkgPath = join(projectPath, 'package.json');
  const pkg = await Bun.file(pkgPath).json();
  pkg.name = toPackageName(projectName);

  if (isFrontend) {
    delete pkg.dependencies['hono'];
    delete pkg.dependencies['@manicjs/api-docs'];
    pkg.dependencies['@manicjs/sitemap'] = 'latest';
  } else if (!includeDocs) {
    delete pkg.dependencies['@manicjs/api-docs'];
  }

  await lockLatestTaggedDeps(pkg);

  await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));

  const imports: string[] = ['import { defineConfig } from "manicjs/config";'];
  const plugins: string[] = [];

  if (isFrontend) {
    imports.push('import { mcp } from "@manicjs/mcp";');
    imports.push('import { seo } from "@manicjs/seo";');
    imports.push('import { sitemap } from "@manicjs/sitemap";');
    plugins.push('mcp()', 'seo()', 'sitemap()');
  } else {
    if (includeDocs) imports.push('import { apiDocs } from "@manicjs/api-docs";');
    imports.push('import { mcp } from "@manicjs/mcp";');
    imports.push('import { seo } from "@manicjs/seo";');
    if (includeDocs) plugins.push('apiDocs()');
    plugins.push('mcp()', 'seo()');
  }

  const pluginsBlock = `\n  plugins: [${plugins.join(', ')}],`;

  const configContent = `${imports.join('\n')}

export default defineConfig({${isFrontend ? '\n  mode: "frontend",\n' : ''}
  app: {
    name: "${projectName}",
  },

  server: {
    port: ${port},
  },

  router: {
    viewTransitions: ${viewTransitions},
  },${pluginsBlock}
});
`;

  await Bun.write(join(projectPath, 'manic.config.ts'), configContent);

  if (installPackages) {
    console.log(dim('Installing packages...\n'));
    await $`cd ${projectPath} && bun install`;
  }

  console.log(`${green('Success!')} Created ${cyan(projectName)} at ${cyan(normalizedPath)}`);
  console.log(`
${dim('Next steps:')}

  ${cyan(`cd ${normalizedPath}`)}
  ${installPackages ? dim('# packages already installed') : cyan('bun install')}
  ${cyan('bun dev')}
`);

  prompts.close();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
