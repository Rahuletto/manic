#!/usr/bin/env bun
import { mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

interface BuildCaseResult {
  name: string;
  runsSec: number[];
  warmAvgSec: number;
  warmMinSec: number;
  warmMaxSec: number;
  distKb: number;
}

async function runBuild(cwd: string): Promise<number> {
  const start = performance.now();
  const proc = Bun.spawn(['bun', 'run', 'build'], {
    cwd,
    stdout: 'ignore',
    stderr: 'pipe',
    env: process.env,
  });
  const stderr = await new Response(proc.stderr).text();
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`build failed in ${cwd}\n${stderr}`);
  }
  return (performance.now() - start) / 1000;
}

async function dirSizeKb(dir: string): Promise<number> {
  const proc = Bun.spawn(['du', '-sk', dir], {
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env,
  });
  const stdout = await new Response(proc.stdout).text();
  const code = await proc.exited;
  if (code !== 0) return 0;
  const value = Number.parseInt(stdout.trim().split(/\s+/)[0] ?? '0', 10);
  return Number.isFinite(value) ? value : 0;
}

function stats(values: number[]) {
  const sum = values.reduce((acc, value) => acc + value, 0);
  const average = values.length > 0 ? sum / values.length : 0;
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;
  return { average, min, max };
}

async function benchmarkCase(
  name: string,
  cwd: string,
  runs: number,
): Promise<BuildCaseResult> {
  const timings: number[] = [];
  for (let index = 0; index < runs; index += 1) {
    await rm(join(cwd, '.manic'), { recursive: true, force: true });
    const seconds = await runBuild(cwd);
    timings.push(Number(seconds.toFixed(3)));
  }
  const warm = timings.slice(1);
  const warmStats = stats(warm);
  const distKb = await dirSizeKb(join(cwd, '.manic'));
  return {
    name,
    runsSec: timings,
    warmAvgSec: Number(warmStats.average.toFixed(3)),
    warmMinSec: Number(warmStats.min.toFixed(3)),
    warmMaxSec: Number(warmStats.max.toFixed(3)),
    distKb,
  };
}

async function main() {
  const root = process.cwd();
  const outputDir = join(root, '.tmp');
  const outputPath = join(outputDir, 'canary-baseline.json');
  if (!existsSync(join(root, 'demo'))) {
    throw new Error('Run this script from the umbrella root.');
  }
  await mkdir(outputDir, { recursive: true });
  const stable = await benchmarkCase(
    'stable-demo-runtime',
    join(outputDir, 'bench-bundler/stable-demo'),
    4,
  );
  const canary = await benchmarkCase('canary-runtime', join(root, 'demo'), 4);
  const deltaPct = stable.warmAvgSec > 0
    ? Number((((canary.warmAvgSec / stable.warmAvgSec) - 1) * 100).toFixed(2))
    : 0;
  const sizeDeltaPct = stable.distKb > 0
    ? Number((((canary.distKb / stable.distKb) - 1) * 100).toFixed(2))
    : 0;

  const result = {
    timestamp: new Date().toISOString(),
    stable,
    canary,
    delta: {
      warmAvgSec: Number((canary.warmAvgSec - stable.warmAvgSec).toFixed(3)),
      warmAvgPct: deltaPct,
      distKb: canary.distKb - stable.distKb,
      distPct: sizeDeltaPct,
    },
    gates: {
      noBuildRegression: deltaPct <= 5,
      noSizeRegression: sizeDeltaPct <= 5,
    },
  };

  await Bun.write(outputPath, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}

await main();
