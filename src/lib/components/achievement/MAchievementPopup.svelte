<div class="achievement-popup">
  <MDialog bind:open={open} {title} subTitle={category?.category} onclose={handleClose}>
    <div class="container">
      <div class="icon-column">
        <span class:achievement-icon={true} class:achievement-icon-bounce={isAchieved} class:golden-border={isAchieved} class:unlocked-border={isUnlocked} class:locked-border={isLocked}>
          {#if isAchieved}
            <img src="/achievements/{achievement.id}.png" alt="" width="75%"/>
          {:else if isUnlocked}
            <img src="/achievements/paperhead.png" alt="" class="unlocked" width="75%"/>
          {:else}
            <img src="/achievements/locked.png" alt="" class="locked" width="75%"/>
          {/if}
        </span>
      </div>
      <div class="content-column">
        {#if isAchieved}
          <div class="achievement-title golden-text golden-text-shadow">{achievement.title}</div>
          <div class="achievement-description gray-title">
            {achievement.description}
          </div>
          <div class="golden-text achievement-description gray-title">
            "{achievement.hint}"
          </div>
        {:else if isUnlocked}
          <div class="achievement-title silver-text silver-text-shadow">{category?.category}</div>
          <div class="golden-text achievement-description gray-title">
            "{achievement.hint}"
          </div>
        {:else}
          <div class="achievement-title locked-text locked-text-shadow">Locked Achievement</div>
          <div class="achievement-description gray-title">
            Unlock more achievements to discover this one.
          </div>
        {/if}
      </div>
    </div>
    {#snippet footer()}
      {#if isAchieved}
        <h3 class="golden-text golden-text-shadow tracking-extreme">
          <span class="p-4 flex">{achievement.gain}</span>
        </h3>
      {:else if isUnlocked}
        <h3 class="silver-text silver-text-shadow tracking-extreme">
          <span class="p-4 flex">Complete this achievement to earn rewards</span>
        </h3>
      {:else}
        <h3 class="locked-text locked-text-shadow tracking-extreme">
          <span class="p-4 flex">Keep exploring!</span>
        </h3>
      {/if}
    {/snippet}
  </MDialog>
</div>

<script lang="ts">
  import {onMount} from "svelte";
  import MDialog from "$lib/components/MDialog.svelte";
  import type {IAchievement} from "$lib/game/achievement/IAchievement";
  import {uiBus} from "$lib/util/uiBus";
  import achievements from "$lib/game/achievement/achievements";
  import type { IAchievementCategory } from "$lib/game/achievement/IAchievementCategory";

  let open: boolean = $state(false);
  let title: string = $state("");
  let achievement: IAchievement = $state({} as IAchievement);
  let category: IAchievementCategory | null = $state(null);
  
  // Computed properties for achievement state
  let isAchieved: boolean = $derived(achievement.id ? achievements.achieved(achievement.id) : false);
  let isUnlocked: boolean = $derived(category && achievement.id ? achievements.unlocked(category, achievement) && !isAchieved : false);
  let isLocked: boolean = $derived(!isAchieved && !isUnlocked);

  onMount(() => {
    uiBus.on("achieved", onAchieved);
    uiBus.on("showAchievement", onShow);
  });

  // function onAchieved(a: IAchievement, c?: IAchievementCategory) {
  function onAchieved(achievementId: string) {
    // {iCategory, iAchievement} =
    //   achievements.lookup(achievementId);
    console.log("onAchieved", category, achievement);
    // title = "ACHIEVED!";
    // show(a, c);
  }

  function onShow(a: IAchievement, c?: IAchievementCategory) {
    // No titles for any achievement states
    title = "";
    show(a, c);
  }

  function show(a: IAchievement, c?: IAchievementCategory) {
    achievement = a;
    category = c || null;
    open = true;
  }

  function handleClose() {
    open = false;
    uiBus.emit("showAchievements");
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

    :global(.achievement-popup .dialog-subtitle) {
        justify-self: center !important;
    }
    :global(.achievement-popup .dialog-body) {
        padding-bottom: 0;
        margin-bottom: 0;
    }
    :global(.achievement-popup .dialog-content) {
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
        padding-left: 1rem;
        padding-right: 1rem;
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
    }
    
    .achievement-icon-bounce {
        animation: bounceSlow 2.6s cubic-bezier(.7,-0.3,.5,1.3) infinite;
    }
    
    .golden-border {
        border-color: #ffd700;
        box-shadow: 0 0 16px 4px rgba(255,232,67,0.38);
    }
    
    .unlocked-border {
        border-color: #c0c0c0;
        box-shadow: 0 0 12px 3px rgba(192,192,192,0.3);
    }
    
    .locked-border {
        border-color: #696969;
        box-shadow: 0 0 8px 2px rgba(105,105,105,0.2);
    }
    
    .content-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .achievement-title {
        font-size: 1.5rem;
        letter-spacing: 0.2em;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
    
    .achievement-description {
        font-size: 0.875rem;
        max-width: 30rem;
        margin-bottom: 0.5rem;
        font-family: 'Noto Sans', monospace;
    }
    
    .golden-text {
        color: #ffd700;
    }
    
    .golden-text-shadow {
        text-shadow: 0 0 3px rgba(255, 215, 0, 0.57);
    }
    
    .silver-text {
        color: #c0c0c0;
    }
    
    .silver-text-shadow {
        text-shadow: 0 0 3px rgba(192, 192, 192, 0.57);
    }
    
    .locked-text {
        color: #a0a0a0;
    }
    
    .locked-text-shadow {
        text-shadow: 0 0 3px rgba(160, 160, 160, 0.4);
    }
    
    .gray-title {
        color: #e0e0e0;
        text-shadow: 0 0 3px rgba(81,172,255,0.57);
    }
    
    .unlocked {
        opacity: 0.85;
        filter: grayscale(20%);
    }

    .locked {
        opacity: 0.65;
        filter: grayscale(50%);
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