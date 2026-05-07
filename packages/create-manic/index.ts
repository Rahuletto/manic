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
import * as readline from 'readline';
import { $ } from 'bun';

/** @internal */
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
/** @internal */
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
/** @internal */
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
/** @internal */
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
/** @internal */
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

/** @internal */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompts for a text answer
 * @param question - Question to ask
 * @param defaultValue - Default value if no answer provided
 * @returns User's answer or default
 * @internal
 */
function ask(question: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? dim(` (${defaultValue})`) : '';
  return new Promise(done => {
    rl.question(`  ${question}${suffix}: `, answer => {
      done(answer.trim() || defaultValue || '');
    });
  });
}

function askYesNo(
  question: string,
  defaultYes: boolean = true
): Promise<boolean> {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  return new Promise(done => {
    rl.question(`  ${question} ${dim(`(${hint})`)}: `, answer => {
      const a = answer.trim().toLowerCase();
      if (a === '') done(defaultYes);
      else done(a === 'y' || a === 'yes');
    });
  });
}

function askChoice(
  question: string,
  choices: string[],
  defaultChoice: string
): Promise<string> {
  const choiceStr = choices
    .map(c => (c === defaultChoice ? bold(c) : c))
    .join(' / ');
  return new Promise(done => {
    rl.question(`  ${question} ${dim(`(${choiceStr})`)}: `, answer => {
      const a = answer.trim().toLowerCase();
      if (choices.includes(a)) done(a);
      else done(defaultChoice);
    });
  });
}

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
  const { positionalPath, options } = parseArgs(process.argv.slice(2));

  console.log(`
${red(bold('■ MANIC'))}
${dim('--- --- --- --- ---')}
`);

  const normalizedPath = options.yes
    ? (options.projectPath ?? positionalPath ?? 'my-manic-app')
    : (options.projectPath ??
      positionalPath ??
      (await ask('Project path', 'my-manic-app')));
  const projectPath = resolvePath(process.cwd(), normalizedPath);
  const pathParts = normalizedPath.split('/').filter(Boolean);
  const pathName = pathParts[pathParts.length - 1] || 'my-manic-app';
  const projectName = options.yes
    ? (options.projectName ?? pathName)
    : (options.projectName ?? (await ask('Project name', pathName)));

  if (existsSync(projectPath)) {
    console.log(
      `\n${red('Error:')} Directory ${cyan(normalizedPath)} already exists.`
    );
    rl.close();
    process.exit(1);
  }

  const mode = options.yes
    ? (options.mode ?? 'fullstack')
    : (options.mode ??
      (await askChoice('Project mode', ['fullstack', 'frontend'], 'fullstack')));
  const port = options.yes
    ? (options.port ?? '6070')
    : (options.port ?? (await ask('Port', '6070')));
  const isFrontend = mode === 'frontend';
  const includeDocs = isFrontend
    ? false
    : options.yes
      ? (options.includeDocs ?? true)
      : (options.includeDocs ??
        (await askYesNo('Include API documentation (Scalar)?', true)));
  const viewTransitions = options.yes
    ? (options.viewTransitions ?? true)
    : (options.viewTransitions ?? (await askYesNo('Enable View Transitions?', true)));
  const installPackages = options.yes
    ? (options.install ?? false)
    : (options.install ?? (await askYesNo('Install packages now?', true)));

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

  rl.close();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
