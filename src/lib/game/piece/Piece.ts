export default class Piece {

  private color: string;
  private pixelMap: number[][];

  public ts: number = new Date().getTime();

  constructor(
    color: string,
    pixelMap: number[][],
  ) {
    this.color = color;
    this.pixelMap = pixelMap;
  }

}
