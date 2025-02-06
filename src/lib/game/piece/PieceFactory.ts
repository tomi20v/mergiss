import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import {randomArrayItem} from "$lib/util";
import {randomColorPair} from "$lib/game/colors";
import type { IProtoMap } from "./IProtoMap";

export default class PieceFactory {

  randomPiece(): Piece {
    const proto: IProtoMap = randomArrayItem(pieceCatalogue);
    const randomColors = randomColorPair();
    return new Piece(
      proto,
      randomColors.color,
      randomColors.otherColor
    );
  }

}
