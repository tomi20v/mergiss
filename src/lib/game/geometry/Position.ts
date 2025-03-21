// @todo move out of components
import {angleToOrthogonal, type OrthogonalAngle} from "$lib/game/geometry/angleToOrthogonal";

export default class Position {

  readonly atX: number;
  readonly atY: number;
  // degrees
  readonly rotXY: OrthogonalAngle;

  static fromJSON(json: string): Position {
    const data = JSON.parse(json);
    return new Position(data.atX, data.atY, data.rotXY);
  }

  constructor(atX: number, atY: number, rotXY: number = 0) {
    this.atX = atX;
    this.atY = atY;
    // might or not be a good idea normalizing here but let's try
    this.rotXY = angleToOrthogonal(rotXY);
  }

  clone(): Position {
    return new Position(this.atX, this.atY, this.rotXY);
  }

  equalsTo(other: Position): boolean {
    return this.equals(other.atX, other.atY, other.rotXY);
  }

  equals(atX: number, atY: number, rotXY: number = 0): boolean {
    return (
      (this.atX === atX) &&
      (this.atY === atY) &&
      (this.rotXY === rotXY)
    );
  }

  scale(factor: number): Position {
    return new Position(this.atX * factor, this.atY * factor);
  }

  sub(other: Position): Position {
    return new Position(this.atX - other.atX, this.atY - other.atY, this.rotXY - other.rotXY);
  }

}
