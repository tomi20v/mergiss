<div class="flex flex-col gap-0">
    <!--{ piece.color }-->
    {#each piece.pixelMap as eachRow}
        <div class="flex flex-row gap-0">
            {#each eachRow as eachCell}
                <!-- @todo fixed 10px must be improved -->
                <div class="flex {eachCell == 1 ? color: 'bg-transparent'} border border-solid {eachCell ? 'border-slate-700' : 'border-transparent'}"
                     style="aspect-ratio: 1/1; display: block; width: 12px;"
                ></div>
            {/each}
        </div>
    {/each}
</div>
<script lang="ts">

  let { piece } = $props();
  let color = $derived('bg-' + piece.color);

</script>
