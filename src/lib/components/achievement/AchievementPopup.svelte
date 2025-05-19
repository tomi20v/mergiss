<div class="achievement-popup">
  <!-- @todo add dynamic title "achieved!" -->
  <MDialog bind:open={open} {title}>
    <div class="container">
      <div class="icon-column">
        <span class="achievement-icon golden-border">
          <img src="/achievements/{achievement.id}.png" alt="" width="75%"/>
        </span>
      </div>
      <div class="content-column">
        <div class="achievement-title golden-text golden-text-shadow">{achievement.title}</div>
        <div class="achievement-description gray-title">
          {achievement.description}
        </div>
<!--        <button class="golden-button" onclick={handleClose} aria-label="Close">OK</button>-->
      </div>
    </div>
  </MDialog>
</div>

<script lang="ts">

  import {onMount} from "svelte";
  import MDialog from "$lib/components/MDialog.svelte";
  import type {IAchievement} from "$lib/game/achievement/IAchievement";
  import {uiBus} from "$lib/util/uiBus";

  let open: boolean = $state(false);
  let title: string = $state("aaa");

  let achievement: IAchievement = $state({} as IAchievement);

  onMount(() => {
    uiBus.on("achieved", onAchieved);
    uiBus.on("showAchievement", onShow);
  })

  // function handleClose() {
  //   open = false;
  // }

  function onAchieved(a: IAchievement) {
    console.log("achieved", arguments);
    title = "ACHIEVED!";
    show(a);
  }

  function onShow(a: IAchievement) {
    title = "";
    show(a);
  }

  function show(a: IAchievement) {
    achievement = a;
    open = true;
  }

</script>

<style>

    @keyframes pulseGlow {
        0%, 100% {
            box-shadow: 0 0 10px #ffeb3b;
        }
        50% {
            box-shadow: 0 0 30px #ffeb3b;
        }
    }

    :global(.achievement-popup .dialog-body) {
        padding-bottom: 0;
        margin-bottom: 0;
    }
    :global(.achievement-popup .dialog-content) {
        /*padding-bottom: 0;*/
        padding: 0.5vh;
        margin-bottom: 0;
    }
    :global(.achievement-popup .dialog-header .dialog-title) {
        /*padding-bottom: 0;*/
        justify-content: center;
        text-shadow: 0 0 19px #ff9933, 0 0 10px #ff8000;
    }

    .achievement-popup {
        z-index: 1099;
    }

    .container {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        /*align-items: stretch;*/
        padding: 1.75rem 1rem;
        /*min-width: 400px;*/
        /*max-width: 520px;*/
    }
    .icon-column {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 10rem;
        min-width: 128px;
    }
    .achievement-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 8rem;
        height: 8rem;
        border-radius: 10%;
        background: black;
        border-width: 3px;
        border-style: solid;
        box-shadow: 0 0 16px 4px rgba(255,232,67,0.38);
        animation: bounceSlow 2.6s cubic-bezier(.7,-0.3,.5,1.3) infinite;
    }
    .content-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .achievement-title {
        font-size: 1.5rem;
        letter-spacing: 0.2em;
        margin-bottom: 0.25rem;
        font-weight: bold;
        line-height: 1.3;
    }
    .achievement-description {
        font-size: 0.875rem;
        text-shadow: 0 0 3px rgba(81,172,255,0.57);
        max-width: 30rem;
        margin-bottom: 0.5rem;
        font-family: 'Noto Sans', monospace;
    }
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes bounceSlow {
        0%,100% { transform: scale(1) }
        50% { transform: scale(1.1) }
    }
    @keyframes glowBorder {
        0%,100% { opacity: 0.78; box-shadow: 0 0 32px 6px #ffe06633;}
        60% { opacity:1; box-shadow:0 0 42px 8px #ffe066aa;}
    }
</style>