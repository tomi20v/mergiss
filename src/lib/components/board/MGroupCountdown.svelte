<svelte:document onmouseup={resetVelocity} />
{#if group}
  <div id="group-countdown-{group.group}"
     class="countdown {countdownSpeedClass} {accelerating ? 'countdown-accelerating' : ''}"
     style="position: relative;"
     style:color="{color}"
     style:background-color="{color == colors.black ? 'gray' : ''}"
     style:width="{width}px"
     style:height="{width}px"
     style:font-size="{width/2}px"
     style:left="{left}"
     style:top="{top}"
  >
    { formatTtl(group.ttl) }
  </div>
{/if}
<script lang="ts">

  import Group from "$lib/game/Group.svelte";
  import { onMount, onDestroy } from "svelte";
  import {colors} from "$lib/game/colors";
  import {uiBus} from "$lib/util/uiBus";
  import playStore from "$lib/playStore.svelte.js";

  let {group, color}: {group: Group, color: string} = $props();
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let currentTimeout = 100; // Current timeout duration in ms (dynamically updated)
  const minTimeout = 0.1;
  const q = 0.985;
  let accelerating = $state(false);

  // default size 50px, but with big board and small blocks it shrinks down to 40 (oversize, really helps)
  let width = ($derived<number>).by(() => {
    const cellWidth = playStore.mergeBoardCellWidth;
    return Math.max(Math.min(50, cellWidth-1), 40);
  })
  let countdownSpeedClass = $derived.by(() => {
    const ttl = group.ttl;
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
  })
  // container will put at the center of the cell, offset it somewhat by the decimals
  let left = $derived.by(() => {
    const offset = group.centerX % 1 - 0.5;
    return offset * playStore.mergeBoardCellWidth + 'px';
  })
  let top = $derived.by(() => {
    const offset = group.centerY % 1 - 0.5;
    return offset * playStore.mergeBoardCellWidth + 'px';
  })

  onMount(() => {
    startTimer();
    uiBus.on('accelerateGroup', accelerate)
  })

  onDestroy(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    uiBus.off('groupClickStart', accelerate);
  })

  function accelerate(g: number) {
    // we should always have a group, unless sometimes we don't, so just check
    if (group && (g == group.group)) {
      if (!accelerating) {
        accelerating = true;
        // increase initial speed
        currentTimeout/= 2;
      }
      // subtract 1 second for a click, click dashing is faster for short-mid term
      group.setTtl(Math.max(0, group.ttl - 1));
      group.addAcceleratedTime(1);
    }
  }

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

  function resetVelocity() {
    accelerating = false;
    currentTimeout = 100;
  }

  function startTimer() {
    timerId = setTimeout(() => {
      if (playStore.paused) {
        startTimer();
        return;
      }
      if (accelerating) {
        currentTimeout = Math.max(currentTimeout * q, minTimeout);
      }
      const prevTtl = group.ttl;
      const newTtl = Math.floor((group.ttl-currentTimeout/1000)*10) / 10;
      if (accelerating) {
        // not exact as some time would have passed without acceleration too
        group.addAcceleratedTime(prevTtl - newTtl);
      }
      if (newTtl <= 0) {
        group.setTtl(0);
        clearTimeout(timerId as unknown as number);
        // defer so the scale animation class will be removed before cloning
        setTimeout(() => {
          uiBus.emit('groupExpired', {
            group,
            htmlId: "group-countdown-" + group.group,
            origin: origin,
            remainingTTL: 0,
          });
        })
      }
      else {
        group.setTtl(newTtl);
        startTimer();
      }
    }, currentTimeout);
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

    .countdown-accelerating {
        color: red;
        animation: wowbump 0.25s infinite alternate;
    }

    @keyframes wowbump {
        from {
            color: red;
        }
        70% {
            color: white;
        }
        to {
            color: white;
        }
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
