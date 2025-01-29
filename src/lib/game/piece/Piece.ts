import type {IProtoMap} from "$lib/game/piece/IProtoMap";

export default class Piece {

  readonly pixelMap: IProtoMap;
  readonly color: string;
  readonly shadowColor: string;

  readonly ts: number = new Date().getTime();
  // public ts: number = uniqueId();

  static fromJSON(json: string): Piece {
    const data = JSON.parse(json);
    return new Piece(data.pixelMap, data.color, data.shadowColor);
  }

  constructor(
    pixelMap: IProtoMap,
    color: string,
    shadowColor: string,
  ) {
    this.pixelMap = pixelMap;
    this.color = color;
    this.shadowColor = shadowColor;
  }

  sizeX(): number {
    // return this.pixelMap.length > 0 ? this.pixelMap[0].length : 0;
    return this.pixelMap[0]?.length;
  }

  sizeY(): number {
    return this.pixelMap.length;
  }

}
