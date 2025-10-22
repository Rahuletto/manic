#!/usr/bin/env bun

import { blue, bold, cyan, dim, red } from "colorette";
import { build } from "./commands/build";
import { dev } from "./commands/dev";
import { lint } from "./commands/lint";
import { start } from "./commands/start";

const commands = {
  dev,
  build,
  lint,
  start,
} as const;

type Command = keyof typeof commands;

const helpText = `
${dim(red("========================"))}
${bold(red("\t■ MANIC"))}
${dim(red("========================"))}

${bold("Usage:")}
  ${blue("manic")} <command> [options]

${bold("Commands:")}
  ${cyan("dev")}       Start development server with watch mode
  ${cyan("build")}     Build the application for production
  ${cyan("lint")}      Run type-aware linter
  ${cyan("start")}     Start production server

${bold("Options:")}
  -h, --help        Show this help message
  -v, --version     Show version number
  -p, --port PORT   Specify port (for dev/start commands)

${bold("Examples:")}
  ${blue("manic")} dev
  ${blue("manic")} dev --port 3000
  ${blue("manic")} build
  ${blue("manic")} lint
  ${blue("manic")} start --port 8080
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    console.log(helpText);
    process.exit(0);
  }

  if (args.includes("-v") || args.includes("--version")) {
    const pkg = await import("../../package.json");
    console.log(cyan(`v${pkg.version}`));
    process.exit(0);
  }

  const command = args[0] as Command;

  if (!(command in commands)) {
    console.error(red(`✗ Unknown command: ${command}`));
    console.log(helpText);
    process.exit(1);
  }

  const portFlagIndex = args.findIndex(arg => arg === "--port" || arg === "-p");
  const port = portFlagIndex !== -1 && args[portFlagIndex + 1] 
    ? parseInt(args[portFlagIndex + 1], 10) 
    : undefined;

  try {
    if (command === "dev" || command === "start") {
      await commands[command](port);
    } else {
      await commands[command]();
    }
  } catch (error) {
    console.error(red(`✗ Error running ${command}:`), error);
    process.exit(1);
  }
}

main();
