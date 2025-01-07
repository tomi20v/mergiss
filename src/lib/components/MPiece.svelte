<div class="flex flex-col gap-1">
    <!--{ piece.color }-->
    {#each piece.pixelMap as eachRow}
        <div class="flex flex-row gap-1">
            {#each eachRow as eachCell}
                <!-- @todo fixed 10px must be improved -->
                <div class={'flex ' + colorOf(eachCell)} style="aspect-ratio: 1/1; display: block; width: 10px;"></div>
            {/each}
        </div>
    {/each}
</div>
<script lang="ts">

  let { piece } = $props();

  function colorOf(i: number): string {
    // @todo this doesn't change reactively :/
    // const ret = i ? ('bg-' + piece.color + '-500') : 'bg-black';
    const ret = i ? ('bg-yellow-500') : 'bg-black';
    console.log('color', piece.color, 'bg-' + piece.color + '-500', ret);
    return ret;
  }

</script>
