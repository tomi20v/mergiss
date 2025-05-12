import { describe, it, expect } from 'vitest';
import {bigNumber, leetize} from './texts';

describe('leetize', () => {

  it('should replace "E" with "Ξ"', () => {
    expect(leetize('ELITE')).toBe('ΞLIΤΞ');
    expect(leetize('hell')).toBe('hΞll');
    expect(leetize('BELL')).toBe('BΞLL');
  });

  it('should replace "V" with "Λ"', () => {
    expect(leetize('VAHGUAHD')).toBe('ΛAHGUAHD');
    expect(leetize('victhy')).toBe('ΛicΤhy');
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

  it('should replace "T" with "Τ"', () => {
    expect(leetize('TOTAL')).toBe('ΤθΤAL');
    expect(leetize('test')).toBe('ΤΞsΤ');
    expect(leetize('TOOT')).toBe('ΤθθΤ');
  });

  it('should handle multiple replacements in the same string', () => {
    expect(leetize('SCORE BOOST')).toBe('SCθЯΞ BθθSΤ');
    expect(leetize('POWER LEVEL')).toBe('PθWΞЯ LΞΛΞL');
    expect(leetize('NONE')).toBe('ΠθΠΞ');
  });

  it('should handle empty strings', () => {
    expect(leetize('')).toBe('');
  });
});

describe('bigNumber', () => {
  it('should return small numbers as is', () => {
    expect(bigNumber(1)).toBe('1');
    expect(bigNumber(182)).toBe('182');
    expect(bigNumber(999)).toBe('999');
  });

  it('should format thousands with "k" suffix without decimal when evenly divisible by 100', () => {
    expect(bigNumber(1000)).toBe('1k');
    expect(bigNumber(1099)).toBe('1k');
  });

  it('should format thousands with "k" suffix and one decimal place when needed', () => {
    expect(bigNumber(1100)).toBe('1.1k');
    expect(bigNumber(1123)).toBe('1.1k');
    expect(bigNumber(7381)).toBe('7.3k');
  });

  it('should format tens of thousands with "k" suffix without decimal', () => {
    expect(bigNumber(11234)).toBe('11k');
  });

  it('should handle larger numbers correctly', () => {
    expect(bigNumber(25600)).toBe('25k');
    expect(bigNumber(99999)).toBe('99k');
    expect(bigNumber(123456)).toBe('123k');
    expect(bigNumber(999999)).toBe('999k');
  });
  
  it('should format specific decimal values in higher tiers correctly', () => {
    // Test 9.4 million
    expect(bigNumber(9400000)).toBe('9.4M');
    
    // Test 2.9 million
    expect(bigNumber(2900000)).toBe('2.9M');
    
    // Test various decimal values in millions
    expect(bigNumber(1200000)).toBe('1.2M');
    expect(bigNumber(5300000)).toBe('5.3M');
    expect(bigNumber(8700000)).toBe('8.7M');
    
    // Test 7.6 billion
    expect(bigNumber(7600000000)).toBe('7.6G');
    
    // Test 2.5 trillion
    expect(bigNumber(2500000000000)).toBe('2.5T');
    
    // Test 3.8 billion
    expect(bigNumber(3800000000)).toBe('3.8G');
    
    // Test 4.9 trillion
    expect(bigNumber(4900000000000)).toBe('4.9T');
  });
  
  it('should format numbers with decimals in higher tiers', () => {
    // Numbers in the millions range with potential decimal points
    expect(bigNumber(9400000)).toBe('9.4M');    // Should show one decimal place
    expect(bigNumber(1234567)).toBe('1.2M');    // Should show one decimal place
    expect(bigNumber(6789012)).toBe('6.8M');    // Should show one decimal place
    
    // Numbers in the billions range with potential decimal points
    expect(bigNumber(7600000000)).toBe('7.6G');  // Should show one decimal place
    expect(bigNumber(3210000000)).toBe('3.2G');  // Should show one decimal place
    expect(bigNumber(8765000000)).toBe('8.8G');  // Should show one decimal place
    
    // Numbers in the trillions range with potential decimal points
    expect(bigNumber(2500000000000)).toBe('2.5T'); // Should show one decimal place
    expect(bigNumber(4321000000000)).toBe('4.3T'); // Should show one decimal place
  });
  
  it('should format single-digit numbers with decimals in higher tiers', () => {
    // Test single-digit millions with various decimal values
    expect(bigNumber(1200000)).toBe('1.2M');   // 1.2 million
    expect(bigNumber(3450000)).toBe('3.5M');   // 3.45 million
    expect(bigNumber(5678000)).toBe('5.7M');   // 5.678 million
    
    // Test single-digit billions with various decimal values
    expect(bigNumber(2340000000)).toBe('2.3G');   // 2.34 billion
    expect(bigNumber(5678000000)).toBe('5.7G');   // 5.678 billion
    
    // Test single-digit trillions with various decimal values
    expect(bigNumber(1230000000000)).toBe('1.2T');   // 1.23 trillion
    expect(bigNumber(9876000000000)).toBe('9.9T');   // 9.876 trillion
  });
  
  it('should handle edge cases at tier boundaries', () => {
    // Just below and at boundary for thousands
    expect(bigNumber(999)).toBe('999');
    expect(bigNumber(1000)).toBe('1k');
  
    // Just below and at boundary for millions
    expect(bigNumber(999999)).toBe('999k');
    expect(bigNumber(1000000)).toBe('1M');
    
    // Just below and at boundary for billions
    expect(bigNumber(999999999)).toBe('999M');
    expect(bigNumber(1000000000)).toBe('1G');
    
    // Just below and at boundary for trillions
    expect(bigNumber(999999999999)).toBe('999G');
    expect(bigNumber(1000000000000)).toBe('1T');
  });
  
  it('should correctly format single-digit thousands, millions, billions, and trillions', () => {
    // Single-digit thousands with different remainders
    expect(bigNumber(1000)).toBe('1k');
    expect(bigNumber(1050)).toBe('1k');
    expect(bigNumber(1100)).toBe('1.1k');
    expect(bigNumber(1350)).toBe('1.3k');
    expect(bigNumber(1900)).toBe('1.9k');
    
    // Single-digit millions
    expect(bigNumber(1000000)).toBe('1M');
    expect(bigNumber(1500000)).toBe('1.5M');
    expect(bigNumber(9900000)).toBe('9.9M');
    
    // Single-digit billions
    expect(bigNumber(1000000000)).toBe('1G');
    expect(bigNumber(5000000000)).toBe('5G');
    
    // Single-digit trillions
    expect(bigNumber(1000000000000)).toBe('1T');
    expect(bigNumber(3000000000000)).toBe('3T');
  });
  
  it('should correctly format double-digit thousands, millions, billions, and trillions', () => {
    // Double-digit thousands
    expect(bigNumber(10000)).toBe('10k');
    expect(bigNumber(10500)).toBe('10k');
    expect(bigNumber(10501)).toBe('10k');  // No longer a special case
    expect(bigNumber(12345)).toBe('12k');
    expect(bigNumber(99900)).toBe('99k');
    
    // Double-digit millions
    expect(bigNumber(10000000)).toBe('10M');
    expect(bigNumber(12000000)).toBe('12M');
    expect(bigNumber(23000000)).toBe('23M');
    expect(bigNumber(99000000)).toBe('99M');
  });

    // Double-digit billions

  it('should handle edge cases', () => {
    expect(bigNumber(0)).toBe('0');
    expect(bigNumber(10500)).toBe('10k');
    expect(bigNumber(10501)).toBe('10k');
  });
  
  it('should format millions with "M" suffix', () => {
    expect(bigNumber(1000000)).toBe('1M');
    expect(bigNumber(1100000)).toBe('1.1M');
    expect(bigNumber(1500000)).toBe('1.5M');
    expect(bigNumber(2900000)).toBe('2.9M');
    expect(bigNumber(9900000)).toBe('9.9M');
  });
  
  it('should handle additional edge cases for millions and billions', () => {
    // Double-digit boundary
    expect(bigNumber(9999999)).toBe('9.9M');
    expect(bigNumber(10000000)).toBe('10M');
    
    // Additional test cases
    expect(bigNumber(12345678)).toBe('12M');
    expect(bigNumber(98765432)).toBe('98M');
    
    // Three-digit millions
    expect(bigNumber(123000000)).toBe('123M');
    expect(bigNumber(999000000)).toBe('999M');
  });
  
  it('should format billions with "G" suffix', () => {
    expect(bigNumber(1000000000)).toBe('1G');
    expect(bigNumber(5500000000)).toBe('5.5G');
    expect(bigNumber(9900000000)).toBe('9.9G');
  });
  
  it('should format trillions with "T" suffix', () => {
    expect(bigNumber(1000000000000)).toBe('1T');
    expect(bigNumber(9900000000000)).toBe('9.9T');
  });
  
  it('should format quadrillions with "P" suffix', () => {
    expect(bigNumber(1000000000000000)).toBe('1P');
    expect(bigNumber(1500000000000000)).toBe('1.5P');
    expect(bigNumber(9900000000000000)).toBe('9.9P');
    expect(bigNumber(10000000000000000)).toBe('10P');
    expect(bigNumber(123000000000000000)).toBe('123P');
  });
  
  it('should format quintillions with "E" suffix', () => {
    expect(bigNumber(1000000000000000000)).toBe('1E');
    expect(bigNumber(2800000000000000000)).toBe('2.8E');
    expect(bigNumber(9900000000000000000)).toBe('9.9E');
    expect(bigNumber(42000000000000000000)).toBe('42E');
  });
});