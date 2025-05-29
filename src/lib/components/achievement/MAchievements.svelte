<MAchievementPopup />
<MAchievementsDialog {entropy} />
<script lang="ts">

  import {onMount} from "svelte";
  import MAchievementsDialog from "$lib/components/achievement/MAchievementsDialog.svelte";
  import entropy from "$lib/game/entropy";
  import {uiBus} from "$lib/util/uiBus";
  import MAchievementPopup from "$lib/components/achievement/MAchievementPopup.svelte";

  type State = Record<string, unknown>;

  const state: State = $state({});

  onMount(() => {
    console.log('HU', entropy);
    // console.log('HU', achievements);
    // uiBus.on("pieceDropped", () => onPieceDropped(state));
  })

  function onDev() {
    uiBus.emit('achieved', entropy[3].achievements[0]);
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

