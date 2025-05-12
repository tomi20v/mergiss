<div class="group-item flex p-2 rounded-[10px] bg-white/15" transition:fade >
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
        <b class="hidden xl:inline">{leetize('E')}</b> <span style="transform: scale({scaleSpring.current});">{formattedScore}</span>
      </div>
      <div class="group-info-ttl flex justify-end xl:justify-between text-gray-400">
        <b class="hidden xl:inline">{leetize('Ω')}</b> <span>{group.ttl >= 100 ? Math.round(group.ttl) : group.ttl.toFixed(1)}</span>
      </div>
    </div>
</div>

<script lang="ts">

  import {fade} from "svelte/transition";
  import { Spring, Tween, } from "svelte/motion";
  import { expoOut } from "svelte/easing";
  import playStore from "$lib/playStore.svelte";
  import {bigNumber, leetize} from "$lib/../util/texts";
  import type Group from "$lib/game/Group.svelte";

  let {group}: { group: Group } = $props();
  
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

  let scaleSpring = new Spring(1, { stiffness: 0.3, damping: 0.25 });
  let score = Tween.of(() => group.score, {duration: 300, easing: expoOut});
  let formattedScore = $derived(bigNumber(Math.floor(score.current)));

  $effect(() => {
    // need this so effect is triggered when score changes
    const score = group.score;
    scaleSpring.set(1.25);
    setTimeout(() => scaleSpring.set(1), 150);
  })

</script>

<style lang="postcss">

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

</style>
