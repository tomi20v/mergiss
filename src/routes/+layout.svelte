<!--
<TopAppBar
        variant="standard"
        dense
>
  <Row>
    <Section>
      <IconButton class="material-icons">merge</IconButton>
      <Title>MERGISS</Title>
    </Section>
    <Section align="end" >
      <MGameScore />
    </Section>
    <Section align="end" toolbar>
      <IconButton class="material-icons" onclick={onToggleFullScreen}>fullscreen</IconButton>
    </Section>
  </Row>
</TopAppBar>
-->
<div class="h-screen">
  <div id="app-grid"
       class="grow grid">
    <div id="app-bar" class="h1">
      MΞЯGIS<div class="reverse">S</div>
    </div>
    <div id="top-container"
         class="text-white"
         style:background="{devDraw ? '#f8c' : ''}">
      <MGenerators />
    </div>
    <div id="left-column"
         class="flex flex-col gap-2 text-white"
         style="background-color: {devDraw ? '#fc8' : 'cf8'};">
      <div class="flex grow" >
<!--        AAA-->
      </div>
      <div class="flex justify-center">
        <MLaunchButton />
      </div>
    </div>
    <div id="main"
         class="panel-border flex align-middle justify-center"
         style:background="{devDraw ? '#8cf' : ''}">
      {@render children()}
    </div>
    <div id="right-column"
         class=""
         style="background-color: {devDraw ? '#fc8' : ''};">
      <MGameScore />
    </div>
    <div id="bottom-container"
         class="panel-border"
         style:background="{devDraw ? '#c8f' : ''}">
      <MColorSamples />
    </div>
  </div>
</div>

<Analytics measurementId="G-EQDFD52XPM" consentCategories={["analytics_storage"]} />

<script lang="ts">

  import {onMount} from "svelte";
  import MGameScore from "$lib/components/MGameScore.svelte";
  import MColorSamples from "$lib/components/dev/MColorSamples.svelte";
  import Analytics from "$lib/components/Analytics.svelte";
  import {uiBus} from "$lib/util/uiBus";
  import MGenerators from "$lib/components/piece/MGenerators.svelte";
  import MLaunchButton from "$lib/components/MLaunchButton.svelte";

  let { children } = $props();

  // let devDraw = true;
  let devDraw = false;

  var documentElement!: HTMLElement;
  let isFullScreen = false;

  onMount(() => {
    documentElement = document.documentElement;
    uiBus.on("toggleFullScreen", onToggleFullScreen);
  })

  function onToggleFullScreen() {
    if (isFullScreen) {
      closeFullscreen();
      uiBus.emit("onFullScreen", false);
    } else {
      openFullscreen();
      uiBus.emit("onFullScreen", true);
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
    :global(html) {
        font-family: 'Orbitron', sans-serif;
        /*background-color: #140A4A;*/
        /*min-width: 320px;*/
        min-width: 420px;
        height: 100%;
        overflow: hidden;
    }
    :global(body) {
        background-color: #100808;
        min-width: 420px;
        height: 100%;
        overflow: hidden;
        user-select: none;
    }
    :global(.panel-border) {
        border: 4px solid #262626;
        border-radius: 1.5em;
        background: #000;
    }
    :global(.panel-padding-small) {
        padding: 1vw;
    }
    :global(.panel-padding) {
        padding: 1.5vw;
    }
    #app-grid {
        /** with this we don't have to use padding which'd mess with height:100% */
        position: absolute;
        /*top: 16px; left: 16px; right: 16px; bottom: 16px;*/
        /*top: 1.5vw; left: 1.5vw; right: 1.5vw; bottom: 1.5vw;*/
        top: 0; left: 1.5vw; right: 1.5vw; bottom: 1.5vw;
        display: grid;
        grid-template-columns:
                /*minmax(80px, 10%)*/
                clamp(80px, 10%, 250px)
                1fr
                /*clamp(120px, 15%, 300px);*/
                minmax(120px, 16.5%);
        grid-template-rows:
                auto
                auto
                1fr
                auto;
        grid-template-areas:
          "app-bar app-bar app-bar"
          "top top top"
          "left main right"
          "bottom bottom bottom";
        gap: 1.5vw;
    }
    #app-bar {
        /*background-color: #262626;*/
        grid-area: app-bar;
    }
    #top-container {
        grid-area: top;
    }
    #left-column {
        grid-area: left;
    }
    #bottom-container {
        grid-area: bottom;
    }
    /** just an example found on net */
    /*#grid:has(#left:hover) {*/
    /*    grid-template-columns: 30% auto;*/
    /*}*/
    .h1 {
        padding-top: 2vh;
        font-size: 3vw;
        font-weight: bold;
        line-height: 1.6vw;
        letter-spacing: 1vw;
        margin-bottom: 0.5vh;
        text-shadow: 0 0 20px #ff9900;
        color: orange;
        justify-self: center;
    }
    .h1 .reverse {
        transform: scale(-1,1);
        display: inline-block;
        letter-spacing: 0;
    }
</style>
