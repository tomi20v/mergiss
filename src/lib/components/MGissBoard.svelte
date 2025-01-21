<div class="flex flex-grow flex-col gap-0 text-white justify-center align-middle relative">
  {#if (dev)}
    <div class="flex flex-row gap-1 absolute top-0 right-0 bg-red-600 justify-center align-middle" >
      <button onclick={resizeRemoveColumn}>dec</button>
      <div class="flex flex-col gap-1 position=relative">
        <button onclick={resizeRemoveRow}>dec</button>
        <button onclick={resizeAddRow}>add</button>
      </div>
      <button onclick={resizeAddColumn}>add</button>
    </div>
  {/if}
  {#each fields as row, rowIndex}
  <div class="flex gap-0 justify-center">
    {#each row as _, fieldIndex}
      <div class="flex ggrow xbg-stone-500"
           style="color: white;
           aspect-ratio: 1;
           background-size: 100%;
           background-image: url({backgroundImageOf(rowIndex, fieldIndex)});
           "
           style:width="{width}"
      >
      </div>
    {/each}
  </div>
  {/each}
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount} from "svelte";

  type FieldType = number;

  let { boardWidth, boardHeight } = $props();

  // @todo these shall go into some game state ("save") management
  const sX = 6, sY = 6;
  // const sX = 10, sY = 10;
  // const sX = 30, sY = 20;
  // const sX = 40, sY = 20;
  // const sX = 15, sY = 15;
  // const sX = 42, sY = 42;

  let sizeX: number = $state(sX);
  let sizeY: number = $state(sY);
  let fields: FieldType[][] = $state([]);

  let width = $derived.by(() => {
    // this makes sure we update the width when the table size changes
    // const s = serial;
    const extraWidth = sizeX >= 5 ? 2.2 : 1.8;
    const extraHeight = sizeY >= 5 ? 1 : 1.8;
    const perWidth = Math.floor(boardWidth / (sizeX+extraWidth));
    const perHeight = Math.floor(boardHeight / (sizeY+extraHeight));
    const ret = Math.min(perWidth, perHeight);
    return ret + 'px';
  })

  onMount(() => {
    fields = Array.from(
      {length: sizeX},
      () => Array.from({length: sizeY}, emptyField)
    );
  })

  function emptyField(): FieldType {
    return 0;
  }

  function backgroundImageOf(i: number, j: number): string {
    return `grid/${String.fromCharCode(i%6 + 65)}${j%6+1}.png`;
  }

  function resizeAddColumn() {
    sizeX++;
    fields.forEach(each => each.push(emptyField()));
  }
  function resizeRemoveColumn() {
    if (sizeX <= 5) {
      return;
    }
    sizeX--;
    fields.forEach(each => each.pop());
  }
  function resizeAddRow() {
    sizeY++;
    const row: number[] = [];
    for (let x=0; x<sizeX; x++) {
      row.push(emptyField());
    }
    fields.push(row);
  }
  function resizeRemoveRow() {
    if (sizeY <= 5) {
      return;
    }
    sizeY--;
    fields.pop();
  }

</script>
