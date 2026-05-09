import { describe, it, expect } from "bun:test";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const WORKSPACE_ROOT = join(import.meta.dir, "../..");

describe("Workspace Structure", () => {
  it("should have bun.lock", () => {
    expect(existsSync(join(WORKSPACE_ROOT, "bun.lock"))).toBe(true);
  });

  it("should have package.json with workspaces config", () => {
    const pkg = JSON.parse(
      readFileSync(join(WORKSPACE_ROOT, "package.json"), "utf-8")
    );
    expect(pkg.workspaces).toBeDefined();
    expect(Array.isArray(pkg.workspaces)).toBe(true);
    expect(pkg.workspaces.length).toBeGreaterThan(0);
  });

  it("should have all required documentation", () => {
    const docs = ["AGENTS.md", "DEVELOPMENT.md", "AI_AGENT_CHECKLIST.md"];
    docs.forEach((doc) => {
      expect(existsSync(join(WORKSPACE_ROOT, doc))).toBe(true);
    });
  });

  it("should have quality config files", () => {
    const configs = [".oxlintrc.json", ".oxfmt.json"];
    configs.forEach((config) => {
      expect(existsSync(join(WORKSPACE_ROOT, config))).toBe(true);
    });
  });

  it("should have git hooks installed", () => {
    expect(existsSync(join(WORKSPACE_ROOT, ".githooks/pre-push"))).toBe(true);
  });
});

describe("Workspace Packages", () => {
  const packages = ["core", "bundler", "providers", "create-manic", "tui"];

  packages.forEach((pkg) => {
    it(`${pkg} should have package.json`, () => {
      const pkgPath = join(WORKSPACE_ROOT, pkg, "package.json");
      expect(existsSync(pkgPath)).toBe(true);
    });

    it(`${pkg} should have valid package.json`, () => {
      const pkgPath = join(WORKSPACE_ROOT, pkg, "package.json");
      const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
      expect(pkgJson.name).toBeDefined();
      expect(pkgJson.version).toBeDefined();
    });
  });
});

describe("Workspace Plugins", () => {
  const plugins = [
    "tailwind",
    "unocss",
    "mdx",
    "mcp",
    "seo",
    "sitemap",
    "api-docs",
  ];

  plugins.forEach((plugin) => {
    it(`plugin-${plugin} should have package.json`, () => {
      const pluginPath = join(WORKSPACE_ROOT, "plugins", plugin, "package.json");
      expect(existsSync(pluginPath)).toBe(true);
    });

    it(`plugin-${plugin} should have valid exports`, () => {
      const pluginPath = join(WORKSPACE_ROOT, "plugins", plugin, "package.json");
      const pkgJson = JSON.parse(readFileSync(pluginPath, "utf-8"));
      expect(pkgJson.main || pkgJson.exports).toBeDefined();
    });
  });
});
