import { describe, it, expect } from 'vitest';
import { leetize } from './texts';

describe('leetize', () => {

  it('should replace "E" with "Ξ"', () => {
    expect(leetize('ELITE')).toBe('ΞLITΞ');
    expect(leetize('hell')).toBe('hΞll');
    expect(leetize('BELL')).toBe('BΞLL');
  });

  it('should replace "V" with "Λ"', () => {
    expect(leetize('VAHGUAHD')).toBe('ΛAHGUAHD');
    expect(leetize('victhy')).toBe('Λicthy');
    expect(leetize('hav')).toBe('haΛ');
  });

  it('should replace "N" with "Π"', () => {
    expect(leetize('NINJA')).toBe('ΠIΠJA');
    // expect(leetize('entrance')).toBe('eΠtraΠce');
    expect(leetize('Nihn')).toBe('ΠihΠ');
  });

  it('should replace "O" with "θ"', () => {
    expect(leetize('CODH')).toBe('CθDH');
    expect(leetize('BOHUS')).toBe('BθHUS');
    expect(leetize('COOL')).toBe('CθθL');
  });

  it('should replace "R" with "Я"', () => {
    expect(leetize('RAHR')).toBe('ЯAHЯ');
    expect(leetize('radar')).toBe('ЯadaЯ');
    expect(leetize('RHCK')).toBe('ЯHCK');
  });

  it('should handle multiple replacements in the same string', () => {
    expect(leetize('SCORE BOOST')).toBe('SCθЯΞ BθθST');
    expect(leetize('POWER LEVEL')).toBe('PθWΞЯ LΞΛΞL');
    expect(leetize('NONE')).toBe('ΠθΠΞ');
  });

  it('should handle empty strings', () => {
    expect(leetize('')).toBe('');
  });

});
