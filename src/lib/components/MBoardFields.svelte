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
                    >
                        <svelte:boundary>
                        {@const group = groupCenterAt(iX, iY)}
                        {#if group}
                            <div class="countdown {countdownSpeedClass(group.ttl)}"
                                 style="color: {color}; {color == colors.black ? 'background-color: gray' : ''};" >
                                { formatTtl(group.ttl) }
                            </div>
                        {/if}
                        </svelte:boundary>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{/each}
<script lang="ts">

  import {onMount, onDestroy} from "svelte";
  import {blur} from "svelte/transition";
  import elasticTransition from "$lib/transitions/elasticTransition";
  import type {FieldType} from "$lib/game/FieldType";
  import store from "$lib/store.svelte";
  import type GroupSvelte from "$lib/game/Group.svelte.js";
  import colors from "$lib/game/colors";
  let {
    fields,
    groups,
    width,
  }: {
    width: number,
    groups: GroupSvelte[],
    fields: FieldType[][],
  } = $props();

  let counter = $state(0);
  let counterInterval: number = 0;

  $effect(() => {
    store.mergeBoardCellWidth = width;
  })

  onMount(() => {
    counterInterval = setInterval(() => {
      counter++;
    }, 100) as unknown as number;
  })

  onDestroy(() => {
    if (counterInterval) {
      clearInterval(counterInterval);
    };
  })

  function backgroundImageOf(atX: number, atY: number): string {
    return `grid/${String.fromCharCode(atY%6 + 65)}${atX%6+1}.png`;
  }

  function formatTtl(ttl: number): string {
    // return ttl.toFixed(0);
    // showing decimals at the end seems a good idea but it doesn't look well with the scale animation
    if (ttl <= 0) {
      return '0';
    }
    else if (ttl <= 2) {
      return ttl.toFixed(1);
    }
    return ttl.toFixed(0);
  }

  function groupCenterAt(atX: number, atY: number): GroupSvelte | undefined {
    return groups.find(each => (each.centerX == atX) && (each.centerY == atY));
  }

  function countdownSpeedClass(ttl: number) {
    if (ttl == 0) {
      return '';
    }
    else if (ttl < 2) {
      return 'countdown-fastest';
    }
    else if (ttl < 6) {
      return 'countdown-faster';
    }
    else if (ttl <= 10) {
      return 'countdown-fast';
    }
  }

</script>

<style>
    .countdown {
        background: black;
        color: white;
        font-size: 22px;
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        /*box-shadow: 0 0 15px rgba(128, 0, 128, 0.8); !* Purple glow *!*/
        /*box-shadow: 125 255 335 #f8c; !* Purple glow *!*/
        /*text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.9); !* Shadow behind text *!*/
        animation: pulse 1s infinite alternate;
        z-index: 999;
        user-select: none;
        text-align: center;
    }
    .countdown-fast {
        animation: pulse2 0.5s infinite alternate !important;
        transform-origin: center;
    }
    .countdown-faster {
        animation: pulse2 0.25s infinite alternate !important;
        transform-origin: center;
    }
    .countdown-fastest {
        animation: pulse2 0.175s infinite alternate !important;
    }

    /* Glowing Pulse Effect */
    @keyframes pulse {
        from {
            box-shadow: 0 0 5px rgba(128, 0, 128, 0.6);
        }
        to {
            box-shadow: 0 0 20px rgba(128, 0, 128, 1);
        }
    }

    @keyframes pulse2 {
        from {
            box-shadow: 0 0 20px rgba(128, 0, 128, 1);
            scale: 1;
        }
        to {
            box-shadow: 0 0 5px rgba(128, 0, 128, 0.6);
            scale: 0.4;
        }
    }

    /* Shrinking Countdown Effect */
    @keyframes shrink {
        0% {
            transform: translateX(-50%) scale(1);
        }
        100% {
            transform: translateX(-50%) scale(0);
        }
    }
</style>
