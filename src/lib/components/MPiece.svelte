<div class="flex grow flex-col gap-px" style:max-width="{maxWidth}">
    {#each piece.pixelMap as eachRow}
        <div class="flex grow flex-row gap-px">
            {#each eachRow as eachCell}
                <div class="flex aspect-square grow"
                     style="border-radius: 15%; {eachCell ? cellStyle : ''}"
                ></div>
            {/each}
        </div>
    {/each}
</div>
<script lang="ts">

  let { piece } = $props();
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
