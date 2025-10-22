import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { bold, cyan, dim, green, red, yellow } from "colorette";
import { transform } from "lightningcss";

const distDir = "./.manic";
const publicDir = "./public";
const tempDir = `${distDir}/.temp`;

const startTime = performance.now();

console.log(bold(red("\n■ Building application for production\n")));

try {
  rmSync(distDir, { recursive: true, force: true });
} catch {}

mkdirSync(tempDir, { recursive: true });
mkdirSync(`${tempDir}/api`, { recursive: true });
mkdirSync(`${tempDir}/routes`, { recursive: true });

const formatSize = (kb: number): string => {
  if (kb < 1) return cyan(`${(kb * 1024).toFixed(0)} B`);
  if (kb < 10) return green(`${kb.toFixed(2)} kB`);
  if (kb < 50) return green(`${kb.toFixed(1)} kB`);
  if (kb < 150) return yellow(`${kb.toFixed(1)} kB`);
  return red(`${kb.toFixed(1)} kB`);
};

const formatTime = (ms: number): string => {
  if (ms < 1000) return cyan(`${ms.toFixed(0)}ms`);
  return cyan(`${(ms / 1000).toFixed(2)}s`);
};

console.log(dim("Transpiling and compiling..."));

function collectFiles(
  dir: string,
  options: {
    extension: string;
    excludePattern?: RegExp;
    excludeFiles?: string[];
  },
): string[] {
  const files: string[] = [];

  function walkSync(currentDir: string): void {
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = `${currentDir}/${entry.name}`;
      if (entry.isDirectory()) {
        walkSync(fullPath);
      } else if (
        entry.name.endsWith(options.extension) &&
        !entry.name.startsWith("_") &&
        !options.excludeFiles?.includes(entry.name)
      ) {
        if (!options.excludePattern || !options.excludePattern.test(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  }

  walkSync(dir);
  return files;
}

function generateAPIRegistry() {
  const apiDir = "./app/api";
  const files = collectFiles(apiDir, {
    extension: ".ts",
    excludeFiles: ["__registry.ts"],
  });

  const imports: string[] = [];
  const routes: Record<string, string> = {};

  files.forEach((file, index) => {
    const relativePath = file.replace("./app/api/", "");
    const importName = `api${index}`;

    let routePath = "/";
    if (relativePath !== "index.ts") {
      const parts = relativePath.replace(".ts", "").split("/");
      if (parts[parts.length - 1] === "index") {
        parts.pop();
      }
      if (parts.length > 0) {
        routePath = `/${parts.join("/")}`;
      }
    }

    imports.push(
      `import ${importName} from "./${relativePath.replace(".ts", "")}";`,
    );
    routes[routePath] = importName;
  });

  const registryContent = `${imports.join("\n")}

export const apiRegistry = {
${Object.entries(routes)
  .map(([path, handler]) => `  "${path}": ${handler},`)
  .join("\n")}
};
`;

  writeFileSync("./app/api/__registry.ts", registryContent);
  return files.length;
}

generateAPIRegistry();

const transpiler = new Bun.Transpiler({
  loader: "ts",
  target: "bun",
  minifyWhitespace: true,
  deadCodeElimination: true,
  treeShaking: true,
  allowBunRuntime: true,
  trimUnusedImports: true,
});

const apiFiles = collectFiles("./app/api", {
  extension: ".ts",
  excludeFiles: ["__registry.ts"],
});

for (const file of apiFiles) {
  const relativePath = file.replace("./app/api/", "");
  const source = await Bun.file(file).text();

  const replaced = source.replace(
    /process\.env\.NODE_ENV === ["']production["']/g,
    "true",
  );

  const transpiled = transpiler.transformSync(replaced);
  const outputPath = `${tempDir}/api/${relativePath.replace(".ts", ".js")}`;

  const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
  mkdirSync(outputDir, { recursive: true });

  await Bun.write(outputPath, transpiled);
}

const serverSource = await Bun.file("./server.ts").text();
const serverReplaced = serverSource.replace(
  /process\.env\.NODE_ENV === ["']production["']/g,
  "true",
);
const serverTranspiled = transpiler.transformSync(serverReplaced);
await Bun.write(`${tempDir}/server.js`, serverTranspiled);

const clientTranspiler = new Bun.Transpiler({
  loader: "tsx",
  target: "browser",
  minifyWhitespace: true,
  deadCodeElimination: true,
  treeShaking: true,
  trimUnusedImports: true,
});

const routeFiles = collectFiles("./app/frontend/routes", {
  extension: ".tsx",
});

for (const file of routeFiles) {
  const relativePath = file.replace("./app/frontend/routes/", "");
  if (relativePath === "__root.tsx") continue;

  const source = await Bun.file(file).text();

  const replaced = source
    .replace(/process\.env\.NODE_ENV === ["']production["']/g, "true")
    .replace(/process\.env\.NODE_ENV === ["']development["']/g, "false")
    .replace(/__DEV__/g, "false");

  const transpiled = clientTranspiler.transformSync(replaced);
  const outputPath = `${tempDir}/routes/${relativePath.replace(".tsx", ".js")}`;

  const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
  mkdirSync(outputDir, { recursive: true });

  await Bun.write(outputPath, transpiled);
}

const mainSource = await Bun.file("./app/frontend/~main.tsx").text();
const mainReplaced = mainSource
  .replace(/process\.env\.NODE_ENV === ["']production["']/g, "true")
  .replace(/process\.env\.NODE_ENV === ["']development["']/g, "false")
  .replace(/__DEV__/g, "false");
const mainTranspiled = clientTranspiler.transformSync(mainReplaced);
await Bun.write(`${tempDir}/~main.js`, mainTranspiled);

console.log(green("✓ Bundled"));

const apiRouteMap: Record<string, string> = {};

console.log(dim("\nServer:"));

let totalApiMinified = 0;

for (const file of apiFiles) {
  const relativePath = file.replace("./app/api/", "");
  const routeName = relativePath.replace(".ts", "").replace(/\//g, "-");
  const transpiledFile = `${tempDir}/api/${relativePath.replace(".ts", ".js")}`;

  let routePath = "/api";
  if (relativePath !== "index.ts") {
    const parts = relativePath.replace(".ts", "").split("/");
    if (parts[parts.length - 1] === "index") {
      parts.pop();
    }
    if (parts.length > 0) {
      routePath = `/api/${parts.join("/")}`;
    }
  } else {
    routePath = "/api";
  }

  const minifiedBuild = await Bun.build({
    entrypoints: [transpiledFile],
    outdir: `${distDir}/api`,
    target: "bun",
    minify: {
      whitespace: true,
      identifiers: true,
      syntax: true,
    },
    sourcemap: "external",
    naming: `${routeName}.[hash].js`,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    external: [],
  });

  const minifiedOutput = minifiedBuild.outputs.find(
    (o) => o.path.endsWith(".js") && !o.path.endsWith(".map"),
  );
  const hashedFilename = minifiedOutput
    ? minifiedOutput.path.split("/").pop()
    : `${routeName}.js`;

  apiRouteMap[routePath] = hashedFilename || `${routeName}.js`;

  if (!minifiedBuild.success) {
    console.error(bold(red(`✗ Failed to build ${file}`)));
    for (const log of minifiedBuild.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  const minifiedSize = minifiedOutput ? minifiedOutput.size / 1024 : 0;
  totalApiMinified += minifiedSize;

  console.log(
    `  ${green("✓")} ${routePath.padEnd(30)} ${formatSize(minifiedSize)}`,
  );
}

const transpiledServerContent = await Bun.file(`${tempDir}/server.js`).text();
await Bun.write(`${distDir}/server.js`, transpiledServerContent);

const serverSize = statSync(`${distDir}/server.js`).size / 1024;

console.log(
  `  ${green("✓")} server.js (loader)             ${formatSize(serverSize)}`,
);

const totalServerSize = totalApiMinified + serverSize;

console.log(dim("\nClient:"));

let totalRoutesMinified = 0;

for (const file of routeFiles) {
  const relativePath = file.replace("./app/frontend/routes/", "");
  if (relativePath === "__root.tsx") continue;

  const routeName = relativePath.replace(".tsx", "").replace(/\//g, "-");
  const transpiledFile = `${tempDir}/routes/${relativePath.replace(".tsx", ".js")}`;

  let routePath = "/";
  if (relativePath !== "index.tsx" && relativePath !== "__root.tsx") {
    const parts = relativePath.replace(".tsx", "").split("/");
    if (parts[parts.length - 1] === "index") {
      parts.pop();
    }
    if (parts.length > 0 && !parts[0].startsWith("_")) {
      routePath = `/${parts.join("/")}`;
    }
  }

  const minifiedBuild = await Bun.build({
    entrypoints: [transpiledFile],
    outdir: `${distDir}/public/routes`,
    target: "browser",
    minify: {
      whitespace: true,
      identifiers: true,
      syntax: true,
    },
    splitting: false,
    sourcemap: "external",
    naming: `${routeName}.[hash].js`,
    external: ["react", "react-dom", "@tanstack/react-router"],
    define: {
      "process.env.NODE_ENV": '"production"',
      __DEV__: "false",
    },
  });

  if (!minifiedBuild.success) {
    console.error(bold(red(`✗ Failed to build route ${file}`)));
    continue;
  }

  const minifiedOutput = minifiedBuild.outputs.find(
    (o) => o.path.endsWith(".js") && !o.path.endsWith(".map"),
  );
  const minifiedSize = minifiedOutput ? minifiedOutput.size / 1024 : 0;
  totalRoutesMinified += minifiedSize;

  console.log(
    `  ${green("✓")} ${routePath.padEnd(30)} ${formatSize(minifiedSize)}`,
  );
}

const mainMinifiedBuild = await Bun.build({
  entrypoints: [`${tempDir}/~main.js`],
  outdir: `${distDir}/public`,
  target: "browser",
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
  splitting: true,
  sourcemap: "external",
  naming: {
    entry: "[name].[hash].[ext]",
    chunk: "chunk-[hash].[ext]",
    asset: "[name].[hash].[ext]",
  },
  external: ["react", "react-dom", "@tanstack/react-router", "manicjs"],
  define: {
    "process.env.NODE_ENV": '"production"',
    __DEV__: "false",
  },
});

if (!mainMinifiedBuild.success) {
  console.error(bold(red("✗ Main client build failed:")));
  for (const log of mainMinifiedBuild.logs) {
    console.error(log);
  }
  process.exit(1);
}

const jsFiles = mainMinifiedBuild.outputs.filter(
  (o) => o.path.endsWith(".js") && !o.path.endsWith(".map"),
);
const cssFiles = mainMinifiedBuild.outputs.filter((o) =>
  o.path.endsWith(".css"),
);

const mainChunk = jsFiles.find((f) => f.path.includes("~main"));
const otherChunks = jsFiles.filter((f) => f !== mainChunk);

const mainSize = (mainChunk?.size || 0) / 1024;
const chunksSize =
  otherChunks.reduce((sum, f) => sum + (f.size || 0), 0) / 1024;
const cssSize = cssFiles.reduce((sum, o) => sum + (o.size || 0), 0) / 1024;
const totalMainMinified = mainSize + chunksSize + cssSize;

console.log(
  `  ${green("✓")} ~main.js (entry)               ${formatSize(mainSize)}`,
);
if (chunksSize > 0) {
  console.log(
    `  ${green("✓")} chunks (${otherChunks.length})                        ${formatSize(chunksSize)}`,
  );
}

let finalCssSize = cssSize;
if (cssSize > 0) {
  for (const cssFile of cssFiles) {
    const cssPath = cssFile.path;
    const cssContent = readFileSync(cssPath);

    const { code } = transform({
      filename: cssPath,
      code: cssContent,
      minify: true,
      targets: {
        chrome: 90,
      },
    });

    writeFileSync(cssPath, code);
  }

  finalCssSize = cssFiles.reduce(
    (sum, o) => sum + statSync(o.path).size / 1024,
    0,
  );
  console.log(
    `  ${green("✓")} styles (Lightning CSS)         ${formatSize(finalCssSize)}`,
  );
}

const totalClientMinified =
  totalMainMinified + totalRoutesMinified - cssSize + finalCssSize;

const mainBundlePath = mainChunk?.path.split("/public/")[1] || "";
const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Elysia React App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${mainBundlePath}"></script>
  </body>
</html>
`;

await Bun.write(`${distDir}/public/index.html`, htmlContent);

try {
  const publicFiles = await Array.fromAsync(
    new Bun.Glob("**/*").scan({ cwd: publicDir }),
  );
  for (const file of publicFiles) {
    if (file === "index.html") continue;
    await Bun.write(
      `${distDir}/public/${file}`,
      Bun.file(`${publicDir}/${file}`),
    );
  }
} catch {}

rmSync(tempDir, { recursive: true, force: true });

const totalMinified = totalServerSize + totalClientMinified;
const buildTime = performance.now() - startTime;

console.log(bold(green("\n✓ Build completed successfully\n")));
console.log(bold("Production Bundle:"));
console.log(dim("────────────────────────────────────────"));
console.log(
  `${dim("Server")}              ${formatSize(totalServerSize).padStart(10)} ${dim(`(${apiFiles.length} routes)`)}`,
);
console.log(
  `${dim("Client")}              ${formatSize(totalClientMinified).padStart(10)} ${dim(`(${routeFiles.length} routes)`)}`,
);
console.log(dim("────────────────────────────────────────"));
console.log(
  bold(
    `${dim("Total")}               ${formatSize(totalMinified).padStart(10)}` +
      "\n",
  ),
);

console.log(dim(`Built in ${formatTime(buildTime)}`));
console.log(dim(`Output: ${distDir}/`));
console.log(dim(`Start: ${green("bun start")}\n`));
