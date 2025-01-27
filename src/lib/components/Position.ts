export default class Position {
  atX: number;
  atY: number;

  constructor(atX: number, atY: number) {
    this.atX = atX;
    this.atY = atY;
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

  clone(): Position {
    return new Position(this.atX, this.atY);
  }

}
