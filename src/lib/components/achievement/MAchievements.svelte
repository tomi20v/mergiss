<MAchievementPopup />
<MAchievementsDialog {entropy} />
<script lang="ts">
// <!--<button onclick={onDev}>DEV</button>-->

  import {onMount} from "svelte";
  import MAchievementsDialog from "$lib/components/achievement/MAchievementsDialog.svelte";
  import entropy from "$lib/game/entropy";
  import {uiBus} from "$lib/util/uiBus";
  import MAchievementPopup from "$lib/components/achievement/MAchievementPopup.svelte";
  import playStore from "$lib/playStore.svelte";
  import achievements from '$lib/game/achievement/achievements';

  type State = Record<string, unknown>;

  const state: State = $state({});

  onMount(() => {
    // console.log('HU', entropy, JSON.stringify(entropy));
    // // uiBus.on("pieceDropped", () => onPieceDropped(state));
    // (entropy as any)[3].achievements[0].eventName = "rocketLaunched";
    // (entropy as any)[3].achievements[0].callback = function(state: State, eventData: object) {
    //   if (!achievements.achieved("astro-1")) {
    //     uiBus.emit("achieved", { id: "astro-1"});
    //   }
    // }
  })

  function onDev() {
    // playStore.achievementIds = ['astro-1', 'astro-2', 'astro-3', 'spin-1', 'spin-2', 'side-1', 'side-3'];
    // uiBus.emit('achieved', (entropy[3] as any).achievements[0]);
  }

  // function onPieceDropped(state: Record<string, unknown>) {
  //   state.piecesDropped = (Number(state.piecesDropped) || 0) + 1;
  //   console.log("pieces", state.piecesDropped);
  //   // Check if the user has placed 10 pieces
  //   if (playStore.piecesDropped === 10) {
  //     uiBus.emit('achieved', { id: 'astro-1' });
  //     console.log("achieved!");
  //   }
  // }

</script>