<MDialog bind:open={open} title={leetize("ANOTHER STELLAR SYNDICATE")}>

  {#snippet activator()}
    <MAppBarButton icon="trophy" onclick={openAchievementDialog} />
  {/snippet}

  <div class="achievements-container">
    {#each entropy as category}
      <div class="category-row">
        {#each category.achievements as item}
          <div class="achievement-icon">
            {#if achieved(item.id)}
              <button class="avatar-button" onclick={() => uiBus.emit('showAchievement', item)} >
                <img src="/achievements/{item.id}.png" alt="" loading="lazy" />
              </button>
            {:else if unlocked(category, item)}
              <img src="/achievements/paperhead.png" alt="" class="unlocked" loading="lazy" />
            {:else}
              <img src="/achievements/locked.png" alt="" class="locked" loading="lazy" />
            {/if}
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
  import playStore from "$lib/playStore.svelte";
  import type {IAchievement} from "$lib/game/achievement/IAchievement";
  import type {IAchievementCategory} from "$lib/game/achievement/IAchievementCategory";
  import { uiBus } from '$lib/util/uiBus';

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

  /**
   * Check if an achievement is earned by checking if its ID exists in playStore.achievementIds
   */
  function achieved(id: string): boolean {
    return playStore.achievementIds.includes(id);
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

  /**
   * Determines if an achievement is unlocked based on specific rules:
   * - First 2 achievements are always unlocked
   * - Earning the 1st or 2nd unlocks the 3rd
   * - Earning both 1st and 2nd unlocks 3rd and 4th
   * - Earning the 3rd unlocks the 4th
   * - Earning the 4th unlocks the 5th
   * 
   * Patterns described:
   * UULLL - First 2 unlocked, rest locked
   * EUULL - Earning 1st unlocks 3rd
   * EEUUL - Earning 1st and 2nd unlocks 3rd and 4th
   * UEULL - Earning 2nd unlocks 3rd
   * EUEUL - Earning 1st and 3rd
   * EEEUL - Earning 1st, 2nd, and 3rd unlocks 4th
   * ...and so on
   */
  function unlocked(category: IAchievementCategory, item: IAchievement) {
    const achievements = category.achievements;

    // Get the index of this achievement in its category
    const achievementIndex = achievements.findIndex(
      (achievement: IAchievement) => achievement.id === item.id
    );

    // First 2 are always unlocked
    if (achievementIndex < 2) {
      return true;
    }

    // Check if specific achievements are earned
    const isFirstEarned = playStore.achievementIds.includes(achievements[0]?.id);
    const isSecondEarned = playStore.achievementIds.includes(achievements[1]?.id);
    const isThirdEarned = playStore.achievementIds.includes(achievements[2]?.id);
    const isFourthEarned = playStore.achievementIds.includes(achievements[3]?.id);

    // Apply unlocking rules
    if (achievementIndex === 2) {
      // 3rd is unlocked if either 1st or 2nd is earned
      return isFirstEarned || isSecondEarned;
    }

    if (achievementIndex === 3) {
      // 4th is unlocked if (both 1st and 2nd are earned) OR (3rd is earned)
      return (isFirstEarned && isSecondEarned) || isThirdEarned;
    }

    if (achievementIndex === 4) {
      // 5th is unlocked if 4th is earned
      return isFourthEarned;
    }

    // Default to locked for any other cases
    return false;
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