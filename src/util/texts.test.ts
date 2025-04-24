import { describe, it, expect } from 'vitest';
import { leetize } from './texts';

describe('leetize', () => {

  it('should replace "E" with "Ξ"', () => {
    expect(leetize('ELITE')).toBe('ΞLITΞ');
    expect(leetize('hell')).toBe('hΞll');
    expect(leetize('BELL')).toBe('BΞLL');
  });

  it('should replace "V" with "Λ"', () => {
    expect(leetize('VANGUARD')).toBe('ΛANGUARD');
    expect(leetize('victory')).toBe('Λictory');
    expect(leetize('rave')).toBe('raΛe');
  });

  it('should replace "N" with "Π"', () => {
    expect(leetize('NINJA')).toBe('ΠIΠJA');
    expect(leetize('entrance')).toBe('eΠtraΠce');
    expect(leetize('Neon')).toBe('ΠeoΠ');
  });

  it.skip('should replace "O" with "0"', () => {
    expect(leetize('CODE')).toBe('C0DΞ');
    expect(leetize('BONUS')).toBe('B0NUS');
    expect(leetize('COOL')).toBe('C00L');
  });

  it('should handle multiple replacements in the same string', () => {
    expect(leetize('SCORE BOOST')).toBe('SC0RΞ B00ST');
    expect(leetize('POWER LEVEL')).toBe('P0WΞR LΞVΞL');
    expect(leetize('NONE')).toBe('N0NΞ');
  });

  it('should handle empty strings', () => {
    expect(leetize('')).toBe('');
  });

});
