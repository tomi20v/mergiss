import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import {randomColorPair} from "$lib/game/colors";
import {randomArrayItem} from "$lib/util/randomArrayItem";

export default class PieceFactory {

  randomPiece(): Piece {
    const shape: string = randomArrayItem(Object.keys(pieceCatalogue));
    const randomColors = randomColorPair();
    return new Piece(
      shape,
      pieceCatalogue[shape],
      randomColors.color,
      randomColors.otherColor
    );
  }

}
