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

<div id="app-grid"
     class="h-screen grid gap-4 p-4"
     style="">
  <div id="top-container"
       class="text-white"
       style:background="{devDraw ? '#f8c' : ''}">
<!--    <img src="generator.png" width="200px"/>-->
    AAA
  </div>
  <div id="left-column"
       class=""
       style:background="{devDraw ? '#fc8' : ''}">
    <!--    <img src="generator.png" width="200px"/>-->
    AAA
  </div>
  <div id="main"
       class="panel-border"
       style:background="{devDraw ? '#8cf' : ''}">
    {@render children()}
  </div>
  <div id="right-column"
       class=""
       style:background="{devDraw ? '#fc8' : ''}">
    <!--    <img src="generator.png" width="200px"/>-->
    BBB
  </div>
  <div id="bottom-container"
       class="panel-border"
       style:background="{devDraw ? '#c8f' : ''}">
    bbb
  </div>
</div>

<!-- this could be put in +layout.svelte -->
<Analytics measurementId="G-EQDFD52XPM" consentCategories={["analytics_storage"]} />

<script lang="ts">
  import {onMount} from "svelte";
  import IconButton from '@smui/icon-button';
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import MGameScore from "$lib/components/MGameScore.svelte";
  import Analytics from "$lib/components/Analytics.svelte";
  import {uiBus} from "$lib/util/uiBus";

  let { children } = $props();

  let devDraw = $state(true);

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
    :global(body), :global(html) {
        /*background-color: #8cf !important;*/
        background-color: #140A0A;
        min-width: 320px;
        overflow: hidden;
    }
    .color1 {
        color: #19181A;
    }
    .color2 {
        color: #101010;
    }
    :global(.panel-border) {
        border: 4px solid #262626;
        border-radius: 1.5em;
        background: #000;
    }
    #app-grid {
        /*width: 100%;*/
        /*height: 100%;*/
        background: #101010;
        grid-template-columns:
                auto
                2fr
                auto
    ;
        /*grid-template-columns: 80px 2fr 80px;*/
        grid-template-rows:
                2fr
                8fr
                1fr
    ;
        grid-template-areas:
          "top top top"
          "left main right"
          "bottom bottom bottom";
    }
    #top-container {
        grid-area: top;
    }
    #left-column {
        width: 20px;
        transition: width ease 0.5s;
    }
    #left-column:hover {
        width: 300px;
        /*transition: width ease 1.5s;*/
    }
    #bottom-container {
        grid-area: bottom;
    }
    /** just an example found on net */
    /*#grid:has(#left:hover) {*/
    /*    grid-template-columns: 30% auto;*/
    /*}*/
</style>
