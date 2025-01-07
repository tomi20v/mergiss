import type IProtoPiece from "$lib/game/piece/IProtoPiece";

const pieceCatalogue: IProtoPiece[] = [
  {
    color: 'purple',
    pixelMap: [
      [1,1,1,],
      [1,0,0,],
    ],
  },
  {
    color: 'red',
    pixelMap: [
      [1,1,1,1,],
    ],
  },
  {
    color: 'yellow',
    pixelMap: [
      [1,1,0,],
      [0,1,1,],
    ],
  },
  {
    color: 'green',
    pixelMap: [
      [0,1,1,],
      [1,1,0,],
    ],
  },
  {
    color: 'cyan',
    pixelMap: [
      [1,1,0,],
      [0,1,1,],
    ],
  },
  {
    color: 'blue',
    pixelMap: [
      [1,1,],
      [1,1,],
    ],
  },
  {
    color: 'gray',
    pixelMap: [
      [1,1,1,],
      [0,0,1,],
    ],
  },
];

export default pieceCatalogue;
