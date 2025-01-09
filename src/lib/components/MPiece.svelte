<div class="flex grow flex-col gap-0">
    {#each piece.pixelMap as eachRow}
        <div class="flex grow flex-row gap-0">
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

</script>
