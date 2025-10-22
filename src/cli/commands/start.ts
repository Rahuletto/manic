import { bold, dim, green, red, yellow } from "colorette";

async function isPortInUse(port: number): Promise<boolean> {
  try {
    const server = Bun.listen({
      port,
      hostname: "localhost",
      socket: {
        open() {},
        data() {},
      },
    });
    server.stop();
    return false;
  } catch {
    return true;
  }
}

export async function start(port?: number) {
  const defaultPort = port || parseInt(process.env.PORT || "6070", 10);

  if (await isPortInUse(defaultPort)) {
    console.error(red(`✗ Port ${defaultPort} is already in use`));
    console.log(
      yellow(`Try running with a different port: manic start --port <port>`),
    );
    process.exit(1);
  }

  const env = {
    ...process.env,
    NODE_ENV: "production",
    PORT: defaultPort.toString(),
  };

  const proc = Bun.spawn(["bun", ".manic/server.js"], {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
    env,
  });

  const cleanup = () => {
    proc.kill();
    process.exit();
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  await proc.exited;
  process.exit(proc.exitCode ?? 0);
}
