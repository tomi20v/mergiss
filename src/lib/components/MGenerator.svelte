<div class="flex gap-2 justify-center" style="user-select: none;" >
  {#if !disabled}
    <Image src="generator.png" class="w-2/3 cursor-pointer" onclick={onClick} draggable="false" />
    <div class="flex text-white m-1 justify-center items-center w-1/3
            border-3 border-blue-300 border-double rounded-lg border-x-0"
         style:padding="{margin}px"
         style:padding-left="{marginX}px"
         style:padding-right="{marginX}px"
    >
      {#if piece}
        <MPiece {piece} />
      {:else}
        <CircularProgress style="width: 75%; height: 75%;" {progress} ontransitionend={onProgressComplete} />
      {/if}
    </div>
  {:else}
    <Image src="generator-disabled.png" class="w-2/3" draggable="false" />
    <div class="flex text-white m-1 justify-center items-center w-1/3
            border-3 border-slate-500 border-double rounded-lg border-l-0 border-r-0"
    >
      <div class="flex text-xs border-slate-600 border-2 border-dotted">BUY</div>
    </div>
  {/if}
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {Image} from "@smui/image-list";
  import Piece from "$lib/game/piece/Piece";
  import {pieceFactory} from "$lib/game/services";
  import MPiece from "$lib/components/MPiece.svelte";
  import {onDestroy, onMount} from "svelte";
  import {uiBus} from "$lib/util/uiBus";
  import playStore from "$lib/playStore.svelte";
  import CircularProgress from '@smui/circular-progress';
  import now from "$lib/util/now";

  let { disabled = false } = $props();

  let piece: Piece|null = $state(null);
  let margin = $derived(8);
  let marginX = $derived(piece ? margin - (piece as Piece).sizeX()+1 : margin);

  let progress = $state(0);
  let timer: ReturnType<typeof setTimeout>|number = 0;
  const interval: number = 0.1; // Update every 100ms - provides smooth animation with built-in easing
  const easingTime = 0.4;
  let progressEndAt: number = 0;
  let inEasing = false;

  onMount(() => {
    uiBus.on('pieceDropped', onPieceDropped);
    if (!disabled) {
      startProgress();
    }
    timer = setInterval(update, 100);
  })

  onDestroy(() => {
    uiBus.off('pieceDropped', onPieceDropped);
    clearInterval(timer);
  })

  function generatePiece() {
    piece = null;
    setTimeout(() => piece = pieceFactory.randomPiece());
  }

  function onClick() {
    // If in dev mode and a piece exists, generate a new one
    if (!disabled && piece && dev) {
      generatePiece();
      return;
    }
    if (!disabled && !piece) {
      // when still in progress, skip 1 second, and increase current value accordingly
      if (progress < 1) {
        progressEndAt = Math.max(now(), progressEndAt - 1);
        progress = Math.min(1, progress + 1/playStore.generatorTime);
      }
      // if we're already in easing, we can just skip to generating the piece
      else if (inEasing && (progress == 1)) {
        generatePiece();
        inEasing = false;
      }
    }
  }

  function onPieceDropped(eventData: {origin: string, piece: Piece}) {
    if (piece?.equals(eventData.piece)) {
      piece = null;
      startProgress();
    }
  }

  function onProgressComplete() {
    progress = 0;
    generatePiece();
    inEasing = false;
  }

  function startProgress() {
    progressEndAt = now() + playStore.generatorTime - easingTime;
  }

  function update() {
    if (!disabled && !piece && progress < 1) {
      const remainingDuration = Math.max(0, progressEndAt - now());
      progress = Math.min(1, progress + interval/remainingDuration);
      if (progress == 1) {
        inEasing = true;
      }
    }
  }

</script>

<style>
  /* this turns off the easing and timing would be precise, but... looks ugly, it refreshes slowly */
  /*:global(.mdc-circular-progress__determinate-circle) {*/
  /*    transition: none !important;*/
  /*}*/
</style>
