import { describe, expect, it } from 'bun:test';
import * as bundler from '../src/index';

describe('@manicjs/bundler exports', () => {
  it('exposes core build APIs', () => {
    expect(typeof bundler.buildApplication).toBe('function');
    expect(typeof bundler.countRoutes).toBe('function');
    expect(typeof bundler.minifyDir).toBe('function');
  });
});
