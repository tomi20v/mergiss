import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import {randomColorPair} from "$lib/game/colors";
import { type PixelMapType } from "./PixelMapType";
import {randomArrayItem} from "$lib/util/randomArrayItem";

export default class PieceFactory {

  randomPiece(): Piece {
    const proto: PixelMapType = randomArrayItem(pieceCatalogue);
    const randomColors = randomColorPair();
    return new Piece(
      proto,
      randomColors.color,
      randomColors.otherColor
    );
  }

}
