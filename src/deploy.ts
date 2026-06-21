interface ProviderBuildContext {
  dist: string;
  config: { app?: { name?: string }; providers?: Provider[] };
  apiEntries: string[];
  clientDir: string;
  serverFile: string;
}

interface Provider {
  name: string;
  build(ctx: ProviderBuildContext): Promise<void>;
}

/**
 * Detects configured deployment providers and runs their build functions.
 */
export async function packageForDetectedHost<
  TConfig extends { providers?: Provider[] },
>(
  dist: string,
  config: TConfig,
  apiEntries: string[],
  onPending?: (message: string) => void,
  onSuccess?: (message: string) => void
): Promise<void> {
  const providers = config.providers ?? [];
  if (providers.length === 0) return;

  const context: ProviderBuildContext = {
    dist,
    config: config as any,
    apiEntries,
    clientDir: `${dist}/client`,
    serverFile: `${dist}/server.js`,
  };

  await Promise.all(
    providers.map(async provider => {
      try {
        onPending?.(`Packaging for ${provider.name}...`);
        await provider.build(context);
        onSuccess?.(`Packaged for ${provider.name}`);
      } catch (err) {
        console.error(`[Bundler Deploy] ${provider.name} build failed:`, err);
      }
    })
  );
}
