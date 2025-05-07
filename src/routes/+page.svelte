<svelte:window
        onresize={onResize}
        oncontextmenu={event => event.preventDefault()}
/>
<div id="main-inner" class="flex grow">
  <MBuildBoard boardWidth={boardWidth} boardHeight={boardHeight}/>
</div>
<script lang="ts">

  import "../app.css";
  import MBuildBoard from "$lib/components/board/MBuildBoard.svelte";
  import {onDestroy, onMount} from "svelte";
  import {uiBus} from "$lib/util/uiBus";

  let boardHeight = $state(150);
  let boardWidth = $state(200);

  onMount(() => {
    onResize();
    setTimeout(onResize, 500);
    uiBus.on("boardResized", onResize);
  })

  onDestroy(() => {
    uiBus.off("boardResized", onResize);
  })

  function onResize() {
    // we have to re-get these to keep dynamic
    const el = document.getElementById("main-inner");
    if (!el) return;
    boardHeight = el.clientHeight;
    boardWidth = el.clientWidth;
  }

</script>

<style lang="postcss">
    /* Accessing the class with "*" in front limits
      the scope to anything under this component's
      elements. */
    * :global(.myClass) {
        font-style: italic;
    }
</style>
