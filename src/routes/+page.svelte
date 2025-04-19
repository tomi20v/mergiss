<svelte:window
        onresize={onResize}
        oncontextmenu={event => event.preventDefault()}
/>
<!--
<div class="flex flex-col h-screen text-white" >
  <div id="top-container" class="flex mt-12 p-2 md:p-3 lg:p-4 gap-5 flex-row" >
    <div class="flex">
      <MGenerator />
    </div>
    <div class="flex">
      <MGenerator />
    </div>
    <div class="flex">
      <MGenerator disabled />
    </div>
    <div class="flex">
      <MGenerator disabled />
    </div>
  </div>
  <div class="flex flex-grow flex-row align-middle justify-center items-center py-2 px-4 m-2 gap-5">
    <div id="left-tab" class="flex flex-col flex-1 gap-5 h-full max-w-60 min-w-10%">
      <div class="flex flex-row gap-3 grow">
        <div class="flex grow panel-border">aaa</div>
        <div class="flex grow panel-border">bbb</div>
      </div>
      <div class="panel-border" style="height: 20%;">asd</div>
    </div>
    <div style="height: 100%" class="flex flex-col grow panel-border">
      -->
    <MBuildBoard boardWidth={boardWidth} boardHeight={boardHeight}/>
<!--
    </div>
    <div id="left-tab" class="flex flex-col flex-1 gap-5 h-full "
         style="min-width: 10%; max-width: 15em;">
      <div class="panel-border" style="height: 20%;">asd</div>
      <div class="flex flex-row gap-3 grow panel-border">bbb</div>
      <div class="panel-border" style="height: 20%;">asd</div>
    </div>
  </div>
  <div id="bottom-container" class="p-2 border" >
    {#if (dev)}
    <ColorSamples />
    {/if}
  </div>
</div>
-->
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
                auto
                8fr
                2fr
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
