/**
 * Converts regular text to "elite" style text by replacing:
 * - "E" with "Ξ"
 * - "O" with "0"
 * - "V" with "Λ"
 * - "N" with "Π"
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
}
