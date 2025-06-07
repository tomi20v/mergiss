import type Position from "$lib/game/geometry/Position";

export default interface PiecePositionOverBoardData {
  boardSize: {sizeX: number, sizeY: number};
  position: {atX: number, atY: number};
}
