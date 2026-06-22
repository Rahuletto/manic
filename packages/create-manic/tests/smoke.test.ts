import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';

describe('create-manic package layout', () => {
  it('contains CLI entry and template directory', () => {
    expect(existsSync(new URL('../index.ts', import.meta.url))).toBe(true);
    expect(existsSync(new URL('../template', import.meta.url))).toBe(true);
  });
});
