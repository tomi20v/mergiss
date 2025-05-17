<svelte:window oncontextmenu={event => event.preventDefault()} />
<div class="h-screen">
  <div id="app-grid"
       class="grow grid">
    <div id="app-bar" class="h1 flex flex-row justify-between items-center w-full">
      <div class="w-1/6"></div>
      <div class="flex-grow flex justify-center">{leetize("MERGIS")}<div class="reverse">S</div></div>
      <div class="w-1/6 text-right tracking-normal flex items-center justify-end gap-2">
        <MAchievements/>
        <MAppBarButton icon="browse_activity"/>
        <MAppBarButton
                icon="settings"
                onclick={() => alert(`v${versionString}-pre`)}
        />
<!--        <span class="text-xs">v{versionString}</span>-->
      </div>
    </div>
    <div id="top-container"
         class="text-white"
         style:background="{devDraw ? '#f8c' : ''}">
      <MGenerators />
    </div>
    <div id="left-column"
         class="flex flex-col text-white"
         style="background-color: {devDraw ? '#fc8' : 'cf8'};">
      <div class="flex grow flex-row">
        <MBonusBar />
        <MProgressBar color="green" value={0} label={leetize("LEVEL")} markPositions={[21, 50, 90]} />
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
         class="flex flex-col"
         style="background-color: {devDraw ? '#fc8' : ''};">
      <MGameScore />
      <MGroups />
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
  import MProgressBar from "$lib/components/MProgressBar.svelte";
  import MLaunchButton from "$lib/components/MLaunchButton.svelte";
  import { leetize } from "$lib/../util/texts";
  import MBonusBar from "$lib/components/scores/MBonusBar.svelte";
  import MGroups from "$lib/components/MGroups.svelte";
  import MAchievements from "$lib/components/achievement/MAchievements.svelte";
  import { version } from '$app/environment';
  import MAppBarButton from "$lib/components/MAppBarButton.svelte";

  let { children } = $props();

  // let devDraw = true;
  let devDraw = false;

  var documentElement!: HTMLElement;
  let isFullScreen = false;
  let versionString = $derived(version.split('.').slice(0, 2).join('.'));

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
        border: clamp(3px, 0.33vw, 5px) solid #262626;
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
        gap: 0.5vw;
    }
    #left-column > div {
        gap: 1.2vw;
    }
    #right-column {
        gap: 0.5vw;
    }
    #bottom-container {
        grid-area: bottom;
    }
    /** just an example found on net */
    /*#grid:has(#left:hover) {*/
    /*    grid-template-columns: 30% auto;*/
    /*}*/
    .h1 {
        padding-top: 1vh;
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
    .h1 .material-symbols-rounded {
        font-size: clamp(16px, 2.5vw, 32px);
    }

</style>