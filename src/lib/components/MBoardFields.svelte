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
                    <div
                            class="flex grow bg-stone-500 m-0.5 m-board-field-inner"
                            style="border-radius: 15%; background-color: {fields[iY][iX].color}; box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray"
                            in:blur={{duration: 200}}
                    ></div>
                {/if}
            </div>
        {/each}
    </div>
{/each}
<script lang="ts">

  import {blur} from "svelte/transition";
  import elasticTransition from "$lib/transitions/elasticTransition";
  import type {FieldType} from "$lib/components/FieldType";
  import store from "$lib/store.svelte";

  let {
    fields,
    width,
  }: {
    width: number,
    fields: FieldType[][],
  } = $props();

  $effect(() => {
    store.mergeBoardCellWidth = width;
  })

  function backgroundImageOf(atX: number, atY: number): string {
    return `grid/${String.fromCharCode(atY%6 + 65)}${atX%6+1}.png`;
  }

</script>
