import type Position from "./Position";

type PositionPair = {p1: Position, p2: Position, cnt?: number};

// return a {p1,p2} pair where p1 is always the "first", the one to the left or top
function sortedPositionPair(p1: Position, p2: Position): PositionPair {
  return (
    ((p1.atX == p2.atX) && (p1.atY <= p2.atY))
    ||
    ((p1.atY == p2.atY) && (p1.atX <= p2.atX))
  )
    ? {p1: p1, p2: p2,}
    : {p1: p2, p2: p1,}
}

export {type PositionPair, sortedPositionPair};
