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
} from "@manicjs/tui";

type BumpType = "patch" | "minor" | "major" | "none" | "prerelease";
type ManifestSection =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies";

const PACKAGES = [
  {
    name: "@manicjs/bundler",
    path: "packages/bundler",
    dir: "packages/bundler",
    group: "Core",
  },
  {
    name: "manicjs",
    path: "packages/manic",
    dir: "packages/manic",
    group: "Core",
  },
  {
    name: "@manicjs/providers",
    path: "packages/providers",
    dir: "packages/providers",
    group: "Core",
  },
  {
    name: "create-manic",
    path: "packages/create-manic",
    dir: "packages/create-manic",
    group: "Core",
  },
  {
    name: "@manicjs/tui",
    path: "packages/tui",
    dir: "packages/tui",
    group: "Core",
  },
  {
    name: "@manicjs/tailwind",
    path: "plugins/tailwind",
    dir: "plugins/tailwind",
    group: "Plugins",
  },
  {
    name: "@manicjs/unocss",
    path: "plugins/unocss",
    dir: "plugins/unocss",
    group: "Plugins",
  },
  {
    name: "@manicjs/mdx",
    path: "plugins/mdx",
    dir: "plugins/mdx",
    group: "Plugins",
  },
  {
    name: "@manicjs/mcp",
    path: "plugins/mcp",
    dir: "plugins/mcp",
    group: "Plugins",
  },
  {
    name: "@manicjs/seo",
    path: "plugins/seo",
    dir: "plugins/seo",
    group: "Plugins",
  },
  {
    name: "@manicjs/sitemap",
    path: "plugins/sitemap",
    dir: "plugins/sitemap",
    group: "Plugins",
  },
  {
    name: "@manicjs/api-docs",
    path: "plugins/api-docs",
    dir: "plugins/api-docs",
    group: "Plugins",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getVersion(p: string) {
  return (await Bun.file(`${p}/package.json`).json()).version as string;
}
async function setVersionAndLockInternalDeps(
  p: string,
  v: string,
  lockVersions: Record<string, string>,
) {
  const f = `${p}/package.json`;
  const pkg = await Bun.file(f).json();
  pkg.version = v;
  const sections: ManifestSection[] = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ];
  for (const section of sections) {
    const deps = pkg[section] as Record<string, string> | undefined;
    if (!deps) continue;
    for (const [depName, lockedVersion] of Object.entries(lockVersions)) {
      if (!(depName in deps)) continue;
      deps[depName] = lockedVersion;
    }
  }
  await Bun.write(f, JSON.stringify(pkg, null, 2) + "\n");
}

function bump(v: string, t: BumpType) {
  const base = v.split("-")[0];
  const [ma, mi, pa] = base.split(".").map(Number);
  return t === "patch"
    ? `${ma}.${mi}.${pa + 1}`
    : t === "minor"
      ? `${ma}.${mi + 1}.0`
      : `${ma + 1}.0.0`;
}

function bumpPrerelease(v: string, id: string): string {
  const [base, prerelease] = v.split("-", 2);
  if (!prerelease) return `${base}-${id}.0`;
  const [tag, serialRaw] = prerelease.split(".", 2);
  if (tag !== id) return `${base}-${id}.0`;
  const serial = Number.parseInt(serialRaw ?? "0", 10);
  const next = Number.isFinite(serial) ? serial + 1 : 0;
  return `${base}-${id}.${next}`;
}

function parseArgs(argv: string[]) {
  let tag = "latest";
  let bumpType: BumpType | undefined;
  let yes = false;
  let canary = false;
  let packageNames: string[] | null = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--tag" && next) {
      tag = next;
      i++;
      continue;
    }
    if (arg === "--bump" && next) {
      if (
        next === "patch" ||
        next === "minor" ||
        next === "major" ||
        next === "none" ||
        next === "prerelease"
      ) {
        bumpType = next;
      }
      i++;
      continue;
    }
    if (arg === "--canary") {
      canary = true;
      tag = "canary";
      bumpType = "prerelease";
      continue;
    }
    if (arg === "-y" || arg === "--yes") {
      yes = true;
    }
    if ((arg === "--packages" || arg === "--pkg") && next) {
      packageNames = next
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      i++;
      continue;
    }
  }

  return { tag, bumpType, yes, canary, packageNames };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const prompts = new PromptSession();
  console.log(`\n${brandTitle("publisher")}`);
  console.log(divider());
  console.log(sectionTitle("Release Publisher"));
  console.log(divider());
  console.log(`  ${dim("npm tag:")} ${cyan(args.tag)}`);
  if (args.canary) {
    console.log(`  ${dim("mode:")} ${cyan("canary")}`);
  }
  console.log("");

  const versions = await Promise.all(PACKAGES.map((p) => getVersion(p.path)));
  const choices = PACKAGES.map((pkg, i) => `${pkg.name} (${pkg.group}, v${versions[i]})`);
  const groups = PACKAGES.map((pkg) => pkg.group);
  const selectedLabels = args.yes
    ? args.packageNames
      ? choices.filter((_, index) => args.packageNames?.includes(PACKAGES[index].name))
      : choices
    : await prompts.multiSelect("Select packages to publish", choices, [], groups);
  const selectedSet = new Set(selectedLabels);
  const selectedIdxs = PACKAGES.map((pkg, i) => ({ pkg, i }))
    .filter(({ i }) => selectedSet.has(choices[i]))
    .map(({ i }) => i);
  if (!selectedIdxs.length) {
    console.log(eventLine("publish", "nothing selected", "warn"));
    prompts.close();
    process.exit(0);
  }

  const bumpType = args.bumpType
    ? args.bumpType
    : ((await prompts.select(
        "Version bump",
        ["patch", "minor", "major", "prerelease", "none"],
        args.canary ? 3 : 0,
      )) as BumpType);

  const chosen = selectedIdxs.map((i) => ({
    ...PACKAGES[i],
    current: versions[i],
  }));
  const newVersions: Record<string, string> = {};
  const chosenNameSet = new Set(chosen.map((pkg) => pkg.name));
  console.log(`\n  ${bold("Preview")}\n`);
  for (const pkg of chosen) {
    let nv = pkg.current;
    if (bumpType === "patch" || bumpType === "minor" || bumpType === "major") {
      nv = bump(pkg.current, bumpType);
    } else if (bumpType === "prerelease") {
      nv = bumpPrerelease(pkg.current, args.tag);
    }
    newVersions[pkg.name] = nv;
    const arrow =
      nv !== pkg.current
        ? `${dim(pkg.current)} → ${green(nv)}`
        : `${dim(`${pkg.current} (unchanged)`)}`;
    console.log(`  ${green("●")} ${white(pkg.name)}  ${arrow}`);
  }

  const proceed = args.yes ? true : await prompts.confirm("Proceed with publish?", false);
  if (!proceed) {
    console.log(`\n${eventLine("publish", "cancelled", "warn")}`);
    prompts.close();
    process.exit(0);
  }

  const lockVersions: Record<string, string> = {};
  const internalVersions = Object.fromEntries(
    PACKAGES.map((pkg, i) => [pkg.name, versions[i]]),
  ) as Record<string, string>;
  for (const pkgName of Object.keys(internalVersions)) {
    if (pkgName in newVersions) {
      lockVersions[pkgName] = newVersions[pkgName];
      continue;
    }
    if (args.canary && chosenNameSet.has(pkgName)) {
      lockVersions[pkgName] = newVersions[pkgName];
      continue;
    }
  }

  const originalManifests: Record<string, string> = {};
  for (const pkg of chosen) {
    originalManifests[pkg.path] = await Bun.file(`${pkg.path}/package.json`).text();
  }

  if (bumpType !== "none") {
    console.log(`\n  ${dim("Bumping versions...")}`);
    for (const pkg of chosen) {
      await setVersionAndLockInternalDeps(
        pkg.path,
        newVersions[pkg.name],
        args.canary ? lockVersions : {},
      );
      console.log(`  ${statusSuccess(`${pkg.name} → ${newVersions[pkg.name]}`)}`);
    }
  } else if (args.canary) {
    console.log(`\n  ${dim("Locking canary internal dependency versions...")}`);
    for (const pkg of chosen) {
      await setVersionAndLockInternalDeps(pkg.path, pkg.current, lockVersions);
      console.log(`  ${statusSuccess(`${pkg.name} dependency lock updated`)}`);
    }
  }

  console.log(`\n  ${dim("Publishing...")}\n`);
  let failed = 0;
  for (const pkg of chosen) {
    process.stdout.write(`  ${dim(`Publishing ${pkg.name}...`)}\n`);
    const proc = Bun.spawn(["bun", "publish", "--access", "public", "--tag", args.tag], {
      cwd: pkg.dir,
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    });
    const code = await proc.exited;
    if (code === 0) {
      console.log(statusSuccess(`${pkg.name}  ${dim(`v${newVersions[pkg.name]}`)}`));
    } else {
      console.log(statusError(`${pkg.name} exited ${code} — reverting version`));
      await Bun.write(`${pkg.path}/package.json`, originalManifests[pkg.path]);
      failed++;
    }
  }

  console.log(
    failed === 0
      ? `\n  ${green(bold("All packages published successfully"))}\n`
      : `\n  ${red(`${failed} package(s) failed`)}\n`,
  );
  prompts.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
