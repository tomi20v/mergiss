import type Position from "$lib/game/geometry/Position";
import type {PositionPair} from "$lib/game/geometry/positionPair";

enum EStitchLevel {
  normal,
  matchingColors,
  matchingColorsOverlap,
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

type Stitch = PositionPair & {
  level: EStitchLevel;
  group: number;
}

export { EStitchLevel, stitchLevel, type Stitch };
