// @todo move out of components
export default class Position {

  readonly atX: number;
  readonly atY: number;
  // degrees
  readonly rotXY: number;

  static fromJSON(json: string): Position {
    const data = JSON.parse(json);
    return new Position(data.atX, data.atY, data.rotXY);
  }

  constructor(atX: number, atY: number, rotXY: number = 0) {
    this.atX = atX;
    this.atY = atY;
    this.rotXY = rotXY;
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

  sub(other: Position): Position {
    return new Position(this.atX - other.atX, this.atY - other.atY, this.rotXY - other.rotXY);
  }

}
