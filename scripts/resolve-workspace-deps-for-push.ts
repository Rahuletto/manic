#!/usr/bin/env bun
/**
 * Replace `workspace:*` (and other workspace: protocol ranges) in deployable
 * package manifests with ^<latest> from npm so remotes (Vercel, CI) work when
 * sibling repos are not cloned.
 *
 * Targets: demo/, docs/ (paths committed on Rahuletto/manic).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dir, '..');
const TARGETS = ['demo/package.json', 'docs/package.json'] as const;

const WORKSPACE_PROTO = /^workspace:/u;

function latestVersion(pkg: string): string {
  const r = Bun.spawnSync(['npm', 'view', pkg, 'version'], {
    stdout: 'pipe',
    stderr: 'pipe',
  });
  if (r.exitCode !== 0) {
    const err = new TextDecoder().decode(r.stderr);
    throw new Error(`npm view ${pkg} version failed: ${err}`);
  }
  return new TextDecoder().decode(r.stdout).trim();
}

function resolveSection(section: Record<string, string> | undefined): boolean {
  if (!section) return false;
  let changed = false;
  for (const [name, ver] of Object.entries(section)) {
    if (WORKSPACE_PROTO.test(ver)) {
      section[name] = `^${latestVersion(name)}`;
      changed = true;
    }
  }
  return changed;
}

function main() {
  let anyChanged = false;
  for (const rel of TARGETS) {
    const file = path.join(ROOT, rel);
    if (!existsSync(file)) continue;

    const json = JSON.parse(readFileSync(file, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const deps = resolveSection(json.dependencies);
    const dev = resolveSection(json.devDependencies);
    if (deps || dev) {
      writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
      console.log(`Resolved workspace: protocol in ${rel}`);
      anyChanged = true;
    }
  }

  if (!anyChanged) {
    console.log('No workspace: entries to resolve in demo/docs package.json');
  }
}

main();
