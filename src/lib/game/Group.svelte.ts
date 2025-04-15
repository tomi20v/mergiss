import type Position from "$lib/game/geometry/Position";
import type Piece from "$lib/game/piece/Piece";
import {numericId} from "$lib/util/numericId";
import now from "$lib/util/now";

export default class Group {

  readonly group: number;
  // bit weird having reactive prop in a "native" class but works fine
  // (more than that, ttl is managed outside in the countdown component,
  //  that is historical)
  ttl: number = $state(0);
  public acceleratedTime = 0;

  static fromPiece(position: Position, piece: Piece): Group {
    return new Group(
      position.atX,
      position.atY,
      piece.weight,
      piece.weight,
      // 4.5 seems to have nicer css animation than typical 4 \@/
      piece.weight + 0.5,
      now()
    );
  }

  // @todo here I'll have to handle upgrades and possible boosts or similar, and give more TTL accordingly
  constructor(
    readonly centerX: number,
    readonly centerY: number,
    readonly weight: number,
    readonly score: number,
    ttl: number,
    public readonly createdAt: number
  ) {
    this.group = numericId();
    this.ttl = ttl;
  }

  addAcceleratedTime(time: number) {
    this.acceleratedTime += time;
  }

  setTtl(ttl: number) {
    this.ttl = ttl;
  }

}
