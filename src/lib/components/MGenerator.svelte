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
  import {uiBus} from "$lib/util";

  let { disabled = false } = $props();

  let piece: Piece|null = $state(null);

  let margin = $derived(8);
  let marginX = $derived(piece ? margin - (piece as Piece).sizeX()+1 : margin);

  onMount(() => {
    uiBus.on('pieceDropped', onPieceDropped);
  })

  onDestroy(() => {
    uiBus.off('pieceDropped', onPieceDropped);
  })

  function onClick() {
    // this will trigger in/out transitions
    piece = null;
    setTimeout(() => piece = pieceFactory.randomPiece(), 1);
  }

  // emitted by board or similar. If the current generated piece was dropped, remove it.
  function onPieceDropped(eventData: {origin: string, piece: Piece}) {
    if (piece?.equals(eventData.piece)) {
      piece = null;
    }
  }

</script>
