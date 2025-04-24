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
  const depletionRate = 14; // Bonus depletes by this per second
  const depletionInterval = 100; // Check every 100ms
  let depleteTimerId: ReturnType<typeof setInterval> | null = null;
  let suspendDepletion = false;
  let suspendTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Use $derived to reactively read the bonusMultiplier from the store
  let value = $derived(playStore.bonusMultiplier);
  
  onMount(() => {
    // Subscribe to the 'pieceDropped' event
    uiBus.on('pieceDropped', onPieceDropped);
  
    // Start the depletion timer
    depleteTimerId = setInterval(() => {
      if (!playStore.paused && !suspendDepletion) {
        // Calculate depletion amount per interval
        const depleteAmount = depletionRate * (depletionInterval / 1000);
        // Ensure bonus doesn't go below 0
        playStore.bonusMultiplier = Math.max(0, playStore.bonusMultiplier - depleteAmount);
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
    // Additional safety to clear the interval
    if (depleteTimerId) {
      clearInterval(depleteTimerId);
    }
    if (suspendTimeoutId) {
      clearTimeout(suspendTimeoutId);
    }
  });
  
  // Define your listener function
  const onPieceDropped = (event: {
    origin: string;
    piece: Piece;
    dragTime: number;
    rotationCount: number;
  }) => {
    // Update the bonusMultiplier in the store directly
    playStore.bonusMultiplier = Math.min(playStore.bonusMultiplier + event.piece.weight * 6.5, maxBonus);
    
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
  };

</script>