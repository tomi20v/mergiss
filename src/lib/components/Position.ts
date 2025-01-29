// @todo move out of components
export default class Position {

  readonly atX: number;
  readonly atY: number;

  static fromJSON(json: string): Position {
    const data = JSON.parse(json);
    return new Position(data.atX, data.atY);
  }

  constructor(atX: number, atY: number) {
    this.atX = atX;
    this.atY = atY;
  }

  clone(): Position {
    return new Position(this.atX, this.atY);
  }

  equalsTo(other: Position): boolean {
    return this.equals(other.atX, other.atY);
  }

  equals(atX: number, atY: number): boolean {
    return (
      (this.atX === atX) &&
      (this.atY === atY)
    )
  }

  sub(other: Position): Position {
    return new Position(this.atX - other.atX, this.atY - other.atY);
  }

}
