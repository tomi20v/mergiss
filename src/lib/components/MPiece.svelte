<div class="flex flex-grow flex-col gap-0.5" style:max-width="{maxWidth}">
    {#each piece.pixelMap as eachRow}
        <div class="flex grow flex-row gap-0.5">
            <!-- we need these shims so things don't "jump around" when piece width changes between 2 and 4 - otherwise
                the gapping make these cases uneven and things start jumping around
                HOWEVER it still jumps between empty and having a piece which might happen when dragging later?
                -->
            {#if (w<1)}
                <div class="flex w-0"></div>
            {/if}
            {#if (w<2)}
                <div class="flex w-0"></div>
            {/if}
            {#if (w<3)}
                <div class="flex w-0"></div>
            {/if}
            {#if (w<4)}
                <div class="flex w-0"></div>
            {/if}
            {#each eachRow as eachCell}
            <div class="flex aspect-square grow"
                 style="border-radius: 15%; {eachCell ? cellStyle : ''}">
            </div>
            {/each}
        </div>
    {/each}
</div>
<script lang="ts">

  let { piece } = $props();
  let w = $derived(piece.pixelMap[0].length);
  let maxWidth = $derived.by(() => {
    const h = piece.pixelMap.length;
    const w = piece.pixelMap[0].length;
    if ((h >2) || (w <= 2)) {
      return "66%";
    }
    return null;
  });
  // some old formulas
  // let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 2px, 1px 1px 1px dimgray');
  // let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 2px ' + piece.shadowColor + ', 1px 1px 1px dimgray');
  let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray');

</script>
