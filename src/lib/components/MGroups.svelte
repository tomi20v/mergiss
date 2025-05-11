<div class="panel-border panel-padding-small flex flex-col gap-3">
  {#if playStore.groups.length === 0}
    <div class="groups-hint-container text-gray-500">
      <div class="groups-hint">Kent Patch wanted to fix the code but he Kent Patch</div>
    </div>
  {:else}
    {#each sortedGroups.slice(0, 3) as group}
      <div class="flex p-2 rounded-[10px] bg-white/15 gap-3 group-item">
        <div class="flex-1 min-h-12 bg-white/5 rounded flex items-center justify-center">
          <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
            {#if rows > 0 && cols > 0}
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
            {/if}
          </svg>
        </div>
        <div class="flex flex-col justify-center min-w-24">
          <div class="font-bold text-[0.9rem] text-orange-400">
            {leetize('E')} = {Math.floor(group.score)}
            <b>{leetize('E')}</b> {bigNumber(Math.floor(group.score)*123)}
          </div>
          <div class="flex justify-between text-[0.8rem] text-gray-400 mt-1">
            {leetize('T')}: {group.ttl.toFixed(1)}
            <b>{leetize('Ω')}</b> {group.ttl >= 100 ? Math.round(group.ttl) : group.ttl.toFixed(1)}
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>

<script lang="ts">
  // Computed property to get groups sorted by score in ascending order
  import playStore from "$lib/playStore.svelte";
  import {bigNumber, leetize} from "$lib/../util/texts";
  import Group from "$lib/game/Group.svelte";

  let sortedGroups: Group[] = $state([]);
  
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

  $effect(() => {
    // Get groups and add fields to each group
    const groups = [...(playStore.groups || [])];
    
    // Attach fields to each group from playStore.fields
    groups.forEach(group => {
      group.fields = playStore.fields ? 
        playStore.fields.filter(field => field.groupId === group.id) : [];
    });
    
    // Sort groups by score in descending order
    sortedGroups = groups.sort((a, b) => b.score - a.score);
  });
  
  // The SVG will reactively update when board dimensions change due to reactive declarations
  // in the template using playStore.boardSizeX and playStore.boardSizeY
</script>
  
<style lang="postcss">

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
  }

</style>