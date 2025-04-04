import {uiBus} from "$lib/util/uiBus";

// at least for, this store is limited to "game" scope. A "game" is one "game session" which can restart etc.
//  for high scores and permanent achievements we'll probably need another store
class PlayStore {
  paused: boolean = $state(false);
  mergeBoardCellWidth: number = $state(0);
  score: number = $state(0);
  generatorTime: number = $state(0.5);
}

// uiBus.on("playStart", (play: PlayConfigType) => {
uiBus.on("playStart", () => {
  playStore.score = 0;
  playStore.generatorTime = 0.5;
})

const playStore: PlayStore = new PlayStore();

export default playStore;
