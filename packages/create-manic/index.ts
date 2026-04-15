#!/usr/bin/env bun
import { mkdir, cp, rm } from "fs/promises";
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

function askChoice(
  question: string,
  choices: string[],
  defaultChoice: string
): Promise<string> {
  const choiceStr = choices
    .map((c) => (c === defaultChoice ? bold(c) : c))
    .join(" / ");
  return new Promise((resolve) => {
    rl.question(`  ${question} ${dim(`(${choiceStr})`)}: `, (answer) => {
      const a = answer.trim().toLowerCase();
      if (choices.includes(a)) resolve(a);
      else resolve(defaultChoice);
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
  const mode = await askChoice(
    "Project mode",
    ["fullstack", "frontend"],
    "fullstack"
  );
  const port = await ask("Port", "6070");
  const isFrontend = mode === "frontend";
  const swagger = isFrontend
    ? false
    : await askYesNo("Include Swagger API docs?", true);
  const viewTransitions = await askYesNo("Enable View Transitions?", true);

  console.log(`\n${dim("Creating project...")}\n`);

  const templatePath = join(import.meta.dir, "template");
  await mkdir(projectPath, { recursive: true });
  await cp(templatePath, projectPath, { recursive: true });

  if (isFrontend) {
    const apiDir = join(projectPath, "app", "api");
    if (existsSync(apiDir)) {
      await rm(apiDir, { recursive: true, force: true });
    }
  }

  const pkgPath = join(projectPath, "package.json");
  const pkg = await Bun.file(pkgPath).json();
  pkg.name = projectName;

  if (isFrontend) {
    delete pkg.dependencies["elysia"];
    delete pkg.dependencies["@elysiajs/static"];
    delete pkg.dependencies["@elysiajs/swagger"];
  }

  await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));

  const configContent = `import { defineConfig } from "manicjs/config";

export default defineConfig({${
    isFrontend
      ? `
  mode: "frontend",
`
      : ""
  }
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
