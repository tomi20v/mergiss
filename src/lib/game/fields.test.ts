import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { emptyField } from './fields';
import {coloredField} from "$lib/game/fields";
import * as uniqueIdModule from 'lui-g';

// Mocking uniqueId function
vi.mock('lui-g', () => ({
  uniqueId: vi.fn(),
}));
describe('emptyField', () => {
  beforeEach(() => {
    (uniqueIdModule.uniqueId as Mock).mockReturnValue('mocked-id'); // Consistent ID stub
  });

  it('returns an object with color null and group 0 by default', () => {
    const result = emptyField();
    expect(result).toEqual({ id: 'mocked-id', color: null, group: 0 });
  });

  it('returns an object with color null and given group', () => {
    const result = emptyField(5);
    expect(result).toEqual({ id: 'mocked-id',color: null, group: 5 });
  });
});

describe('coloredField', () => {
  it('returns an object with given color and group 0 by default', () => {
    const result = coloredField('red');
    expect(result).toEqual({ id: 'mocked-id',color: 'red', group: 0 });
  });

  it('returns an object with given color and group', () => {
    const result = coloredField('blue', 3);
    expect(result).toEqual({ id: 'mocked-id',color: 'blue', group: 3 });
  });
});
