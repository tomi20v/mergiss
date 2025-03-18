import {uiBus} from "$lib/util";

// at least for, this store is limited to "game" scope. A "game" is one "game session" which can restart etc.
//  for high scores and permanent achievements we'll probably need another store
class PlayStore {
  mergeBoardCellWidth: number = $state(0);
  score: number = $state(0);
}

// uiBus.on("play.start", (play: PlayConfigType) => {
uiBus.on("play.start", () => {
  playStore.score = 0;
})

const playStore: PlayStore = new PlayStore();

export default playStore;
