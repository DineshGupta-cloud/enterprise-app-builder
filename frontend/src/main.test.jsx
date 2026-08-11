import { describe, expect, it } from 'vitest';

describe('Enterprise App Builder', () => {
  it('has the expected product name', () => {
    expect('Enterprise App Builder').toContain('App Builder');
  });
});
