import type {IProtoMap} from "$lib/game/piece/IProtoMap";

export default class Piece {

  readonly pixelMap: IProtoMap;
  readonly color: string;
  readonly shadowColor: string;

  readonly ts: number = new Date().getTime();
  // public ts: number = uniqueId();

  // when re-constructed from JSON, this originalTs will hold original value
  originalTs: number = 0;

  static fromJSON(json: string): Piece {
    const data = JSON.parse(json);
    const ret = new Piece(data.pixelMap, data.color, data.shadowColor);
    ret.originalTs = data.ts;
    return ret;
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
    return this.pixelMap[0]?.length || 0;
  }

  sizeY(): number {
    return this.pixelMap.length;
  }

}
