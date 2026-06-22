import { existsSync } from 'fs';
import type { BuildContext } from './types';

export async function runLint(
  context: BuildContext,
  lintConfigPath?: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const { cwd, onPending, onSuccess, onError } = context;
  const localBin = `${cwd}/node_modules/.bin/oxlint`;
  const useLocalBin = existsSync(localBin);
  const args = lintConfigPath
    ? ['--config', lintConfigPath, '.']
    : existsSync(`${cwd}/.oxlintrc.json`)
      ? ['--config', '.oxlintrc.json', '.']
      : ['.'];

  onPending?.('Linting with oxlint...');
  const proc = Bun.spawn([useLocalBin ? localBin : 'oxlint', ...args], {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env,
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    onError?.('Linting failed');
    return { stdout, stderr, exitCode };
  }

  onSuccess?.('Linting passed');
  return { stdout, stderr, exitCode };
}
