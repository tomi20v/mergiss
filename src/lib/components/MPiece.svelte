<div class="flex grow flex-col gap-px" style:max-width="{maxWidth}">
    {#each piece.pixelMap as eachRow}
        <div class="flex grow flex-row gap-px">
            {#each eachRow as eachCell}
                <div class="flex aspect-square grow {eachCell == 1 ? color: 'bg-transparent'}
                            border border-solid {eachCell ? 'border-slate-700' : 'border-transparent'}"
                ></div>
            {/each}
        </div>
    {/each}
</div>
<script lang="ts">

  let { piece } = $props();
  let color = $derived('bg-' + piece.color);
  let maxWidth = $derived.by(() => {
    const h = piece.pixelMap.length;
    const w = piece.pixelMap[0].length;
    if ((h >2) || (w <= 2)) {
      return "66%";
    }
    return null;
  });

</script>
