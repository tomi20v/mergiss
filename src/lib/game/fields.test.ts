import { describe, it, expect } from 'vitest';
import { emptyField } from './fields';
import {coloredField} from "$lib/game/fields";

describe('emptyField', () => {
  it('returns an object with color null and group 0 by default', () => {
    const result = emptyField();
    expect(result).toEqual({ color: null, group: 0 });
  });

  it('returns an object with color null and given group', () => {
    const result = emptyField(5);
    expect(result).toEqual({ color: null, group: 5 });
  });
});

describe('coloredField', () => {
  it('returns an object with given color and group 0 by default', () => {
    const result = coloredField('red');
    expect(result).toEqual({ color: 'red', group: 0 });
  });

  it('returns an object with given color and group', () => {
    const result = coloredField('blue', 3);
    expect(result).toEqual({ color: 'blue', group: 3 });
  });
});
