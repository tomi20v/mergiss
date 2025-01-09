import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import type IProtoPiece from "$lib/game/piece/IProtoPiece";
import {randomArrayItem} from "$lib/util";

export default class PieceFactory {

  // @todo create one random piece. At some point we'd need parameters (which pieces are available)
  randomPiece(): Piece {
    const proto: IProtoPiece = randomArrayItem(pieceCatalogue);
    const piece = new Piece(
      proto.color,
      proto.pixelMap
    );
    return piece;
  }

}