import { bold, cyan, green, red, yellow } from "colorette";
import { join } from "path";

async function runCommand(command: string[]): Promise<number> {
  const proc = Bun.spawn(command, {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  await proc.exited;
  return proc.exitCode ?? 0;
}

export async function build() {
  const lintCode = await runCommand(["bunx", "oxlint", "--type-aware"]);
  if (lintCode !== 0) {
    console.error(red("✗ Linting failed"));
    process.exit(lintCode);
  }

  const packageBuildScript = join(import.meta.dir, "../../build.ts");

  const [routesCode, buildCode] = await Promise.all([
    runCommand(["bunx", "tsr", "generate"]),
    runCommand(["bun", "run", packageBuildScript]),
  ]);

  if (routesCode !== 0) {
    console.error(red("✗ Route generation failed"));
    process.exit(routesCode);
  }

  if (buildCode !== 0) {
    console.error(red("✗ Build failed"));
    process.exit(buildCode);
  }
}
