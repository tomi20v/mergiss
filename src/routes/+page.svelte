<svelte:window
        onresize={onResize}
/>
<TopAppBar
  variant="standard"
  dense
  >
  <Row>
    <Section>
      <IconButton class="material-icons">merge</IconButton>
      <Title>MERGISS</Title>
    </Section>
    <Section align="end" toolbar>
      <IconButton class="material-icons" onclick={toggleFullScreen}>fullscreen</IconButton>
    </Section>
  </Row>
</TopAppBar>

<div class="flex flex-col h-screen text-white bg-black" style="">
  <div class="flex mt-12 p-2 md:p-3 lg:p-4 gap-5 md:p-3 flex-row">
    <div class="flex">
      <MGenerator />
    </div>
    <div class="flex">
      <MGenerator />
    </div>
    <div class="flex">
      <MGenerator />
    </div>
    <div class="flex">
      <MGenerator />
    </div>
  </div>
  <div class="flex flex-grow align-middle justify-center items-center"
       style="xborder: 5px solid green; overflow: hidden;"
  >
    <MGissBoard boardWidth={boardWidth} boardHeight={boardHeight} />
  </div>
  <div id="bottom-container" class="p-2 border" >
    {#if (dev)}
    <ColorSamples />
    {/if}
  </div>
</div>

<script lang="ts">
  import "../app.css";

  import IconButton from '@smui/icon-button';
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import MGissBoard from "$lib/components/MGissBoard.svelte";
  import MGenerator from "$lib/components/MGenerator.svelte";
  import ColorSamples from "$lib/components/dev/ColorSamples.svelte";
  import {dev} from "$app/environment";
  import {onMount} from "svelte";

  let isFullScreen = false;
  let boardHeight = $state(400);
  let boardWidth = $state(400);
  let boardHeight = $state(400);

  function toggleFullScreen() {
    isFullScreen ? closeFullscreen() : openFullscreen();
  }

  var documentElement!: HTMLElement;

  let topContainer: HTMLElement|null = null;
  let bottomContainer: HTMLElement|null = null;

  onMount(() => {
    documentElement = document.documentElement;
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

  /* View in fullscreen */
  function openFullscreen() {
    isFullScreen = true;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    } else {
      isFullScreen = false;
    }
  }

  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    isFullScreen = false;
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
