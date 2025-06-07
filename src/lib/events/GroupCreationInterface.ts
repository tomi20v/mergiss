import type Group from "$lib/game/Group.svelte";

export default interface GroupCreatedData {
  group: Group;
  mergedGroupCount: number;
  overlaps: number;
  stitchCount: number;
  isCGroup: boolean;
}
