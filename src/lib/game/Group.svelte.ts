import type Position from "$lib/game/geometry/Position";
import type Piece from "$lib/game/piece/Piece";
import {numericId} from "$lib/util/numericId";

export default class Group {

  readonly group: number;
  // bit weird having reactive prop in a "native" class but works fine
  // (more than that, ttl is managed outside in the countdown component,
  //  that is historical)
  ttl: number = $state(0);
  public accelerateTime = 0;

  static fromPiece(position: Position, piece: Piece): Group {
    return new Group(
      position.atX,
      position.atY,
      piece.weight,
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
    readonly score: number = weight,
    ttl: number,
  ) {
    this.group = numericId();
    this.ttl = ttl;
  }

  setTtl(ttl: number) {
    this.ttl = ttl;
  }

  addAccelerateTime(time: number) {
    this.accelerateTime += time;
  }

}
