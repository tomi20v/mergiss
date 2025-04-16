import { describe, it, expect, vi } from 'vitest';
import now from './now';

describe('now', () => {
  it('returns the current timestamp in seconds', () => {
    // Arrange
    const fakeMs = 1680000000000; // some fixed timestamp in ms
    const expected = fakeMs / 1000;

    vi.spyOn(Date, 'now').mockReturnValue(fakeMs);

    // Act
    const result = now();

    // Assert
    expect(result).toBe(expected);

    // Cleanup
    vi.restoreAllMocks();
  });
});
