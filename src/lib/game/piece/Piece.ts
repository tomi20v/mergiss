import type {IProtoMap} from "$lib/game/piece/IProtoMap";

export default class Piece {

  private pixelMap: IProtoMap;
  private color: string;
  private pixelMap: number[][];

  public ts: number = new Date().getTime();

  constructor(
    pixelMap: IProtoMap,
    color: string,
    pixelMap: number[][],
  ) {
    this.color = color;
    this.pixelMap = pixelMap;
  }

}
