<div class="groups-container panel-border panel-padding-small flex flex-col">
  {#if playStore.groups.length === 0}
    <div class="groups-hint-container text-gray-500">
      <div class="groups-hint">Kent Patch wanted to fix the code but he Kent Patch.</div>
    </div>
  {:else}
    {#each sortedGroups.slice(0, 30) as group}
      <MGroupItem {group} />
    {/each}
    <!-- Shadow gradient div -->
    <div class="shadow-gradient"></div>

  {/if}
</div>

<script lang="ts">
  import playStore from "$lib/playStore.svelte";
  import Group from "$lib/game/Group.svelte";
  import MGroupItem from "$lib/components/MGroupItem.svelte";

  // Sort groups by score in descending order
  let sortedGroups: Group[] = $derived([...(playStore.groups || [])].sort((a, b) => b.score - a.score));
</script>
  
<style lang="postcss">

  .groups-container {
    gap: 1vw;
    height: 0;            /* Start with zero height */
    min-height: 0;        /* Allow container to shrink */
    max-height: 100%;     /* Don't exceed parent height */
    flex-grow: 1;         /* Grow to available space */
    overflow-y: auto;     /* Enable vertical scrolling when needed */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    position: relative; /* so that the shadow-bar can be positioned absolute */
  }

  .groups-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  .groups-hint-container {
    overflow: hidden;
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  .groups-hint {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-text 10s linear infinite;
    font-size: max(0.75rem, 1.5vw);
  }

  @keyframes scroll-text {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .shadow-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.5vw; /* Match your bottom padding or adjust as needed */
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1));
    pointer-events: none; /* So it doesn't interfere with clicks */
  }

</style>
