<div class="countdown {countdownSpeedClass(ttl)}"
     style="position: relative;"
     style:color="{color}"
     style:background-color="{color == colors.black ? 'gray' : ''}"
     style:width="{width}px"
     style:height="{width}px"
     style:font-size="{width/2}px"
     style:left="{left}"
>
  { formatTtl(ttl) }
</div>
<script lang="ts">

  import Group from "$lib/game/Group.js";
  import { onMount, onDestroy } from "svelte";
  import colors from "$lib/game/colors";
  import {uiBus} from "$lib/util";
  import store from "$lib/store.svelte";

  let {group, color}: {group: Group, color: string} = $props();
  let ttl = $state(0);
  let interval: number = 0;

  // default size 50px, but with big board and small blocks it shrinks down to 40 (oversize, really helps)
  let width = ($derived<number>).by(() => {
    const cellWidth = store.mergeBoardCellWidth;
    return Math.max(Math.min(50, cellWidth-1), 40);
  })
  // when oversize, flex centering doesn't work and countdown starts moving to the right. With this dynamic left
  //  it is kept in center (vertically no need, that works fine)
  let left = $derived.by(() => {
    const w = width;
    const cellWidth = store.mergeBoardCellWidth;
    return cellWidth > w ? 'auto' : (Math.floor((cellWidth-w)/2) + 'px');
  })

  onMount(() => {
    ttl = group.ttl;
    /**
     * Not very efficient as we mostly/always display whole seconds only. However, there won't be many groups.
     * We run a 0.1 timer to ensure no jumps in the countdown (with 1sec it jumps from initial 5 to 3)
     * Using a common timer source would be efficient but then all timers would jump at the same time on the screen
     */
    interval = setInterval(() => {
      // we round to one decimal to avoid ugly 0.099999997 etc. values
      ttl = Math.floor((ttl-0.1)*10) / 10;
      if (ttl <= 0) {
        ttl = 0;
        clearInterval(interval as unknown as number);
        // defer this as it will erase group and group.ttl setting would result in error
        setTimeout(() => uiBus.emit('groupExpired', group));
      }
      group.ttl = ttl;
    }, 100) as unknown as number;
  })

  onDestroy(() => {
    if (interval) {
      clearInterval(interval);
    }
  })

  function formatTtl(ttl: number): string {
    if (ttl <= 0) {
      return '0';
    }
    // showing decimals towards the end of countdown seems a good idea, but it doesn't look good
    //  with the scale animation
    // else if (ttl <= 1) {
    //   return ttl.toFixed(1).substring(1);
    // }
    return ttl.toFixed(0);
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
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace;
        /** these are now in getters and dynamic */
        /*font-size: 22px;*/
        /*width: 50px;*/
        /*height: 50px;*/
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
        0% {
            box-shadow: 0 0 25px rgba(175, 64, 100, 0.8);
        }
        50% {
            box-shadow: 0 0 25px rgba(100, 64, 225, 0.6);
        }
        100% {
            box-shadow: 0 0 25px rgba(128, 250, 128, 1);
        }
    }

    @keyframes pulse2 {
        from {
            box-shadow: 0 0 25px rgba(128, 0, 128, 1);
            scale: 1;
        }
        to {
            box-shadow: 0 0 15px rgba(175, 64, 100, 0.6);
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
