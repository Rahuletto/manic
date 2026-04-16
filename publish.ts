#!/usr/bin/env bun

import { readFileSync, writeFileSync } from "fs";
import { prompt } from "bun";

const packages = [
  { name: "manicjs", path: "packages/manic/package.json" },
  { name: "@manicjs/providers", path: "packages/providers/package.json" },
  { name: "create-manic", path: "packages/create-manic/package.json" },
];

async function getVersion(pkgPath: string): Promise<string> {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  return pkg.version;
}

async function updateVersion(pkgPath: string, newVersion: string): Promise<void> {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

async function bumpVersion(current: string, type: "patch" | "minor" | "major"): Promise<string> {
  const [major, minor, patch] = current.split(".").map(Number);
  
  if (type === "major") {
    return `${major + 1}.0.0`;
  } else if (type === "minor") {
    return `${major}.${minor + 1}.0`;
  } else {
    return `${major}.${minor}.${patch + 1}`;
  }
}

async function main() {
  console.log("📦 Manic Monorepo Publisher\n");

  const { selectedPackages, releaseType } = await prompt([
    {
      type: "multiselect",
      name: "selectedPackages",
      message: "Select packages to publish:",
      options: packages.map((p) => ({ value: p.name, label: `${p.name} (v${await getVersion(p.path)})` })),
      initial: packages.map((p) => p.name),
    },
    {
      type: "select",
      name: "releaseType",
      message: "Release type:",
      options: [
        { value: "patch", label: "Patch (bug fixes) - x.y.z+1" },
        { value: "minor", label: "Feature (new functionality) - x.y+1.0" },
        { value: "major", label: "Breaking change - x+1.0.0" },
      ],
    },
  ]);

  if (!selectedPackages || selectedPackages.length === 0) {
    console.log("No packages selected. Exiting.");
    return;
  }

  console.log(`\nPublishing ${selectedPackages.join(", ")} as ${releaseType} release...\n`);

  for (const pkgName of selectedPackages) {
    const pkg = packages.find((p) => p.name === pkgName);
    if (!pkg) continue;

    const currentVersion = await getVersion(pkg.path);
    const newVersion = await bumpVersion(currentVersion, releaseType);

    console.log(`Updating ${pkgName}: ${currentVersion} → ${newVersion}`);
    await updateVersion(pkg.path, newVersion);
  }

  console.log("\n✅ Versions updated. Run 'bun publish' to publish the packages.");
}

main();
