import type Piece from "$lib/game/piece/Piece";

export default interface PieceDragData {
  piece: Piece|null;
}