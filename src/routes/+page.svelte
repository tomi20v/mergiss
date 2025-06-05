<svelte:window onresize={onResize} />
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
    setInterval(onResize, 333);
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

    :global(.golden-text) {
        /*color: #FFD030;*/
        color: gold !important;
    }
    :global(.golden-text-shadow) {
        text-shadow: 0 0 9px #ffe066, 0 0 2px #f7b801;
    }

    :global(.golden-dark-text) {
        /*color: #FFD030;*/
        color: darkgoldenrod !important;
    }

    :global(.golden-border) {
        border-color: rgba(255, 208, 48, 0.8);
        border-style: solid;
    }
    :global(.golden-dark-border) {
        border-color: orange;
        border-style: solid;
    }
    :global(.golden-shadow-border) {
        border-color: rgba(255, 208, 48, 0.3);
        border-style: solid;
    }

    :global(.golden-bg) {
        background-color: gold;
    }

    :global(.gray-title) {
        color: rgb(156 163 175);
    }

    :global(.golden-button) {
        align-self: flex-start;
        margin-top: 0.75rem;
        background: gold;
        color: black;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        padding: 0.75rem 1.75rem;
        font-weight: bold;
        box-shadow: 0 1px 12px rgba(255,224,102,0.53),0 0 4px rgba(255,250,194,0.73);
        border: none;
        letter-spacing: 0.2em;
        cursor: pointer;
        transition: all 0.2s;
    }
    :global(.golden-button:hover) {
      filter: brightness(1.1);
    }

</style>
