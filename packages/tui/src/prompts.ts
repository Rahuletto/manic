import * as readline from 'readline';
import { cyan, dim, yellow } from './index';

const ANSI_REGEX = /\x1b\[[0-9;]*m/gu;

function clearLines(count: number): void {
  for (let i = 0; i < count; i++) {
    process.stdout.write('\x1b[2K');
    process.stdout.write('\x1b[1A');
  }
  process.stdout.write('\x1b[2K\r');
}

function visibleLength(value: string): number {
  return value.replace(ANSI_REGEX, '').length;
}

function countWrappedRows(lines: string[]): number {
  const width = Math.max(process.stdout.columns ?? 80, 20);
  return lines.reduce((total, line) => {
    const len = visibleLength(line);
    return total + Math.max(1, Math.ceil(len / width));
  }, 0);
}

export class PromptSession {
  private rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async input(question: string, defaultValue?: string): Promise<string> {
    const suffix = defaultValue ? dim(` (${defaultValue})`) : '';
    return await new Promise(resolve => {
      this.rl.question(`  ${question}${suffix}: `, answer => {
        resolve(answer.trim() || defaultValue || '');
      });
    });
  }

  async confirm(question: string, defaultYes: boolean = true): Promise<boolean> {
    const choice = await this.select(question, ['yes', 'no'], defaultYes ? 0 : 1);
    return choice === 'yes';
  }

  async select(
    question: string,
    choices: string[],
    defaultIndex: number = 0
  ): Promise<string> {
    let selected = Math.max(0, Math.min(defaultIndex, choices.length - 1));
    let previousRows = 0;
    const wasRaw = process.stdin.isRaw;
    if (process.stdin.isTTY) process.stdin.setRawMode?.(true);
    this.rl.pause();
    process.stdin.resume();

    const render = (): number => {
      const lines: string[] = [];
      lines.push(`  ${question} ${dim('(use ↑/↓ and Enter)')}`);
      for (let i = 0; i < choices.length; i++) {
        const prefix = i === selected ? yellow('›') : dim(' ');
        const value = i === selected ? cyan(choices[i]) : choices[i];
        lines.push(`  ${prefix} ${value}`);
      }
      process.stdout.write(`${lines.join('\n')}\n`);
      return countWrappedRows(lines);
    };

    previousRows = render();

    return await new Promise(resolve => {
      const onData = (buffer: Buffer) => {
        const key = buffer.toString('utf8');
        if (key === '\u0003') {
          process.stdin.off('data', onData);
          if (process.stdin.isTTY) process.stdin.setRawMode?.(wasRaw ?? false);
          this.rl.close();
          process.exit(130);
        }

        if (key === '\r') {
          process.stdin.off('data', onData);
          if (process.stdin.isTTY) process.stdin.setRawMode?.(wasRaw ?? false);
          clearLines(previousRows);
          this.rl.resume();
          resolve(choices[selected]);
          return;
        }

        if (key === '\u001b[A') selected = (selected - 1 + choices.length) % choices.length;
        if (key === '\u001b[B') selected = (selected + 1) % choices.length;

        clearLines(previousRows);
        previousRows = render();
      };

      process.stdin.on('data', onData);
    });
  }

  async multiSelect(
    question: string,
    choices: string[],
    defaultSelected: number[] = [],
    groups: (string | null | undefined)[] = []
  ): Promise<string[]> {
    let cursor = 0;
    let previousRows = 0;
    const selected = new Set<number>(
      defaultSelected.filter(i => i >= 0 && i < choices.length)
    );
    const wasRaw = process.stdin.isRaw;
    if (process.stdin.isTTY) process.stdin.setRawMode?.(true);
    this.rl.pause();
    process.stdin.resume();

    const render = (): number => {
      const lines: string[] = [];
      lines.push(`  ${question} ${dim('(space=toggle, a=all, ↑/↓ and Enter)')}`);
      let lastGroup = '';
      for (let i = 0; i < choices.length; i++) {
        const group = groups[i] ?? '';
        if (group && group !== lastGroup) {
          lastGroup = group;
          lines.push(`  ${dim(`── ${group} ──`)}`);
        }
        const pointer = i === cursor ? yellow('›') : dim(' ');
        const marker = selected.has(i) ? cyan('●') : dim('○');
        const value = i === cursor ? cyan(choices[i]) : choices[i];
        lines.push(`  ${pointer} ${marker} ${value}`);
      }
      process.stdout.write(`${lines.join('\n')}\n`);
      return countWrappedRows(lines);
    };

    previousRows = render();

    return await new Promise(resolve => {
      const onData = (buffer: Buffer) => {
        const key = buffer.toString('utf8');
        if (key === '\u0003') {
          process.stdin.off('data', onData);
          if (process.stdin.isTTY) process.stdin.setRawMode?.(wasRaw ?? false);
          this.rl.close();
          process.exit(130);
        }

        if (key === '\r') {
          process.stdin.off('data', onData);
          if (process.stdin.isTTY) process.stdin.setRawMode?.(wasRaw ?? false);
          clearLines(previousRows);
          this.rl.resume();
          resolve([...selected].sort((a, b) => a - b).map(i => choices[i]));
          return;
        }

        if (key === '\u001b[A') cursor = (cursor - 1 + choices.length) % choices.length;
        if (key === '\u001b[B') cursor = (cursor + 1) % choices.length;
        if (key === ' ') {
          if (selected.has(cursor)) selected.delete(cursor);
          else selected.add(cursor);
        }
        if (key.toLowerCase() === 'a') {
          if (selected.size === choices.length) selected.clear();
          else {
            selected.clear();
            for (let i = 0; i < choices.length; i++) selected.add(i);
          }
        }

        clearLines(previousRows);
        previousRows = render();
      };

      process.stdin.on('data', onData);
    });
  }

  close(): void {
    this.rl.close();
  }
}
