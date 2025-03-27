import {uiBus} from "$lib/util/uiBus";

// at least for, this store is limited to "game" scope. A "game" is one "game session" which can restart etc.
//  for high scores and permanent achievements we'll probably need another store
class PlayStore {
  mergeBoardCellWidth: number = $state(0);
  score: number = $state(0);
  generatorTime: number = $state(0.1);
}

// uiBus.on("playStart", (play: PlayConfigType) => {
uiBus.on("playStart", () => {
  playStore.score = 0;
  // NOTE: ~0.3sec easing due to CirculaProgress' easing
  playStore.generatorTime = 0.1;
})

const playStore: PlayStore = new PlayStore();

export default playStore;
