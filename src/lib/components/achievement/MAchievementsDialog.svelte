<MDialog bind:open={open} title="ANOTHER STELLAR SYNDICATE">

  {#snippet activator()}
    <MAppBarButton icon="trophy" onclick={openAchievementDialog} />
  {/snippet}

  <div class="achievements-container">
    {#each entropy as category}
      <div class="category-row">
        {#each category.achievements as item}
          <div class="achievement-icon">
            <img src="/achievements/{item.id}.png" alt="" />
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

  const textsToScroll = [
    "Build your space agency and shoot the moon",
    "Earn achievements to unlock more achievements",
    "Space Agency As A Service SAAAS",
    "You should fill all positions at your agency",
    "Achievements give you big bonus... . . sometimes",
    "There are many achievements to unlock",
  ];

  // Add this state variable to control dialog visibility
  // let dialogOpen = $state(false);
  let { open = $bindable(false), entropy } = $props();

  let textToScroll = $state(textsToScroll[0]);
  let lastTextIndex = $state(0);

  // Add a function to open the dialog
  function openAchievementDialog() {
    open = true;
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

  @keyframes scroll-left {
      0% {
          transform: translateX(100%); /* Start from right edge */
      }
      100% {
          transform: translateX(-100%); /* Completely exit left edge */
      }
  }

</style>
