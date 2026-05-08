#!/usr/bin/env bun
import {
  bold,
  brandTitle,
  cyan,
  dim,
  divider,
  eventLine,
  green,
  PromptSession,
  red,
  sectionTitle,
  statusError,
  statusSuccess,
  white,
} from '@manicjs/tui';

const PACKAGES = [
  {
    name: 'manicjs',
    path: 'packages/manic',
    dir: 'packages/manic',
    group: 'Core',
  },
  {
    name: '@manicjs/providers',
    path: 'packages/providers',
    dir: 'packages/providers',
    group: 'Core',
  },
  {
    name: 'create-manic',
    path: 'packages/create-manic',
    dir: 'packages/create-manic',
    group: 'Core',
  },
  {
    name: '@manicjs/tui',
    path: 'packages/tui',
    dir: 'packages/tui',
    group: 'Core',
  },
  {
    name: '@manicjs/tailwind',
    path: 'plugins/tailwind',
    dir: 'plugins/tailwind',
    group: 'Plugins',
  },
  {
    name: '@manicjs/unocss',
    path: 'plugins/unocss',
    dir: 'plugins/unocss',
    group: 'Plugins',
  },
  {
    name: '@manicjs/mdx',
    path: 'plugins/mdx',
    dir: 'plugins/mdx',
    group: 'Plugins',
  },
  {
    name: '@manicjs/mcp',
    path: 'plugins/mcp',
    dir: 'plugins/mcp',
    group: 'Plugins',
  },
  {
    name: '@manicjs/seo',
    path: 'plugins/seo',
    dir: 'plugins/seo',
    group: 'Plugins',
  },
  {
    name: '@manicjs/sitemap',
    path: 'plugins/sitemap',
    dir: 'plugins/sitemap',
    group: 'Plugins',
  },
  {
    name: '@manicjs/api-docs',
    path: 'plugins/api-docs',
    dir: 'plugins/api-docs',
    group: 'Plugins',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getVersion(p: string) {
  return (await Bun.file(`${p}/package.json`).json()).version as string;
}
async function setVersion(p: string, v: string) {
  const f = `${p}/package.json`,
    pkg = await Bun.file(f).json();
  pkg.version = v;
  await Bun.write(f, JSON.stringify(pkg, null, 2) + '\n');
}
function bump(v: string, t: string) {
  const [ma, mi, pa] = v.split('.').map(Number);
  return t === 'patch'
    ? `${ma}.${mi}.${pa + 1}`
    : t === 'minor'
      ? `${ma}.${mi + 1}.0`
      : `${ma + 1}.0.0`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const prompts = new PromptSession();
  console.log(`\n${brandTitle('publisher')}`);
  console.log(divider());
  console.log(sectionTitle('Release Publisher'));
  console.log(divider());

  const versions = await Promise.all(PACKAGES.map(p => getVersion(p.path)));
  const choices = PACKAGES.map(
    (pkg, i) => `${pkg.name} (${pkg.group}, v${versions[i]})`
  );
  const groups = PACKAGES.map(pkg => pkg.group);
  const selectedLabels = await prompts.multiSelect(
    'Select packages to publish',
    choices,
    [],
    groups
  );
  const selectedSet = new Set(selectedLabels);
  const selectedIdxs = PACKAGES.map((pkg, i) => ({ pkg, i }))
    .filter(({ i }) => selectedSet.has(choices[i]))
    .map(({ i }) => i);
  if (!selectedIdxs.length) {
    console.log(eventLine('publish', 'nothing selected', 'warn'));
    prompts.close();
    process.exit(0);
  }

  const bumpChoice = await prompts.select(
    'Version bump',
    ['patch', 'minor', 'major', 'none'],
    0
  );
  const bumpType = bumpChoice as 'patch' | 'minor' | 'major' | 'none';

  const chosen = selectedIdxs.map(i => ({
    ...PACKAGES[i],
    current: versions[i],
  }));
  const newVersions: Record<string, string> = {};
  console.log(`\n  ${bold('Preview')}\n`);
  for (const pkg of chosen) {
    const nv = bumpType === 'none' ? pkg.current : bump(pkg.current, bumpType);
    newVersions[pkg.name] = nv;
    const arrow =
      nv !== pkg.current
        ? `${dim(pkg.current)} → ${green(nv)}`
        : `${dim(`${pkg.current} (unchanged)`)}`;
    console.log(`  ${green('●')} ${white(pkg.name)}  ${arrow}`);
  }

  const proceed = await prompts.confirm('Proceed with publish?', false);
  if (!proceed) {
    console.log(`\n${eventLine('publish', 'cancelled', 'warn')}`);
    prompts.close();
    process.exit(0);
  }

  if (bumpType !== 'none') {
    console.log(`\n  ${dim('Bumping versions...')}`);
    for (const pkg of chosen) {
      await setVersion(pkg.path, newVersions[pkg.name]);
      console.log(`  ${statusSuccess(`${pkg.name} → ${newVersions[pkg.name]}`)}`);
    }
  }

  console.log(`\n  ${dim('Publishing...')}\n`);
  let failed = 0;
  for (const pkg of chosen) {
    process.stdout.write(`  ${dim(`Publishing ${pkg.name}...`)}\n`);
    const proc = Bun.spawn(['bun', 'publish', '--access', 'public'], {
      cwd: pkg.dir,
      stdout: 'inherit',
      stderr: 'inherit',
      stdin: 'inherit',
    });
    const code = await proc.exited;
    if (code === 0) {
      console.log(statusSuccess(`${pkg.name}  ${dim(`v${newVersions[pkg.name]}`)}`));
    } else {
      console.log(statusError(`${pkg.name} exited ${code} — reverting version`));
      await setVersion(pkg.path, pkg.current);
      failed++;
    }
  }

  console.log(
    failed === 0
      ? `\n  ${green(bold('All packages published successfully'))}\n`
      : `\n  ${red(`${failed} package(s) failed`)}\n`
  );
  prompts.close();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
