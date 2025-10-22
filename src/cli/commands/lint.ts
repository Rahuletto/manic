import { cyan, green, red } from "colorette";

export async function lint() {
  const proc = Bun.spawn(["bunx", "oxlint", "--type-aware"], {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  await proc.exited;
  const code = proc.exitCode ?? 0;

  if (code === 0) {
    console.log(green("\n✓ Linting passed!"));
  } else {
    console.error(red("\n✗ Linting failed"));
  }

  process.exit(code);
}
