/**
 * Adjusts the brightness of a hex color
 * @param hex Hex color code (e.g. #FF0000)
 * @param factor Brightness factor (0-2, where <1 is darker, >1 is brighter)
 * @returns Adjusted hex color
 */
export function adjustColorBrightness(hex: string, factor: number): string {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, Math.round(r * factor)));
  g = Math.min(255, Math.max(0, Math.round(g * factor)));
  b = Math.min(255, Math.max(0, Math.round(b * factor)));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Converts a hex color to rgba with specified opacity
 * @param hex Hex color code (e.g. #FF0000)
 * @param opacity Opacity value (0-1)
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, opacity: number): string {
  // Ensure opacity is between 0 and 1
  opacity = Math.min(1, Math.max(0, opacity));

  // Convert hex to RGB
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
