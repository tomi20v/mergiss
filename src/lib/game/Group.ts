import type Position from "$lib/game/geometry/Position";
import type Piece from "$lib/game/piece/Piece";
import {numericId} from "$lib/util/numericId";

export default class Group {

  readonly group: number;
  ttl: number = 0;

  static fromPiece(position: Position, piece: Piece): Group {
    return new Group(
      position.atX,
      position.atY,
      piece.weight,
      // 4.5 seems to have nicer css animation than typical 4 \@/
      piece.weight + 0.5
    );
  }

  // @todo here I'll have to handle upgrades and possible boosts or similar, and give more TTL accordingly
  constructor(
    readonly centerX: number,
    readonly centerY: number,
    readonly weight: number,
    ttl = 4
  ) {
    this.group = numericId();
    this.ttl = ttl;
  }

}
