import type { BunPlugin } from 'bun';

const CLIENT_DIRECTIVE = /^\s*['"]use client['"]/m;
const SERVER_DIRECTIVE = /^\s*['"]use server['"]/m;

interface ClientComponentInfo {
  path: string;
  exports: string[];
  dependencies: string[];
}

export function clientDirectivePlugin(): BunPlugin {
  const clientComponents = new Map<string, ClientComponentInfo>();

  return {
    name: 'manic:client-directive',
    async setup(build) {
      build.onLoad({ filter: /\.(tsx|jsx)$/ }, async args => {
        if (args.path.includes('node_modules')) return;

        const source = await Bun.file(args.path).text();

        if (CLIENT_DIRECTIVE.test(source)) {
          clientComponents.set(args.path, {
            path: args.path,
            exports: extractExports(source),
            dependencies: extractImports(source),
          });

          return {
            contents: source.replace(CLIENT_DIRECTIVE, ''),
            loader: 'tsx',
          };
        }

        if (SERVER_DIRECTIVE.test(source)) {
          return {
            contents: source.replace(SERVER_DIRECTIVE, ''),
            loader: 'tsx',
          };
        }
      });

      build.onEnd(() => {
        build.onEnd = undefined;
      });
    },
  };
}

function extractExports(source: string): string[] {
  const exports: string[] = [];
  const exportRegex =
    /^export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/gm;
  let match;
  while ((match = exportRegex.exec(source)) !== null) {
    exports.push(match[1]);
  }
  return exports;
}

function extractImports(source: string): string[] {
  const imports: string[] = [];
  const importRegex = /^import\s+(?:{[^}]*}\s+from\s+)?['"]([^'"]+)['"]/gm;
  let match;
  while ((match = importRegex.exec(source)) !== null) {
    if (!match[1].startsWith('.')) {
      imports.push(match[1]);
    }
  }
  return imports;
}

export function getClientComponents(): Map<string, ClientComponentInfo> {
  return clientComponents;
}
