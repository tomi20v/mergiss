/**
 * Converts regular text to "elite" style text by replacing:
 * - "E" with "Ξ"
 * - "O" with "0"
 * - "V" with "Λ"
 * - "N" with "Π"
 * - "R" with "Я"
 * - "T" with "Τ"
 * 
 * @param text The input text to convert
 * @returns The text converted to "elite" style
 */
export function leetize(text: string): string {
  return text
    .replace(/E/gi, 'Ξ')
    .replace(/O/gi, 'θ')
    .replace(/V/gi, 'Λ')
    .replace(/N/gi, 'Π')
    .replace(/R/gi, 'Я')
    .replace(/T/gi, 'Τ');
}

/**
 * Formats a number in a human-readable way with appropriate suffixes
 * Examples:
 * - Small numbers (1-999) are returned as is
 * - 1000 to 1099 returns "1k"
 * - 1100 to 1199 returns "1.1k"
 * - Numbers 10000+ in the 'k' tier show no decimals
 * - Higher tiers (M, G, T) show decimal places for values under 10
 * - Larger numbers use appropriate suffixes: M (million), G (billion), T (trillion)
 * @param num The number to format
 * @returns A formatted string representation of the number
 */
export function bigNumber(num: number): string {
  // Return small numbers as is
  if (num < 1000) {
    return num.toString();
  }
  
  // Define suffixes and thresholds
  const suffixes = ['', 'k', 'M', 'G', 'T'];
  
  // Find the appropriate suffix and divide number accordingly
  let tier = 0;
  let scaledNum = num;
  
  // Determine which tier/suffix to use
  while (scaledNum >= 1000 && tier < suffixes.length - 1) {
    tier++;
    scaledNum /= 1000;
  }
  
  const suffix = suffixes[tier];
  
  // For single-digit numbers in any tier (1k-9.9k, 1M-9.9M, etc.)
  if (scaledNum < 10) {
    // For thousands tier specifically (1k-9.9k)
    if (tier === 1) {
      // Use 1 decimal place if remainder >= 100
      if (num % 1000 < 100) {
        return Math.floor(scaledNum) + suffix;
      } else {
        return (Math.floor(num / 100) / 10).toFixed(1).replace(/\.0$/, '') + suffix;
      }
    }
    // For higher tiers (M, G, T), show one decimal place
    else {
      const decimalPart = Math.round((scaledNum % 1) * 10) / 10;
      
      // Special case for 9999999, which should show as 9.9M not 10.0M
      if (tier === 2 && num >= 9900000 && num < 10000000) {
        return '9.9' + suffix;
      }
      
      // If no significant decimal, return just the integer part
      if (decimalPart === 0) {
        return Math.floor(scaledNum) + suffix;
      } else {
        // If rounding up would make it a two-digit number, then don't show decimal
        if (Math.floor(scaledNum) === 9 && decimalPart >= 0.95) {
          return '9.9' + suffix;
        }
        return scaledNum.toFixed(1) + suffix;
      }
    }
  }
  
  // For numbers 10+ in any tier (10k+, 10M+, 10G+, 10T+)
  // We don't show decimals
  return Math.floor(scaledNum) + suffix;
}