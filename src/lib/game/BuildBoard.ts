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

    for (let y=0; y<this.sizeY; y++) {
      const row: number[] = [];
      for (let x=0; x<this.sizeX; x++) {
        row.push(this.emptyField());
      }
      this.fields.push(row);
    }
  }

  addColumn() {
    this.sizeX++;
    this.fields.forEach(each => each.push(this.emptyField()));
  }

  addRow() {
    this.sizeY++;
    const row: number[] = [];
    for (let x=0; x<this.sizeX; x++) {
      row.push(this.emptyField());
    }
    this.fields.push(row);
  }

  emptyField() {
    return 0;
  }

  removeColumn() {
    if (this.sizeX <= 5) {
      return;
    }
    this.sizeX--;
    this.fields.forEach(each => each.pop());
  }

  removeRow() {
    if (this.sizeY <= 5) {
      return;
    }
    this.sizeY--;
    this.fields.pop();
  }

}
