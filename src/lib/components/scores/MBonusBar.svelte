<MProgressBar
        color="amber"
        value={value}
        label="bonus"
/>

<script lang="ts">

  import { onMount, onDestroy } from 'svelte';
  import MProgressBar from "$lib/components/MProgressBar.svelte";
  import { uiBus } from "$lib/util/uiBus";
  import type Piece from "$lib/game/piece/Piece";
  import playStore from "$lib/playStore.svelte";

  const maxBonus = 100;
  const depletionMin = 14; // this was a convenient value, just to remember.
  const depletionInterval = 100; // Check every 100ms
  let depleteTimerId: ReturnType<typeof setInterval> | null = null;
  let suspendDepletion = false;
  let suspendTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Use $derived to reactively read the bonusMultiplier from the store
  let value = $derived(playStore.bonusPcnt);

  onMount(() => {
    // Subscribe to the 'pieceDropped' event
    uiBus.on('pieceDropped', onPieceDropped);
    uiBus.on('resetBonusBar', onReset);
    uiBus.on('achieved', onAchieved);
    uiBus.on('dev.bonus', () => addBonus(15));

    // Start the depletion timer
    depleteTimerId = setInterval(() => {
      if (!playStore.paused && !suspendDepletion) {
        // Calculate depletion amount per interval
        const depleteAmount = playStore.bonusDepletion * (depletionInterval / 1000);
        // Ensure bonus doesn't go below 0
        playStore.bonusPcnt = Math.max(0, playStore.bonusPcnt - depleteAmount);
      }
    }, depletionInterval);

    // It's crucial to unsubscribe when the component is destroyed
    // to prevent memory leaks.
    return () => {
      uiBus.off('pieceDropped', onPieceDropped);
      if (depleteTimerId) {
        clearInterval(depleteTimerId);
      }
      if (suspendTimeoutId) {
        clearTimeout(suspendTimeoutId);
      }
    };
  });

  onDestroy(() => {
    uiBus.off('pieceDropped', onPieceDropped);
    uiBus.off('rocketLaunched', onReset);
    // Additional safety to clear the interval
    if (depleteTimerId) {
      clearInterval(depleteTimerId);
    }
    if (suspendTimeoutId) {
      clearTimeout(suspendTimeoutId);
    }
  });

  function has(achievementId: string): number {
    return playStore.achievementIds.includes(achievementId) ? 1 : 0;
  }

  function onAchieved() {
    playStore.bonusMax = Math.max(
      5
    );
    playStore.bonusDepletion = Math.max(
      50 - has("astro-1") * 20,
      depletionMin);
  }

  // Define your listener function
  function onPieceDropped (event: {
    origin: string;
    piece: Piece;
    dragTime: number;
    rotationCount: number;
  }) {

    const added = Math.floor(event.piece.weight * 6.5);

    addBonus(added);

  }

  function addBonus(added: number) {

    // Update the bonusMultiplier in the store directly
    playStore.bonusPcnt = Math.min(playStore.bonusPcnt + added, maxBonus);
    
    // Suspend depletion for half a second
    suspendDepletion = true;
    
    // Clear any existing timeout to prevent multiple overlapping timeouts
    if (suspendTimeoutId) {
      clearTimeout(suspendTimeoutId);
    }
    
    // Resume depletion after 500ms
    suspendTimeoutId = setTimeout(() => {
      suspendDepletion = false;
    }, value == 100 ? 1000 : 500);
    
    // No need to update local state 'value' as it's derived
  }

  function onReset() {
    playStore.bonusPcnt = 0;
  }

</script>