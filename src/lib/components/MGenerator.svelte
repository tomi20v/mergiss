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
        <CircularProgress style="width: 75%; height: 75%;" {progress}
                          ontransitionend={onTransitionEnd}
        />
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

  import {Image} from "@smui/image-list";
  import Piece from "$lib/game/piece/Piece";
  import {pieceFactory} from "$lib/game/services";
  import MPiece from "$lib/components/MPiece.svelte";
  import {onDestroy, onMount} from "svelte";
  import {uiBus} from "$lib/util/uiBus";
  import playStore from "$lib/playStore.svelte";
  import CircularProgress from '@smui/circular-progress';

  let { disabled = false } = $props();

  let piece: Piece|null = $state(null);
  let margin = $derived(8);
  let marginX = $derived(piece ? margin - (piece as Piece).sizeX()+1 : margin);
  let progress = $state(0);
  let timer: ReturnType<typeof setTimeout>|number = 0;
  const interval: number = 0.1; // Update every 100ms - provides smooth animation with built-in easing
  let intervalStep: number = $derived(interval/playStore.generatorTime);

  onMount(() => {
    uiBus.on('pieceDropped', onPieceDropped);
    timer = setInterval(update, 100);
  })

  onDestroy(() => {
    uiBus.off('pieceDropped', onPieceDropped);
    clearInterval(timer);
  })

  function generatePiece() {
    piece = null;
    setTimeout(() => piece = pieceFactory.randomPiece(), 1);
  }

  function onClick() {
    if (!disabled) {
      // @todo accelerating etc
    }
  }

  function onPieceDropped(eventData: {origin: string, piece: Piece}) {
    if (piece?.equals(eventData.piece)) {
      piece = null;
    }
  }

  function onTransitionEnd() {
    progress = 0;
    generatePiece();
  }

  function update() {
    if (!disabled && !piece && progress < 1) {
      progress = Math.min(1, progress + intervalStep);
    }
  }

</script>

<style>
  /* this turns off the easing and timing would be precise, but... looks ugly, it refreshes slowly */
  /*:global(.mdc-circular-progress__determinate-circle) {*/
  /*    transition: none !important;*/
  /*}*/
</style>
