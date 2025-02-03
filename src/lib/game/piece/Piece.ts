import type {IProtoMap} from "$lib/game/piece/IProtoMap";
import {getUniqueId} from "$lib/util";

export default class Piece {

  readonly pixelMap: IProtoMap;
  readonly color: string;
  readonly shadowColor: string;
  // when re-constructed from JSON, this originalTs will hold original value
  readonly originalUniqueId: number = 0;

  readonly uniqueId: number = getUniqueId();

  static fromJSON(json: string): Piece {
    const data = JSON.parse(json);
    return new Piece(data.pixelMap, data.color, data.shadowColor, data.uniqueId);
  }

  constructor(
    pixelMap: IProtoMap,
    color: string,
    shadowColor: string,
    originalUniqueId: number = 0
  ) {
    this.pixelMap = pixelMap;
    this.color = color;
    this.shadowColor = shadowColor;
    this.originalUniqueId = originalUniqueId;
  }

  equals(other: Piece): boolean {
    return this.uniqueId === other.uniqueId;
  }

  sizeX(): number {
    return this.pixelMap[0]?.length || 0;
  }

  sizeY(): number {
    return this.pixelMap.length;
  }

}
