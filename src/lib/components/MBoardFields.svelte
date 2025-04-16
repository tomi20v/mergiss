{#each fields as row, iY}
  <div id="board-row-{iY+startY}"
       class="flex gap-0 justify-center m-board-row"
       in:blur={{duration: 200}}
  >
    <!--{#each row as field, iX (field.id)}-->
    {#each row as field, iX (iX + startX + '-' + iY + '-' + field.id)}
      <div id="board-field-{iX+startX}-{iY+startY}"
           class="flex m-board-field relative"
           style="color: white;
                  aspect-ratio: 1;
                  background-size: 100%;
                  background-image: url({backgroundImageOf(iX, iY)});
                  "
           style:width="{cellWidth}px"
           in:elasticTransition|global
           onfocus={() => null}
           role="none"
           onmousedown={() => onMouseDown(iX, iY)}
      >

        {#each (stitchesAt(iX, iY)) as stitch}
          <img src="stitch.png" id="stitch-{stitch.id}" alt=""
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
          <div id="{field.id}"
              class="flex grow m-0.5 m-board-field-inner items-center justify-center"
              style="border-radius: 15%; background-color: {color}; box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray;"
              in:blur={{duration: 200}}
              out:blur={{duration: 400}}
          ></div>
        {/if}

        {#if (groupCenterAt(iX, iY))}
          {@const group = groupCenterAt(iX, iY)}
          <div class="flex m-0.5 absolute top-0 right-0 bottom-0 left-0 items-center justify-center">
            <MGroupCountdown group={group as Group} color={''} />
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
  import type {FieldType} from "$lib/game/fields.svelte";
  import MGroupCountdown from "$lib/components/MGroupCountdown.svelte";
  import Group from "$lib/game/Group.svelte.js";
  import {uiBus} from "$lib/util/uiBus";
  import type {PositionPair} from "$lib/game/geometry/positionPair";

  let {
    fields,
    groups,
    cellWidth,
    startX,
    startY,
  }: {
    cellWidth: number,
    groups: Group[],
    fields: FieldType[][],
    startX: number,
    startY: number,
  } = $props();

  // image size: 115*96, 272 is a very big cell (3*3 on some very high resolution), so
  //  scaling will practically always be downscaling, that's good
  const imgX = $derived(cellWidth/272 * 115);
  const imgY = $derived(cellWidth/272 * 96);
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
    return groups.find(each => (Math.floor(each.centerX) == atX) && (Math.floor(each.centerY) == atY));
    // return groups.find(each => (Math.ceil(each.centerX) == atX) && (Math.ceil(each.centerY) == atY));
    // return groups.find(each => (Math.round(each.centerX) == atX) && (Math.round(each.centerY) == atY));
  }

  function onMouseDown(atX: number, atY: number) {
    const field = fields[atY][atX];
    if (field.group) {
      uiBus.emit('accelerateGroup', fields[atY][atX].group);
    }
  }

  function onStitch(stitch: PositionPair) {
    stitches.push(stitch);
    setTimeout(() => {
      const s = stitches.find(each => each.id == stitch.id);
      if (s) {
        stitches.splice(stitches.indexOf(s), 1);
        uiBus.emit('stitchExpired', {stitch: s, htmlId: 'stitch-' + stitch.id});
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
