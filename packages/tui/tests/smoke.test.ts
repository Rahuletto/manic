import { describe, expect, it } from 'bun:test';
import * as tui from '../src/index';

describe('@manicjs/tui exports', () => {
  it('exposes branding constants and formatters', () => {
    expect(tui.BRAND_NAME).toBe('MANIC');
    expect(typeof tui.brandTitle).toBe('function');
    expect(typeof tui.eventLine).toBe('function');
  });
});
