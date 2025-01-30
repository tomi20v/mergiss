class SvelteStore {
  mergeBoardCellWidth: number = $state(0);
}

const store: SvelteStore = new SvelteStore();

export default store;
