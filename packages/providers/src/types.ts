import type { ManicConfig } from "manicjs/config";

export interface BuildContext {
  dist: string;
  config: ManicConfig;
  apiEntries: string[];
  clientDir: string;
  serverFile: string;
}

export interface ManicProvider {
  name: string;
  build(context: BuildContext): Promise<void>;
}
