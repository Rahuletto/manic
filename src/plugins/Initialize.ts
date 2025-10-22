import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  bgCyan,
  bgYellow,
  bold,
  cyan,
  dim,
  gray,
  green,
  red,
  yellow,
} from "colorette";
import Elysia from "elysia";

const startTime = performance.now();

export const initPlugin = new Elysia({ name: "framework.init" }).onStart(
  ({ server }) => {
    const envFilePath = path.join(process.cwd(), ".env");
    const envFileExists = existsSync(envFilePath);

    let envVarKeys: string[] = [];

    if (envFileExists) {
      try {
        const envFileContent = readFileSync(envFilePath, "utf-8");

        envVarKeys = envFileContent
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && !line.startsWith("#"))
          .map((line) => line.split("=")[0]!.trim());
      } catch (error) {
        console.error(red(`\n\t\tError reading .env file: ${error.message}`));
      }
    }

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    const prod = !server?.development;
    const url = server?.url;

    console.log(
      `\n\n\t\t${red(bold("■ MANIC"))}            ${prod ? yellow(`${bgYellow(" PROD ")} Server`) : cyan(` ${bgCyan(" DEV ")} Server`)}\n\t\t--- --- --- --- --- ---  --- ---`,

      `\n\t\t${cyan(bold("URL"))}:      ${green(url)}\n`,
      `\n\t\t${green("Ready in")} ${bold(duration + "ms")}\n`,
      envVarKeys.length >= 1
        ? `\n\t\t${dim(gray(`Injected env from ${bold(".env")}`))}\n` +
            `\t\t${envVarKeys.map((key) => yellow(`└─ ${key} = ****************`)).join("\n\t\t")}\n\n`
        : "\n",
    );
  },
);
