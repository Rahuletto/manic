import { cyan, dim, red, yellow } from "colorette";

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

export async function dev(port?: number) {
  const defaultPort = port || parseInt(process.env.PORT || "6070", 10);

  if (await isPortInUse(defaultPort)) {
    console.error(red(`✗ Port ${defaultPort} is already in use`));
    console.log(
      yellow(`Try running with a different port: manic dev --port <port>`),
    );
    process.exit(1);
  }

  const routesWatcher = Bun.spawn(["bunx", "tsr", "watch"], {
    stdout: "ignore",
    stderr: "ignore",
  });

  const env = { ...process.env, PORT: defaultPort.toString() };

  const devServer = Bun.spawn(["bun", "--watch", "server.ts"], {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
    env,
  });

  const cleanup = () => {
    routesWatcher.kill();
    devServer.kill();
    process.exit();
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  await devServer.exited;
  routesWatcher.kill();
  process.exit(devServer.exitCode ?? 0);
}
