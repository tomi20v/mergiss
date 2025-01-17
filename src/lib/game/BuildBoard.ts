import type {IProtoMap} from "$lib/game/piece/IProtoMap";

export default class BuildBoard {

  sizeX: number;
  sizeY: number;

  fields: IProtoMap = [];
  
  constructor(
    sizeX: number = 1,
    sizeY: number = 1
  ) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    for (let x=0; x<this.sizeX; x++) {
      const row: number[] = [];
      for (let y=0; y<this.sizeY; y++) {
        row.push(0);
      }
      this.fields.push(row);
    }
  }
  
}
