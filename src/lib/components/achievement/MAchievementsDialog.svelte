<MDialog bind:open={open} title={leetize("ANOTHER STELLAR SYNDICATE")}>

  {#snippet activator()}
    <MAppBarButton icon="trophy" onclick={openAchievementDialog} />
  {/snippet}

  <div class="achievements-container">
    {#each entropy as category}
      <div class="category-row">
        {#each category.achievements as item}
          <div class="achievement-icon" class:not-implemented={!achievements.implemented(item)}>
            <button class="avatar-button" onclick={() => handleAchievementClick(item, category)}>

              {#if achievements.achieved(item.id)}
                <img src="/achievements/{item.id}.png" alt="" loading="lazy" />
              {:else if achievements.unlocked(category, item)}
                <img src="/achievements/paperhead.png" alt="" class="unlocked" loading="lazy" />
              {:else}
                <img src="/achievements/locked.png" alt="" class="locked" loading="lazy" />
              {/if}

              {#if !achievements.implemented(item)}
                <div class="not-implemented-overlay">
                  <span class="not-implemented-text golden-text golden-text-shadow">WIP</span>
                </div>
              {/if}
            </button>
          </div>
        {/each}
      </div>
    {/each}
  </div>

  {#snippet footer()}
    <div class="scrolling-container">
      <h3 class="font-orbitron scrolling-text" onanimationiteration={onTextScrollComplete}>{leetize(textToScroll.toUpperCase())}</h3>
    </div>
  {/snippet}

</MDialog>

<script lang="ts">
  import MDialog from "$lib/components/MDialog.svelte";
  import MAppBarButton from "$lib/components/MAppBarButton.svelte";
  import {leetize} from "../../../util/texts";
  import {onMount, onDestroy} from "svelte";
  import { uiBus } from '$lib/util/uiBus';
  import achievements from "$lib/game/achievement/achievements";
  import type { IAchievement } from '$lib/game/achievement/IAchievement';
  import type { IAchievementCategory } from '$lib/game/achievement/IAchievementCategory';

  const textsToScroll = [
    "Build your space agency and shoot the moon",
    "Earn achievements to unlock more achievements",
    "Space Agency As A Service SAAAS",
    "You should fill all positions at your agency",
    "Achievements give big bonus... sometimes",
    "There are many achievements to unlock",
  ];

  // Add this state variable to control dialog visibility
  // let dialogOpen = $state(false);
  let { open = $bindable(false), entropy } = $props();

  let textToScroll = $state(textsToScroll[0]);
  let lastTextIndex = $state(0);

  // Mount and destroy handlers for event subscription
  onMount(() => {
    // Subscribe to showAchievements event
    uiBus.on('showAchievements', openAchievementDialog);
  });

  onDestroy(() => {
    // Unsubscribe from showAchievements event
    uiBus.off('showAchievements', openAchievementDialog);
  });
  
  // Function to handle achievement click
  function handleAchievementClick(item: IAchievement, category: IAchievementCategory) {
    // First close the dialog
    open = false;
    // Then emit the event
    uiBus.emit('showAchievement', item, category);
  }
  
  // Called when text completely scrolls out of view on the left
  function onTextScrollComplete() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * textsToScroll.length);
    } while (nextIndex === lastTextIndex);
    lastTextIndex = nextIndex;
    textToScroll = textsToScroll[nextIndex];
  }

  // Add a function to open the dialog
  function openAchievementDialog() {
    open = true;
  }

</script>

<style>

    .achievements-container {
        width: 90%;
        /*max-height: 70vh;*/
        /*overflow-y: auto;*/
        overflow-x: hidden;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        padding-left: 5%;
        padding-right: 5%;
    }

    .achievements-container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }

    .category-row {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        margin-bottom: 1rem;
        gap: 0.5rem;
    }

    .avatar-button {
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        position: relative;
    }

    .achievement-icon {
        flex: 0 0 16%; /* Reduced from 18% to account for added margins */
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }

    .achievement-icon img {
        max-width: 100%;
        height: auto;
        object-fit: contain;
    }

    .not-implemented {
        position: relative;
    }

    .not-implemented-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        border-radius: 4px;
    }

    .not-implemented-text {
        font-weight: bold;
        font-size: min(2vw, 0.8rem);
    }

    .scrolling-container {
        width: 100%;
        overflow: hidden;
        position: relative;
    }

    .scrolling-text {
        animation: scroll-left 15s linear infinite;
        white-space: nowrap;
        position: relative;
    }

    .unlocked {
        opacity: 0.85;
        filter: grayscale(20%);
    }

    .locked {
        opacity: 0.65;
        filter: grayscale(50%);
    }

    @keyframes scroll-left {
        0% {
            transform: translateX(100%); /* Start from right edge */
        }
        100% {
            transform: translateX(-100%); /* Completely exit left edge */
        }
    }

</style>