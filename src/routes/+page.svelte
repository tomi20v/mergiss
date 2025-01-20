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
      <IconButton class="material-icons" onclick={onToggleFullScreen}>fullscreen</IconButton>
    </Section>
  </Row>
</TopAppBar>

<div class="flex flex-col h-screen text-white bg-black" >
  <div id="top-container" class="flex mt-12 p-2 md:p-3 lg:p-4 gap-5 flex-row" >
    <div class="flex">
      <MGenerator />
    </div>
    <div class="flex">
      <MGenerator disabled />
    </div>
    <div class="flex">
      <MGenerator disabled />
    </div>
    <div class="flex">
      <MGenerator disabled />
    </div>
  </div>
  <div class="flex flex-grow align-middle justify-center items-center pl-10 pr-10" >
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

  function onToggleFullScreen() {
    if (isFullScreen) {
      closeFullscreen()
    } else {
      openFullscreen();
    }
  }

  /* View in fullscreen */
  function openFullscreen() {
    if (!documentElement) return;
    isFullScreen = true;
    if (documentElement.requestFullscreen) {
      documentElement.requestFullscreen();
    // @ts-expect-error legacy
    } else if (documentElement.webkitRequestFullscreen) { /* Safari */
    // @ts-expect-error legacy
      documentElement.webkitRequestFullscreen();
    // @ts-expect-error legacy
    } else if (documentElement.msRequestFullscreen) { /* IE11 */
    // @ts-expect-error legacy
      documentElement.msRequestFullscreen();
    } else {
      isFullScreen = false;
    }
  }

  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    // @ts-expect-error legacy
    } else if (document.webkitExitFullscreen) { /* Safari */
    // @ts-expect-error legacy
      document.webkitExitFullscreen();
    // @ts-expect-error legacy
    } else if (document.msExitFullscreen) { /* IE11 */
    // @ts-expect-error legacy
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
