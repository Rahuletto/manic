#!/usr/bin/env bun
import { mkdir, cp, readdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve, join } from "path";
import * as readline from "readline";

const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string, defaultValue?: string): Promise<string> {
  const suffix = defaultValue ? dim(` (${defaultValue})`) : "";
  return new Promise((resolve) => {
    rl.question(`  ${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function askYesNo(
  question: string,
  defaultYes: boolean = true
): Promise<boolean> {
  const hint = defaultYes ? "Y/n" : "y/N";
  return new Promise((resolve) => {
    rl.question(`  ${question} ${dim(`(${hint})`)}: `, (answer) => {
      const a = answer.trim().toLowerCase();
      if (a === "") resolve(defaultYes);
      else resolve(a === "y" || a === "yes");
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  let projectName = args[0];

  console.log(`
${red(bold("■ MANIC"))}
${dim("--- --- --- --- ---")}
`);

  if (!projectName) {
    projectName = await ask("Project name", "my-manic-app");
  }

  const projectPath = resolve(process.cwd(), projectName);

  if (existsSync(projectPath)) {
    console.log(
      `\n${red("Error:")} Directory ${cyan(projectName)} already exists.`
    );
    rl.close();
    process.exit(1);
  }

  const appName = await ask("App name", projectName);
  const port = await ask("Port", "6070");
  const swagger = await askYesNo("Include Swagger API docs?", true);
  const viewTransitions = await askYesNo("Enable View Transitions?", true);

  console.log(`\n${dim("Creating project...")}\n`);

  const templatePath = join(import.meta.dir, "template");
  await mkdir(projectPath, { recursive: true });
  await cp(templatePath, projectPath, { recursive: true });

  const pkgPath = join(projectPath, "package.json");
  const pkg = await Bun.file(pkgPath).json();
  pkg.name = projectName;
  await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));

  const configContent = `import { defineConfig } from "manicjs/config";

export default defineConfig({
  app: {
    name: "${appName}",
  },

  server: {
    port: ${port},
  },

  router: {
    viewTransitions: ${viewTransitions},
  },

  swagger: ${
    swagger
      ? `{
    path: "/docs",
  }`
      : "false"
  },
});
`;

  await Bun.write(join(projectPath, "manic.config.ts"), configContent);

  console.log(`${green("Success!")} Created ${cyan(projectName)}`);
  console.log(`
${dim("Next steps:")}

  ${cyan(`cd ${projectName}`)}
  ${cyan("bun install")}
  ${cyan("bun dev")}
`);

  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
