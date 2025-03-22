{#each fields as row, iY}
    <div class="flex gap-0 justify-center m-board-row">
        {#each row as _, iX}
            <div class="flex m-board-field"
                 style="color: white;
                        aspect-ratio: 1;
                        background-size: 100%;
                        background-image: url({backgroundImageOf(iX, iY)});
                        "
                 style:width="{cellWidth}px"
                 transition:elasticTransition|global
                 onfocus={() => null}
                 role="none"
                 onmousedown={() => onMouseDown(iX, iY)}
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
                {:else if (groupCenterAt(iX, iY))}
                  <div class="flex grow m-0.5 items-center justify-center">
                      <!-- @todo place in the center -->
                    <MGroupCountdown group={groupCenterAt(iX, iY) as Group} color={''} />
                  </div>
                {/if}
            </div>
        {/each}
    </div>
{/each}
<script lang="ts">

  import {blur} from "svelte/transition";
  import elasticTransition from "$lib/transitions/elasticTransition";
  import type {FieldType} from "$lib/game/fields";
  import MGroupCountdown from "$lib/components/MGroupCountdown.svelte";
  import Group from "$lib/game/Group.js";
  import {uiBus} from "$lib/util/uiBus";

  let {
    fields,
    groups,
    cellWidth,
  }: {
    cellWidth: number,
    groups: Group[],
    fields: FieldType[][],
  } = $props();

  function backgroundImageOf(atX: number, atY: number): string {
    return `grid/${String.fromCharCode(atY%6 + 65)}${atX%6+1}.png`;
  }

  function groupCenterAt(atX: number, atY: number): Group | undefined {
    // I have to take the floor() to match with group centers like 1.5, 4.8 etc. These could be offset later
    // return groups.find(each => (Math.floor(each.centerX) == atX) && (Math.floor(each.centerY) == atY));
    // return groups.find(each => (Math.ceil(each.centerX) == atX) && (Math.ceil(each.centerY) == atY));
    return groups.find(each => (Math.round(each.centerX) == atX) && (Math.round(each.centerY) == atY));
  }

  function onMouseDown(atX: number, atY: number) {
    const field = fields[atY][atX];
    if (field.group) {
      uiBus.emit('accelerateGroup', fields[atY][atX].group);
    }
  }

</script>
