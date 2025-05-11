<div class="groups-container panel-border panel-padding-small flex flex-col">
  {#if playStore.groups.length === 0}
    <div class="groups-hint-container text-gray-500">
      <div class="groups-hint">Kent Patch wanted to fix the code but he Kent Patch.</div>
    </div>
  {:else}
    {#each sortedGroups.slice(0, 30) as group}
      <div class="group-item flex p-2 rounded-[10px] bg-white/15">
        <svg
          class="bbg-white/5 rounded flex items-center justify-center"
          style="width: 50%; flex-shrink: 0; margin: 0 auto;"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet">
          {#each playStore.fields as row, y}
            {#each row as cell, x}
              {#if cell && cell.group === group.group}
                <rect
                  x={offsetX + x * cellWidth}
                  y={offsetY + y * cellHeight}
                  width={cellWidth * 0.9}
                  height={cellHeight * 0.9}
                  fill={cell.color}
                  stroke="rgba(255, 255, 255, 0.3)"
                  stroke-width="1"
                />
              {/if}
            {/each}
          {/each}
        </svg>
      <div class="group-info-column flex flex-col justify-center flex-grow">
          <div class="group-info-score flex justify-end xl:justify-between text-orange-400">
            <b class="hidden xl:inline">{leetize('E')}</b> <span>{bigNumber(Math.floor(group.score))}</span>
          </div>
          <div class="group-info-ttl flex justify-end xl:justify-between text-gray-400">
            <b class="hidden xl:inline">{leetize('Ω')}</b> <span>{group.ttl >= 100 ? Math.round(group.ttl) : group.ttl.toFixed(1)}</span>
          </div>
        </div>
      </div>
    {/each}
    <!-- Shadow gradient div -->
    <div class="shadow-gradient"></div>

  {/if}
</div>

<script lang="ts">
  // Computed property to get groups sorted by score in ascending order
  import playStore from "$lib/playStore.svelte";
  import {bigNumber, leetize} from "$lib/../util/texts";
  import Group from "$lib/game/Group.svelte";

  // Derive rows and cols from playStore
  let rows = $derived(playStore.fields.length);
  let cols = $derived(playStore.fields[0]?.length || 0);
  
  // Calculate SVG height based on board aspect ratio
  let svgWidth = 100; // Fixed width
  let svgHeight = $derived((svgWidth * playStore.boardSizeY) / playStore.boardSizeX);
  
  // Cell dimensions and offsets
  const offsetX = 5;
  const offsetY = 5;
  const cellWidth = $derived((svgWidth - 10) / cols);
  const cellHeight = $derived((svgHeight - 10) / rows);

  // Sort groups by score in descending order
  let sortedGroups: Group[] = $derived([...(playStore.groups || [])].sort((a, b) => b.score - a.score));
  
  // The SVG will reactively update when board dimensions change due to reactive declarations
  // in the template using playStore.boardSizeX and playStore.boardSizeY
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

  .group-item {
      border: 3px solid #333;
      padding: 0.3vw 0.3vw;
      background-color: #111;
      box-shadow: 0 0 10px #111;
      gap: 0vw;
      max-height: 9vh;
  }

  .group-info-column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0.5vw;
      padding-right: 0;
      gap: 1vh;
      width: 50%; /* Explicit width for remaining space */
  }
  .group-info-score {
      font-size: max(1.33vw, 0.6rem);
      gap: 0.5rem;
  }
  .group-info-ttl {
      font-size: max(1.5vw, 0.75rem);
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
