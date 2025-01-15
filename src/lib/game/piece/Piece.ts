import type {IProtoMap} from "$lib/game/piece/IProtoMap";

export default class Piece {

  readonly pixelMap: IProtoMap;
  readonly color: string;
  readonly shadowColor: string;

  public ts: number = new Date().getTime();

  constructor(
    pixelMap: IProtoMap,
    color: string,
    shadowColor: string,
  ) {
    this.pixelMap = pixelMap;
    this.color = color;
    this.shadowColor = shadowColor;
  }

}
