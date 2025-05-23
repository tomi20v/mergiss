import {uiBus} from "$lib/util/uiBus";
import {emptyField, type FieldType} from "$lib/game/fields.svelte";
import Group from "$lib/game/Group.svelte";

// at least for, this store is limited to "game" scope. A "game" is one "game session" which can restart etc.
//  for high scores and permanent achievements we'll probably need another store
class PlayStore {
  paused: boolean = $state(false);
  // generator
  availableColors: string[] = $state([]);
  generatorTime: number = $state(0);
  // board
  boardSizeX: number = $state(0);
  boardSizeY: number = $state(0);
  mergeBoardCellWidth: number = $state(0);
  fields: FieldType[][] = $state([]);
  groups: Group[] = $state([]);
  // scores
  bonusPcnt: number = $state(1);
  // bonus: 1-5 deplending on bonus multiplier (which is 0-100) - might better off with a logarithmic calc
  bonusMultiplier: number = $derived(1 + this.bonusPcnt / 25);
  rocketMultiplier: number = 10;
  score: number = $state(0);
}

const playStore: PlayStore = new PlayStore();

// uiBus.on("playStart", (play: PlayConfigType) => {
uiBus.on("playStart", initStore)

function initStore() {
  playStore.paused = false;
  // generator
  playStore.generatorTime = 0.5;
  // board
  playStore.boardSizeX = 3;
  playStore.boardSizeY = 3;
  playStore.fields = [];
  playStore.groups = [];
  // score
  playStore.bonusPcnt = 0;
  playStore.score = 0;
  // playStore.score = 99125808;
}
initStore();

export default playStore;
