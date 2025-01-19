<div class="flex flex-grow flex-col gap-0 text-white justify-center align-middle">
  {#each board.fields as row, rowIndex}
  <div class="flex gap-0 justify-center">
    {#each row as field, fieldIndex}
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

  import BuildBoard from "$lib/game/BuildBoard";

  let { boardWidth, boardHeight } = $props();

  let board: BuildBoard = $state(new BuildBoard(5,5));
  // let board: BuildBoard = $state(new BuildBoard(10,10));
  // let board: BuildBoard = $state(new BuildBoard(30,20));
  // let board: BuildBoard = $state(new BuildBoard(40,20));
  // let board: BuildBoard = $state(new BuildBoard(15,15));
  // let board: BuildBoard = $state(new BuildBoard(42,42));

  function backgroundImageOf(i: number, j: number): string {
    return `grid/${String.fromCharCode(i%6 + 65)}${j%6+1}.png`;
  }

  let width = $derived.by(() => {
    const perWidth = Math.floor(boardWidth / (board.sizeX+1));
    const perHeight = Math.floor(boardHeight / (board.sizeY+1));
    const ret = Math.min(perWidth, perHeight);
    return ret + 'px';
  })


</script>
