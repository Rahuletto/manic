#!/usr/bin/env bun

const packages = [
  { name: "manicjs", path: "packages/manic/package.json" },
  { name: "@manicjs/providers", path: "packages/providers/package.json" },
  { name: "create-manic", path: "packages/create-manic/package.json" },
  { name: "@manicjs/api-docs", path: "plugins/api-docs/package.json" },
  { name: "@manicjs/sitemap", path: "plugins/sitemap/package.json" },
];

async function getVersion(pkgPath: string): Promise<string> {
  const pkg = await Bun.file(pkgPath).json();
  return pkg.version;
}

async function updateVersion(pkgPath: string, newVersion: string): Promise<void> {
  const pkg = await Bun.file(pkgPath).json();
  pkg.version = newVersion;
  await Bun.write(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

function bumpVersion(current: string, type: string): string {
  const [major, minor, patch] = current.split(".").map(Number);
  if (type === "1") return `${major}.${minor}.${patch + 1}`;
  if (type === "2") return `${major}.${minor + 1}.0`;
  if (type === "3") return `${major + 1}.0.0`;
  return current;
}

async function main() {
  console.log("\x1b[31m\x1b[1m■ MANIC\x1b[22m\x1b[39m \x1b[2mpublisher\x1b[22m\n");

  console.log("Select packages to bump:");
  for (let i = 0; i < packages.length; i++) {
    const v = await getVersion(packages[i].path);
    console.log(`  ${i + 1}. ${packages[i].name} \x1b[2m(v${v})\x1b[22m`);
  }
  console.log(`  ${packages.length + 1}. All Packages`);

  const pkgChoice = prompt("\nChoice: ");
  let selected = [];
  if (pkgChoice === String(packages.length + 1)) {
    selected = [...packages];
  } else {
    const idx = parseInt(pkgChoice || "") - 1;
    if (packages[idx]) selected.push(packages[idx]);
  }

  if (selected.length === 0) {
    console.log("No packages selected.");
    process.exit(0);
  }

  console.log("\nRelease type:");
  console.log("  1. Patch (x.y.z+1)");
  console.log("  2. Minor (x.y+1.0)");
  console.log("  3. Major (x+1.0.0)");

  const type = prompt("\nChoice [1]: ") || "1";

  console.log("");
  for (const pkg of selected) {
    const currentVersion = await getVersion(pkg.path);
    const newVersion = bumpVersion(currentVersion, type);
    console.log(`\x1b[32m●\x1b[39m ${pkg.name}: ${currentVersion} → ${newVersion}`);
    await updateVersion(pkg.path, newVersion);
  }

  console.log("\n\x1b[32m✓ Versions updated successfully\x1b[39m");
}

main();
