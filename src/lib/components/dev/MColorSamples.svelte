  <div class="flex flex-row grow justify-center gap-4 p-2 px-10 text-white">
    {#each Object.keys(colors) as key}
      {@const color = colors[key]}
      <div class="sample flex-1"
           style="background-color: {color};"

      ></div>
    {/each}
  </div>
<script>
  import {colors} from "$lib/game/colors";
</script>
<style lang="postcss">
  .sample {
    border-radius: 5px;
    min-height: 10px;
    /** same as with pieces */
    box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray;
    max-height: 1.5vh;
  }
</style>