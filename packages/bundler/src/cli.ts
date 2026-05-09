#!/usr/bin/env bun
import { buildApplication } from "./index";

interface CliConfig {
  config: {
    mode?: "fullstack" | "frontend";
    app?: { name?: string };
  };
  dist?: string;
  clientPlugins?: import("bun").BunPlugin[];
  serverPlugins?: import("bun").BunPlugin[];
}

const command = process.argv[2] ?? "build";
const configArg = process.argv[3] ?? "bundler.config.ts";

if (command !== "build") {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

const configModule = await import(`${process.cwd()}/${configArg}`);
const loaded = (configModule.default ?? configModule) as CliConfig;

if (!loaded?.config) {
  console.error(`Missing "config" export in ${configArg}`);
  process.exit(1);
}

const summary = await buildApplication({
  config: loaded.config,
  dist: loaded.dist ?? ".dist",
  clientPlugins: loaded.clientPlugins ?? [],
  serverPlugins: loaded.serverPlugins ?? [],
  runLint: true,
  onPending: (message) => console.log(`[bundler] ${message}`),
  onSuccess: (message) => console.log(`[bundler] ${message}`),
  onError: (message) => console.error(`[bundler] ${message}`),
});

console.log("[bundler] Build completed");
console.log(`[bundler] Output: ${summary.dist}`);
