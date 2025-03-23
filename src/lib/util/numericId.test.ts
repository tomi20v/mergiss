// numericId.test.ts
import { describe, it, expect, vi } from 'vitest';
import { numericId } from './numericId';
import * as luiG from 'lui-g';

vi.mock('lui-g', () => ({
  uniqueId: vi.fn(),
}));

describe('numericId', () => {
  it('should convert uniqueId string to number', () => {
    (luiG.uniqueId as unknown as vi.Mock).mockReturnValue('12345');

    const result = numericId();

    expect(result).toBe(12345);
  });

  it('should return NaN if uniqueId returns non-numeric string', () => {
    (luiG.uniqueId as unknown as vi.Mock).mockReturnValue('abc');

    const result = numericId();

    expect(result).toBeNaN();
  });
});
