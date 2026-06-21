interface PreloadPlugin {
  name: string;
  preload?: string;
}

/**
 * Registers Bun preload plugins by importing their preload scripts.
 */
export async function registerPreloadPlugins(
  plugins: PreloadPlugin[],
  onLog?: (scope: string, message: string) => void
): Promise<void> {
  await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.preload) return;
      try {
        const resolved = Bun.resolveSync(plugin.preload, process.cwd());
        await import(resolved);
        onLog?.('bundler', `Preloaded plugin: ${plugin.name}`);
      } catch (err) {
        console.warn(
          `[Bundler Preload] Failed to load ${plugin.preload}:`,
          err
        );
      }
    })
  );
}
