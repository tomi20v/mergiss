{#each fields as row, iY}
  <div class="flex gap-0 justify-center m-board-row">
    {#each row as _, iX}
      <div id="board-field-{iX}-{iY}"
           class="flex m-board-field"
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

        {#each (stitchesAt(iX, iY)) as stitch}
          <img src="stitch.png" id="stitch-{stitch.cnt}" alt=""
               style="display: block; position: relative; margin-right: -{imgX}px; z-index: 99"
               style:width="{imgX}px"
               style:height="{imgY}px"
               style:left="{stitchLeft(stitch)}px"
               style:top="{stitchTop(stitch)}px"
               in:blur={{duration: 100}}
          />
        {/each}

        {#if (fields[iY][iX].color)}
          {@const color = fields[iY][iX].color}
          <div
              class="flex grow m-0.5 m-board-field-inner items-center justify-center"
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

  import {onMount, onDestroy} from "svelte";
  import {blur} from "svelte/transition";
  import elasticTransition from "$lib/transitions/elasticTransition";
  import type {FieldType} from "$lib/game/fields";
  import MGroupCountdown from "$lib/components/MGroupCountdown.svelte";
  import Group from "$lib/game/Group.js";
  import {uiBus} from "$lib/util/uiBus";
  import type {PositionPair} from "$lib/game/geometry/positionPair";
  import {numericId} from "$lib/util/numericId";

  let {
    fields,
    groups,
    cellWidth,
  }: {
    cellWidth: number,
    groups: Group[],
    fields: FieldType[][],
  } = $props();

  // image size: 115*96
  const imgX = $derived(cellWidth/136 * 58);
  const imgY = $derived(cellWidth/136 * 48);
  const stitches: PositionPair[] = $state([]);

  onMount(() => {
    uiBus.on('stitch', onStitch);
  })

  onDestroy(() => {
    uiBus.off('stitch', onStitch);
  })

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

  function flyToScore(stitch: PositionPair) {

    const stitchEl = document.getElementById('stitch-' + stitch.cnt);
    if (!stitchEl) return;
    const scoreEl = document.getElementById('game-score');
    if (!scoreEl) return;

    const rect = stitchEl.getBoundingClientRect();
    const clone = stitchEl.cloneNode(true) as HTMLElement;
    document.body.appendChild(clone);
    Object.assign(clone.style, {
      position: 'absolute',
      top: rect.top + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      zIndex: 99,
      margin: 0,
      opacity: 1,
    })
    clone.getBoundingClientRect();

    const deltaX = scoreEl.getBoundingClientRect().left - rect.left;
    const deltaY = scoreEl.getBoundingClientRect().top - rect.top;
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
    clone.style.transition = `transform 0.3s ease, opacity 0.5s ease`;
    clone.addEventListener('transitionend', () => {
      // @todo emit score event only here
      clone.remove();
    });

  }

  function onStitch(stitch: PositionPair) {
    const newStitch: PositionPair = {...stitch, cnt: numericId()}
    stitches.push(newStitch);
    // stitches.push(stitch);
    // not very good as it just takes the last stitch out
    //  however, that's fine, it'll work like a stack and all stitches will expire virtually at once
    //  so it will just take out the last ones. However it must disappear fast enough so that only
    //  one piece's stitches are visible at once so keep the effect fast than a player could put a
    //  piece on the board (OR make the PositionPair have an ID but then it has to be a class as well)
    setTimeout(() => {
      flyToScore(newStitch);
      const s = stitches.find(each => each.cnt == newStitch.cnt);
      if (s) {
        stitches.splice(stitches.indexOf(s), 1);
      }
    }, 300);
  }

  function stitchesAt(atX: number, atY: number): PositionPair[] {
    return stitches.filter(each => (each.p1.atX == atX) && (each.p1.atY == atY))
  }

  function stitchLeft(stitch: PositionPair): number {
    return (stitch.p1.atX == stitch.p2.atX ? cellWidth/2 : cellWidth) - imgX/2;
  }

  function stitchTop(stitch: PositionPair): number {
    return (stitch.p1.atY == stitch.p2.atY ? cellWidth/2 : cellWidth) - imgY/2;
  }


</script>
