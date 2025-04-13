import {uiBus} from "$lib/util/uiBus";

// at least for, this store is limited to "game" scope. A "game" is one "game session" which can restart etc.
//  for high scores and permanent achievements we'll probably need another store
class PlayStore {
  paused: boolean = $state(false);
  // generator
  availableColors: string[] = $state([]);
  generatorTime: number = $state(0.5);
  // board
  boardSizeX: number = $state(3);
  boardSizeY: number = $state(3);
  mergeBoardCellWidth: number = $state(0);
  // scores
  score: number = $state(0);
}

// uiBus.on("playStart", (play: PlayConfigType) => {
uiBus.on("playStart", () => {
  playStore.paused = false;
  // generator
  playStore.generatorTime = 0.5;
  // board
  playStore.boardSizeX = 3;
  playStore.boardSizeY = 3;
  // score
  playStore.score = 0;
})

const playStore: PlayStore = new PlayStore();

export default playStore;
