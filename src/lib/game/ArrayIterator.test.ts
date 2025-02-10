// Vitest tests
import ArrayIterator from "$lib/game/ArrayIterator";
import { describe, it, expect } from 'vitest';

describe('ArrayIterator', () => {
  it('should iterate over elements in order', () => {
    const arr = new ArrayIterator([1, 2, 3]);
    const result = [...arr];
    expect(result).toEqual([1, 2, 3]);
  });

  it('should iterate over elements in reverse order', () => {
    const arr = new ArrayIterator([1, 2, 3], true);
    const result = [...arr];
    expect(result).toEqual([3, 2, 1]);
  });

  it('should allow indexed access like an array', () => {
    const arr = new ArrayIterator([10, 20, 30]);
    expect(arr[0]).toBe(10);
    expect(arr[1]).toBe(20);
    expect(arr[2]).toBe(30);
  });

  it('should handle nested arrays', () => {
    const arr = new ArrayIterator([1, [2, 3], 4]);
    const result = [...arr];
    expect(result[1]).toBeInstanceOf(ArrayIterator);
    expect([...result[1]]).toEqual([2, 3]);
  });

  it('should reverse an iterator correctly', () => {
    const arr = new ArrayIterator([1, 2, 3]);
    const reversed = arr.reverse();
    expect([...reversed]).toEqual([3, 2, 1]);
  });
});
