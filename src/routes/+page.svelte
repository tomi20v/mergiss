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
  import MGenerator from "$lib/components/piece/MGenerator.svelte";
  import ColorSamples from "$lib/components/dev/ColorSamples.svelte";
  import {dev} from "$app/environment";
  import {onMount} from "svelte";

  let boardHeight = $state(400);
  let boardWidth = $state(400);

  let topContainer: HTMLElement|null = null;
  let bottomContainer: HTMLElement|null = null;

  onMount(() => {
    topContainer = document.querySelector("#top-container");
    bottomContainer = document.querySelector("#bottom-container");
    onResize();
  })

  function onResize() {
    if (!topContainer || !bottomContainer) {
      return;
    }
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const topContainerHeight = topContainer.offsetTop + topContainer.offsetHeight;
    const bottomContainerHeight = bottomContainer.offsetHeight;
    // boardContainerHeight
    boardHeight = windowHeight - topContainerHeight - bottomContainerHeight;
    boardWidth = windowWidth;
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
