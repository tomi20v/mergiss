import type {IProtoMap} from "$lib/game/piece/IProtoMap";
import {uniqueId} from "lui-g";
import { FlatteningIterator } from "@tomi20v/iterators";

export default class Piece {

  readonly pixelMap: IProtoMap;
  readonly color: string;
  readonly shadowColor: string;
  // when re-constructed from JSON, this originalTs will hold original value
  readonly originalUniqueId: string = '';

  readonly uniqueId: string = uniqueId();

  static fromJSON(json: string): Piece {
    const data = JSON.parse(json);
    return new Piece(data.pixelMap, data.color, data.shadowColor, data.uniqueId);
  }

  constructor(
    pixelMap: IProtoMap,
    color: string,
    shadowColor: string,
    originalUniqueId: string = ''
  ) {
    this.pixelMap = pixelMap;
    this.color = color;
    this.shadowColor = shadowColor;
    this.originalUniqueId = originalUniqueId;
  }

  get weight(): number {
    return this.pixelMap.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0);
  }

  getFlatIterator(): FlatteningIterator<number> {
    return new FlatteningIterator<number>(this.pixelMap, ['y', 'x']);
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
