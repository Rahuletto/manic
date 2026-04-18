#!/usr/bin/env bun
import { ReadStream } from 'tty';

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

const R = '\x1b[0m',
  RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  CYAN = '\x1b[36m',
  BOLD = '\x1b[1m',
  DIM = '\x1b[2m';

// ── Terminal input ────────────────────────────────────────────────────────────

function readKey(): Promise<string> {
  return new Promise(resolve => {
    const tty = new ReadStream(0);
    tty.setRawMode(true);
    tty.resume();
    tty.once('data', (buf: Buffer) => {
      tty.setRawMode(false);
      tty.destroy();
      resolve(buf.toString());
    });
  });
}

// ── Prompt primitive ──────────────────────────────────────────────────────────

type Item = { label: string; group?: string };

function renderList(
  title: string,
  items: Item[],
  cursor: number,
  selected: Set<number>,
  multi: boolean
): string[] {
  const lines: string[] = [
    `  ${BOLD}${title}${R}  ${DIM}${multi ? 'space=toggle · a=all · ' : ''}↑↓=move · enter=confirm${R}`,
    '',
  ];
  let lastGroup = '';
  for (let i = 0; i < items.length; i++) {
    const g = items[i].group;
    if (g && g !== lastGroup) {
      lastGroup = g;
      lines.push(`  ${DIM}── ${g} ──${R}`);
    }
    const cur = i === cursor,
      sel = selected.has(i);
    const box = multi ? (sel ? `${GREEN}◉${R} ` : `${DIM}○${R} `) : '';
    const lbl = cur ? `${CYAN}${BOLD}${items[i].label}${R}` : items[i].label;
    lines.push(`  ${cur ? '›' : ' '} ${box}${lbl}`);
  }
  return lines;
}

async function pick(
  title: string,
  items: Item[],
  multi: boolean
): Promise<number[]> {
  const selected = new Set<number>();
  let cursor = 0;
  let prevLineCount = 0;

  const draw = () => {
    const lines = renderList(title, items, cursor, selected, multi);
    if (prevLineCount) {
      // Move up line by line, erasing each
      process.stdout.write(`\x1b[2K\x1b[1A`.repeat(prevLineCount) + '\x1b[2K');
    }
    process.stdout.write(lines.join('\n') + '\n');
    prevLineCount = lines.length;
  };

  process.stdout.write('\x1b[?25l'); // hide cursor
  draw();

  while (true) {
    const k = await readKey();
    if (k === '\x03') {
      process.stdout.write('\x1b[?25h\n');
      process.exit(0);
    }
    if (k === '\r' || k === '\n') break;
    if (k === '\x1b[A' || k === 'k') cursor = Math.max(0, cursor - 1);
    if (k === '\x1b[B' || k === 'j')
      cursor = Math.min(items.length - 1, cursor + 1);
    if (multi && k === ' ')
      selected.has(cursor) ? selected.delete(cursor) : selected.add(cursor);
    if (multi && k === 'a')
      selected.size === items.length
        ? selected.clear()
        : items.forEach((_, i) => selected.add(i));
    draw();
  }

  process.stdout.write('\x1b[?25h\n'); // show cursor
  return multi ? [...selected] : [cursor];
}

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
  console.log(`\n${RED}${BOLD}■ MANIC${R} ${DIM}publisher${R}\n`);

  const versions = await Promise.all(PACKAGES.map(p => getVersion(p.path)));

  const selectedIdxs = await pick(
    'Select packages to publish',
    PACKAGES.map((p, i) => ({
      label: `${p.name}  ${DIM}v${versions[i]}${R}`,
      group: p.group,
    })),
    true
  );
  if (!selectedIdxs.length) {
    console.log('Nothing selected.');
    process.exit(0);
  }

  const [bumpIdx] = await pick(
    'Version bump',
    [
      { label: 'patch  (x.y.z+1)' },
      { label: 'minor  (x.y+1.0)' },
      { label: 'major  (x+1.0.0)' },
      { label: 'none   (keep current)' },
    ],
    false
  );
  const bumpType = ['patch', 'minor', 'major', 'none'][bumpIdx];

  const chosen = selectedIdxs.map(i => ({
    ...PACKAGES[i],
    current: versions[i],
  }));
  const newVersions: Record<string, string> = {};
  console.log(`\n  ${BOLD}Preview${R}\n`);
  for (const pkg of chosen) {
    const nv = bumpType === 'none' ? pkg.current : bump(pkg.current, bumpType);
    newVersions[pkg.name] = nv;
    const arrow =
      nv !== pkg.current
        ? `${DIM}${pkg.current}${R} → ${GREEN}${nv}${R}`
        : `${DIM}${pkg.current} (unchanged)${R}`;
    console.log(`  ${GREEN}●${R} ${pkg.name}  ${arrow}`);
  }

  const [confirmIdx] = await pick(
    '\nProceed?',
    [{ label: 'Yes, publish' }, { label: 'Cancel' }],
    false
  );
  if (confirmIdx !== 0) {
    console.log('\nCancelled.');
    process.exit(0);
  }

  if (bumpType !== 'none') {
    console.log(`\n  ${DIM}Bumping versions...${R}`);
    for (const pkg of chosen) {
      await setVersion(pkg.path, newVersions[pkg.name]);
      console.log(`  ${GREEN}✓${R} ${pkg.name} → ${newVersions[pkg.name]}`);
    }
  }

  console.log(`\n  ${DIM}Publishing...${R}\n`);
  let failed = 0;
  for (const pkg of chosen) {
    process.stdout.write(`  ${DIM}Publishing ${pkg.name}...${R}\n`);
    const proc = Bun.spawn(['bun', 'publish', '--access', 'public'], {
      cwd: pkg.dir,
      stdout: 'inherit',
      stderr: 'inherit',
      stdin: 'inherit',
    });
    const code = await proc.exited;
    if (code === 0) {
      console.log(
        `  ${GREEN}✓${R} ${pkg.name}  ${DIM}v${newVersions[pkg.name]}${R}`
      );
    } else {
      console.log(
        `  ${RED}✗${R} ${pkg.name}  ${DIM}exited ${code} — reverting version${R}`
      );
      await setVersion(pkg.path, pkg.current);
      failed++;
    }
  }

  console.log(
    failed === 0
      ? `\n  ${GREEN}${BOLD}All packages published successfully${R}\n`
      : `\n  ${RED}${failed} package(s) failed${R}\n`
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
