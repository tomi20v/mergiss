import type {EDirection} from "$lib/game/geometry/EDirection";

export default interface BoardExpandedData {
  origin: 'mergeBoard';
  boardSizeBefore: {
    sizeX: number;
    sizeY: number;
  };
  expansions: EDirection[];
}