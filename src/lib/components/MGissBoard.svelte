<div class="flex flex-col gap-0 text-white justify-center align-middle">
  {#each board.fields as row, rowIndex}
  <div class="flex gap-0 justify-center">
    {#each row as field, fieldIndex}
      <div class="flex xbg-stone-500"
           style="color: white;
           width: 10%; max-width: 10%; aspect-ratio: 1;
           background-size: 100%;
           background-image: url({backgroundImageOf(rowIndex, fieldIndex)});
           "
      >
      </div>
    {/each}
  </div>
  {/each}
</div>
<script lang="ts">

  import BuildBoard from "$lib/game/BuildBoard";

  // let board: BuildBoard = $state(new BuildBoard(5,5));
  let board: BuildBoard = $state(new BuildBoard(10,10));
  // let board: BuildBoard = $state(new BuildBoard(15,15));

  function backgroundImageOf(i: number, j: number): string {
    return `grid/${String.fromCharCode(i%6 + 65)}${j%6+1}.png`;
  }

</script>
