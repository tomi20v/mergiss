import Piece from "$lib/game/Piece";

export default class PieceFactory {

  // @todo create one random piece. At some point we'd need parameters (which pieces are available)
  randomPiece(): Piece {
    const piece = new Piece();
    return piece;
  }

}