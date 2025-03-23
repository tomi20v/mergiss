import type Position from "./Position";
import {numericId} from "$lib/util/numericId";

type PositionPair = {p1: Position, p2: Position, id: number, cnt?: number};

// return a {p1,p2} pair where p1 is always the "first", the one to the left or top
function sortedPositionPair(p1: Position, p2: Position): PositionPair {
  return (
    ((p1.atX == p2.atX) && (p1.atY <= p2.atY))
    ||
    ((p1.atY == p2.atY) && (p1.atX <= p2.atX))
  )
    ? {p1: p1, p2: p2, id: numericId()}
    : {p1: p2, p2: p1, id: numericId()};
}

export {type PositionPair, sortedPositionPair};
