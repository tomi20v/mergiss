import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import type IProtoPiece from "$lib/game/piece/IProtoPiece";

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export default class PieceFactory {

  // @todo create one random piece. At some point we'd need parameters (which pieces are available)
  randomPiece(): Piece {
    const proto: IProtoPiece = getRandomElement(pieceCatalogue);
    const piece = new Piece(
      proto.color,
      proto.pixelMap
    );
    return piece;
  }

}