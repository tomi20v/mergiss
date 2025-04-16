import type Position from "$lib/game/geometry/Position";

enum EStitchLevel {
  normal = 1,
  matchingColors = 2,
  matchingColorsOverlap = 3,
}

function stitchLevel(
  position: Position,
  color: string,
  otherPosition: Position,
  otherColor: string
): EStitchLevel {
  // If colors don't match, return normal
  if (color !== otherColor) {
    return EStitchLevel.normal;
  }

  // If positions are exactly the same
  if (position.equalsTo(otherPosition)) {
    return EStitchLevel.matchingColorsOverlap;
  }

  // Colors match but positions are different
  return EStitchLevel.matchingColors;
}

export { EStitchLevel, stitchLevel };