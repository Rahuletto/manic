import type { ManicConfig } from 'manicjs/config';

/**
 * Context passed to provider build functions
 * @interface BuildContext
 * @see https://www.manicjs.tech/docs/core/providers-contract#interface
 */
export interface BuildContext {
  /** Build output directory (typically ".manic") */
  dist: string;
  /** Loaded Manic configuration */
  config: ManicConfig;
  /** List of API route entry files */
  apiEntries: string[];
  /** Path to client build output directory */
  clientDir: string;
  /** Path to bundled server file */
  serverFile: string;
}

/**
 * Interface for deployment providers
 * @interface ManicProvider
 * @see https://www.manicjs.tech/docs/core/providers-contract#interface
 */
export interface ManicProvider {
  /** Provider name (e.g., "vercel", "cloudflare", "netlify") */
  name: string;
  /** Build function that generates platform-specific output */
  build(context: BuildContext): Promise<void>;
}
