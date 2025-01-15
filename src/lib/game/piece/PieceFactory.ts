import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import {randomArrayItem} from "$lib/util";
import colors from "$lib/game/colors";
import type { IProtoMap } from "./IProtoMap";

export default class PieceFactory {

  randomPiece(): Piece {
    const proto: IProtoMap = randomArrayItem(pieceCatalogue);
    const colorValues = Object.values(colors);
    const colorRand = Math.floor(Math.random() * colorValues.length);
    const color: string = colorValues[colorRand];
    const shadowColor: string = colorValues[colorRand < 8 ? colorRand + 8 : colorRand - 8];
    const piece = new Piece(
      proto,
      color,
      shadowColor
    );
    return piece;
  }

}