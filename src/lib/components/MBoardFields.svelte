{#each fields as row, iY}
    <div class="flex gap-0 justify-center m-board-row">
        {#each row as _, iX}
            <div class="flex m-board-field"
                 style="color: white;
                        aspect-ratio: 1;
                        background-size: 100%;
                        background-image: url({backgroundImageOf(iX, iY)});
                        "
                 style:width="{width}px"
                 transition:elasticTransition|global
                 onfocus={() => null}
                 role="none"
            >
                {#if (fields[iY][iX].color)}
                    {@const color = fields[iY][iX].color}
                    <div
                        class="flex grow bg-stone-500 m-0.5 m-board-field-inner items-center justify-center"
                        style="border-radius: 15%; background-color: {color}; box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray;"
                        in:blur={{duration: 200}}
                        out:blur={{duration: 200}}
                    >
                        {#if (groupCenterAt(iX, iY))}
                        <MGroupCountdown group={groupCenterAt(iX, iY) as Group} color={color} />
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{/each}
<script lang="ts">

  import {blur} from "svelte/transition";
  import elasticTransition from "$lib/transitions/elasticTransition";
  import type {FieldType} from "$lib/game/FieldType";
  import store from "$lib/store.svelte";
  import MGroupCountdown from "$lib/components/MGroupCountdown.svelte";
  import Group from "$lib/game/Group.js";

  let {
    fields,
    groups,
    width,
  }: {
    width: number,
    groups: Group[],
    fields: FieldType[][],
  } = $props();

  $effect(() => {
    store.mergeBoardCellWidth = width;
  })

  function backgroundImageOf(atX: number, atY: number): string {
    return `grid/${String.fromCharCode(atY%6 + 65)}${atX%6+1}.png`;
  }

  function groupCenterAt(atX: number, atY: number): Group | undefined {
    return groups.find(each => (each.centerX == atX) && (each.centerY == atY));
  }

</script>
