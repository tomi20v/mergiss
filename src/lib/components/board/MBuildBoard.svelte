<svelte:window onmousemove={throttledOnMouseMove} />
<div bind:this={elem} class="flex flex-grow flex-col gap-0 text-white justify-center align-middle relative">
  {#if (dev)}
    <div class="flex flex-col gap-1 absolute top-0 right-0 bg-red-600 justify-center align-middle" >
      <div class="flex flex-row gap-1 items-center justify-center">
        <button onclick={resizeRemoveColumn}>dec</button>
        <div class="flex flex-col gap-1 position=relative">
          <button onclick={resizeRemoveRow}>dec</button>
          <button onclick={() => resizeAddRow(EDirection.down)}>add</button>
        </div>
        <button onclick={() => resizeAddColumn(EDirection.right)}>add</button>
      </div>
      <div>
        {JSON.stringify(cursorAt)}
        <button onclick={testBonus}>*</button>
        <button onclick={testScoreMultiplier}>**</button>
      </div>
      <div>
        <button onclick="{testScore}">score!</button>
        {#if (playStore.paused)}
        <button onclick={() => playStore.paused=false}>&nbsp;&gt;&nbsp;</button>
        {:else}
        <button onclick={() => playStore.paused=true}>||</button>
        {/if}
        <button onclick={() => { uiBus.emit('launchButtonFill'); onRocketArrivedLate();}}>R</button>
      </div>
    </div>
  {/if}
  {#if showRocketLate}
    <div class="absolute inset-0 flex items-center justify-center" style="z-index: 1000; transform: rotate(-12deg);">
      <img
        src="/rocketLate.png"
        alt="Rocket arrived late"
        class="w-[90%] h-auto object-contain select-none pointer-events-none"
        style="user-drag: none;"
        draggable="false"
        in:scale={{ duration: 600, easing: elasticInOut }}
      />
    </div>
  {/if}
  {#if showRocketBoom}
    <div class="absolute inset-0 w-2/3 place-self-center flex items-center justify-center" style="z-index: 1000; transform: rotate(-12deg);">
        <img
          src="/rocketBoom.png"
          alt="Rocket boom"
          class="w-[90%] h-auto object-contain select-none pointer-events-none"
          style="user-drag: none;"
          draggable="false"
          in:scale={{ duration: 450, easing: elasticInOut }}
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="boom-text">{rocketBoomMultiplier}x</span>
        </div>
    </div>
  {/if}
  <MBoardFields cellWidth={cellWidth} startX={startX} startY={startY} />
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount, onDestroy} from "svelte";
  import {scale} from 'svelte/transition';
  import {elasticInOut} from 'svelte/easing';
  import Position from "$lib/game/geometry/Position";
  import Piece from "$lib/game/piece/Piece";
  import {uiBus} from "$lib/util/uiBus";
  import MBoardFields from "$lib/components/board/MBoardFields.svelte";
  import {emptyField, type FieldType} from "$lib/game/fields.svelte";
  import {FlatteningIterator, move, rotateCoords,} from "@tomi20v/iterators";
  import Group from "$lib/game/Group.svelte";
  import playStore from "$lib/playStore.svelte";
  import {sortedPositionPair} from "$lib/game/geometry/positionPair";
  import {EDirection} from "$lib/game/geometry/EDirection";
  import throttle from 'lodash.throttle';
  import {type Stitch, stitchLevel} from "$lib/game/stitches";
  import {projectile} from "html-trajectory";

  let { boardWidth, boardHeight } = $props();
  let elem: HTMLElement;

  let sizeX: number = $derived(playStore.boardSizeX);
  let sizeY: number = $derived(playStore.boardSizeY);
  // we'll need these so that [0;0] keeps the same ID when unshifting (when unshifting, we'll sub 1 from these)
  let startX: number = $state(0);
  let startY: number = $state(0);
  let cursorAt: Position|null = $state(null);

  let rocketBoomMultiplier: number = $state(0);
  let showRocketBoom: boolean = $state(false);
  let showRocketLate: boolean = $state(false);

  let cellWidth: number = $derived.by(() => {
    const extraWidth = sizeX >= 5 ? 1 : 1.2;
    const extraHeight = sizeY >= 5 ? 1 : 1.2;
    const perWidth = (0.96*boardWidth / (sizeX+extraWidth));
    const perHeight = (0.92*boardHeight / (sizeY+extraHeight));
    return Math.min(perWidth, perHeight);
  })
  // keep it updated in the store too
  $effect(() => {
    playStore.mergeBoardCellWidth = cellWidth;
  })

  onMount(() => {
    setTimeout(() => {
      playStore.fields = Array.from(
              {length: sizeY},
              () => Array.from({length: sizeX}, emptyField)
      )}, 500);
    uiBus.on('pieceDrop', onPieceDrop);
    uiBus.on('groupExpired', onGroupExpired);
    uiBus.on('rocketLaunch', onRocketLaunch);
  })

  onDestroy(() => {
    uiBus.off('pieceDrop', onPieceDrop);
    uiBus.off('groupExpired', onGroupExpired);
    uiBus.off('rocketLaunch', onRocketLaunch);
  });

  function areValidCoordinates(x: number, y: number): boolean {
    return (x >= 0 && x < sizeX && y >= 0 && y < sizeY);
  }

  function boardPositionsAround(p: Position): Position[] {
    return [
      new Position(p.atX, p.atY-1),
      new Position(p.atX+1, p.atY),
      new Position(p.atX, p.atY+1),
      new Position(p.atX-1, p.atY),
    ]
      .filter(each => areValidCoordinates(each.atX, each.atY));
  }

  function fitsOnBoard(iterator: FlatteningIterator<number>, color: string): boolean {
    for (const i of iterator) {
      // skip empty fields in piece
      if (!i.value) continue;
      // doesn't fit if any piece is outside the board
      if (!areValidCoordinates(i.x, i.y)) {
        return false;
      }
      // can put only on empty board field or same color
      const field = playStore.fields[i.y][i.x];
      if (field.color && field.color != color) {
        return false;
      }
    }
    return true;
  }

  function clearRow(row: number) {
    for (let i=0; i<sizeX; i++) {
      playStore.fields[row][i].group = 0;
      playStore.fields[row][i].color = null;
    }
  }
  function clearColumn(column: number) {
    for (let i=0; i<sizeY; i++) {
      playStore.fields[i][column].group = 0;
      playStore.fields[i][column].color = null;
    }
  }

  function expandBoard() {
    const rowCounts: number[] = playStore.fields.map(
      eachRow => eachRow.filter(eachField => eachField.color != null).length
    );
    const columnCounts: number[] = playStore.fields.reduce(
      (acc: number[], row) => row.map((field, x) => acc[x] + (field.color == null ? 0 : 1)),
      Array(playStore.fields[0].length).fill(0)
    )
    const expansions: EDirection[] = [];
  
    const oSizeX = sizeX;
    const oSizeY = sizeY;
  
    // @todo re-count and/or adjust group center
    if (rowCounts[0] == oSizeX) {
      clearRow(0);
      resizeAddRow(EDirection.up);
      expansions.push(EDirection.up);
    }
    if (rowCounts[rowCounts.length-1] == oSizeX) {
      clearRow(rowCounts.length-1);
      resizeAddRow(EDirection.down);
      expansions.push(EDirection.down);
    }
    if (columnCounts[0] == oSizeY) {
      clearColumn(0);
      resizeAddColumn(EDirection.left);
      expansions.push(EDirection.left);
    }
    if (columnCounts[columnCounts.length-1] == oSizeY) {
      clearColumn(columnCounts.length-1);
      resizeAddColumn(EDirection.right);
      expansions.push(EDirection.right);
    }
    if (expansions.length > 0) {
      uiBus.emit('boardExpanded', {
        origin: 'mergeBoard',
        boardSizeBefore: {sizeX: oSizeX, sizeY: oSizeY},
        expansions,
      })
    }
  }

  function expireEmptyGroup() {
    // no need to check all groups, only the last group can be empty
    // for (const group of groups) {
    const group: Group = playStore.groups.slice(-1).pop() as Group;
    if (!playStore.fields.flat().find(each => each.group == group.group)) {
      group.ttl = 0;
      uiBus.emit('groupExpired', {
        group,
        origin: 'emptyGroup',
        bonusMultiplier: playStore.bonusMultiplier,
      });
    }
  }

  function mergeGroups(groupIdsToMerge: Set<number>, stitchCount: number, newGroup: Group): Group {
    const groupsToMerge: Group[] = playStore.groups
      .filter(each => groupIdsToMerge.has(each.group));
    const mergedGroup = groupsToMerge
      .reduce(mergeMapper(groupsToMerge.length, stitchCount), newGroup);

    // update group ID in fields which belong to a merged group
    playStore.fields.flat().forEach(eachField => {
      if (groupIdsToMerge.has(eachField.group)) {
        eachField.group = mergedGroup.group;
      }
    })
    // remove merged ones, and add the new one
    groupsToMerge.forEach(each => {
      playStore.groups.splice(playStore.groups.indexOf(each), 1);
    });
    // note: we shall not use a timeout here as it causes more problems than it solves
    playStore.groups.push(mergedGroup);
    return mergedGroup;
  }

  // curry this to get a (Group, Group) => Group merger function
  // @todo add bonus for overlapping pieces? (MGS-66)
  function mergeMapper(groupCount: number, stitchCount: number) {
    // calculate new center and new TTL
    return (prev: Group, curr: Group): Group => {
      const w = prev.weight + curr.weight;
      // sum of TTLs multiplied by a factor which is higher when joining multiple groups or having
      //  more stitches - just slightly, and even like this it will have to be limited so that
      //  when big pieces touch it won't result in huge TTLs
      // const q = Math.pow(1+(groupsToMerge.length-1)/10+stitchCount/10, 1/4);
      // const q = Math.pow(1+(groupCount-1)/10 + Math.min(stitchCount, 9)/20, 1/4);
      const q = Math.pow(1+(groupCount-1)/15 + Math.min(stitchCount, 9)/25, 1/6);
      const ttl = Math.min(
        (prev.ttl*2 + curr.ttl),
        (prev.ttl + curr.ttl*2),
        (prev.ttl * 1.05 + curr.ttl * 1.4 + 1),
        (prev.ttl + curr.ttl) * q
      );
      const score = Math.sqrt(prev.score + curr.score) + Math.min(
        (prev.score*2 + curr.score),
        (prev.score + curr.score*2),
        (prev.score * 1.05 + curr.score * 1.4 + 1),
        (prev.score + curr.score) * q
      );
      return new Group(
        (prev.centerX*prev.weight + curr.centerX*curr.weight) / w,
        (prev.centerY*prev.weight + curr.centerY*curr.weight) / w,
        w,
        score,
        ttl,
        Math.min(prev.createdAt, curr.createdAt)
      );
    }
  }

  function onGroupExpired({group, origin, bonusMultiplier}: {group: Group, origin: string, bonusMultiplier: number}) {
    if (origin == "rocketLaunch") {
      onRocketBoom(bonusMultiplier);
    }
    const index = playStore.groups.indexOf(group);
    playStore.fields.flat().forEach(field => {
      if (field.group == group.group) {
        field.color = null;
        field.group = 0;
      }
    })
    playStore.groups.splice(index, 1);
  }

  // throttling this probably helps with performance
  const throttledOnMouseMove = throttle(onMouseMove, 10);

  function onMouseMove(event: MouseEvent) {
    // NOTE these can't easily be precached as it just causes problems
    const field = elem.querySelector('.m-board-field');
    const p = field?.getBoundingClientRect();
    const w = cellWidth;
    if (!p || event.clientX < p.left || event.clientY < p.top) {
      cursorAt = null;
      return;
    }
    const relX = Math.floor((event.clientX - p.left) / w);
    const relY = Math.floor((event.clientY - p.top) / w);
    if ((relX < sizeX) && (relY < sizeY)) {
      // using the conditional it is measurably faster vs always creating a new Position, eg. 0.01 vs 0.03
      if (!cursorAt?.equals(relX, relY)) {
        cursorAt = new Position(relX, relY);
      }
    }
    else {
      cursorAt = null;
    }
  }

  function onPieceDrop({
    piece,
    dragAt,
    dragTime,
  }: {
    piece: Piece,
    dragAt: Position,
    dragTime: number,
  }) {

    // piece was not dropped over the board
    if (!cursorAt) {
      return;
    }

    const iterator = piece.getFlatIterator()
      .use(
        move({x: -dragAt.atX, y: -dragAt.atY}),
        rotateCoords(dragAt.rotXY),
        move({x: cursorAt.atX, y: cursorAt.atY})
      );

    // when piece is dropped over the board, but doesn't fit
    if (!fitsOnBoard(iterator, piece.color)) {
      piece.dropped();
      uiBus.emit("pieceDoesntFit", {
        piece,
        origin: "mergeBoard",
      })
      return;
    }

    putOnBoard(piece, iterator);
    cursorAt = null;
    uiBus.emit('pieceDropped', {
      origin: 'mergeBoard',
      piece: piece,
      dragTime,
    });

  }

  function putOnBoard(piece: Piece, iterator: FlatteningIterator<number>) {
    // calculate center for new group
    const p = [...iterator]
      .filter(each => each.value)
      .reduce(
        (acc, each) => ({ x: acc.x + each.x + 0.5, y: acc.y + each.y + 0.5, cnt: acc.cnt + 1 }),
        {x: 0, y: 0, cnt: 0});
    // first just create a new grooup. We'll merge it with connecting groups later
    const newGroup = Group.fromPiece(new Position(p.x/p.cnt, p.y/p.cnt), piece);
    const groupIdsToMerge: Set<number> = new Set();
    let overlaps = 0;
    const stitches: Stitch[] = [];
    let mergedGroup!: Group;

    // set fields to contain new color and group, gather groups with which the new piece overlaps
    for (const i of iterator) {
      if (!i.value) continue;
      let groupUnder = playStore.fields[i.y][i.x].group;
      if (groupUnder) {
        overlaps++;
        groupIdsToMerge.add(groupUnder);
        const p = new Position(i.x, i.y);
        stitches.push({
          ...sortedPositionPair(p, p),
          level: stitchLevel(p, piece.color, p, playStore.fields[i.y][i.x].color ?? ''),
          group: newGroup.group,
        });
      }
      playStore.fields[i.y][i.x].color = piece.color;
      playStore.fields[i.y][i.x].group = newGroup.group;
    }
  
    // look around each field and check touching groups
    // stitches for underlying fields were added already
    for (const i of iterator) {
      if (!i.value) continue;
      const position = new Position(i.x, i.y);
      boardPositionsAround(position)
        .forEach(otherPosition => {
          const otherField = playStore.fields[otherPosition.atY][otherPosition.atX];
          const otherGroupId = otherField.group;
          if (!otherGroupId) return;
          // this will pick up newGroup.id as well, so it will be merged too
          groupIdsToMerge.add(otherGroupId);
          if (otherGroupId != newGroup.group) {
            // Set cnt to 1 if colors match, 0 if different
            stitches.push({
              ...sortedPositionPair(position, otherPosition),
              level: stitchLevel(position, piece.color, otherPosition, otherField.color ?? ''),
              group: newGroup.group,
            });
          }
        })
    }

    // merge groups as needed
    if (groupIdsToMerge.size > 0) {

      mergedGroup = mergeGroups(groupIdsToMerge, stitches.length, newGroup);

      stitches.forEach(each => {
        uiBus.emit('stitch', {...each, cnt: stitches.length});
      })

    }
    else {
      playStore.groups.push(newGroup);
    }

    uiBus.emit('groupCreated', {
      group: mergedGroup ?? newGroup,
      mergedGroupCount: groupIdsToMerge.size,
      overlaps: overlaps,
      stitchCount: stitches.length,
    })

    // delaying helps so that initially we show the piece in place, so that
    //  the stitches don't appeair in the middle of nothing
    setTimeout(() => {
      expandBoard();
      expireEmptyGroup();
    }, 300);

  }

  function onRocketArrivedLate() {
    showRocketLate = true;
    // Hide the image after a few seconds
    setTimeout(() => {
      showRocketLate = false;
    }, 999);
  }

  function onRocketBoom(bonusMultiplier: number) {
    rocketBoomMultiplier = Number((bonusMultiplier * playStore.rocketMultiplier).toFixed(1));
    showRocketBoom = true;
    // Hide the image after a few seconds
    setTimeout(() => {
      showRocketBoom = false;
    }, 799);
  }

  function onRocketLaunch(event: {
    origin: string,
    flyingId: string,
    flyOptions: object,
  }) {

    // deny launch if there's no groups
    if (playStore.groups.length === 0) {
      uiBus.emit('rocketLaunchFailed');
      return;
    }
  
    // Find the group with the maximum weight
    let biggestGroup = playStore.groups[0];
    for (let i = 1; i < playStore.groups.length; i++) {
      if (playStore.groups[i].weight > biggestGroup.weight) {
        biggestGroup = playStore.groups[i];
      }
    }

    function groupExists(groupId: number): boolean {
      return playStore.groups.some(each => each.group == groupId);
    }

    // flyTo(
    projectile(
      event.flyingId,
      'group-countdown-' + biggestGroup.group,
      Object.assign({}, event.flyOptions, {
        onTransitionEnd: () => {
          // if group expired meanwhile, don't do anything. It could actually show an explosion
          if (!groupExists(biggestGroup.group)) {
            uiBus.emit('rocketArrivedLate');
            onRocketArrivedLate();
            return;
          }
          uiBus.emit('groupExpired', {
            group: biggestGroup,
            htmlId: 'group-countdown-' + biggestGroup.group,
            origin: 'rocketLaunch',
            bonusMultiplier: playStore.bonusMultiplier,
          });
        }
      })
    );

    // Emit rocketLaunched event after the animation completes
    uiBus.emit('rocketLaunched');

  }

  function resizeAddColumn(direction: EDirection) {
    playStore.boardSizeX++;
    if (direction == EDirection.left) {
      startX--;
    }
    playStore.fields.forEach(each => direction == EDirection.left ? each.unshift(emptyField()) : each.push(emptyField()));
    // fields.forEach(each => setTimeout(() => each.push(emptyField()), 400*Math.random()));
    uiBus.emit("boardResized");
  }
  function resizeAddRow(direction: EDirection) {
    playStore.boardSizeY++;
    const row: FieldType[] = Array.from({length: sizeX}, emptyField);
    if (direction == EDirection.up) {
      playStore.fields.unshift(row);
      startY--;
    }
    else {
      playStore.fields.push(row);
    }
    uiBus.emit("boardResized");
  }
  function resizeRemoveColumn() {
    if (sizeX <= 3) {
      return;
    }
    playStore.boardSizeX--;
    playStore.fields.forEach(each => each.pop());
    // funky effect :D
    // fields.forEach(each => setTimeout(() => each.pop(), 400*Math.random()));
    uiBus.emit("boardResized");
  }
  function resizeRemoveRow() {
    if (sizeY <= 3) {
      return;
    }
    playStore.boardSizeY--;
    playStore.fields.pop();
    uiBus.emit("boardResized");
  }

  function testBonus() {
    uiBus.emit('dev.bonus');
  }

  function testScore() {
    if (import.meta.env.MODE === 'development') {
      uiBus.emit('dev.score', Math.floor(1000*Math.random()));
    }
  }

  function testScoreMultiplier() {
    playStore.scoreMultiplier = playStore.scoreMultiplier + 1;
  }

</script>

<style lang="postcss">
  .boom-text {
    font-size: 5vw;
    font-weight: bold;
    color: #ff0000;
    text-shadow:
      -2px -2px 0 #fff,
      2px -2px 0 #fff,
      -2px 2px 0 #fff,
      2px 2px 0 #fff,
      0 0 15px #ff9900,
      0 0 30px #ff9900;
    transform: rotate(8deg);
    animation: pulse-boom 0.2s ease-in-out infinite alternate;
    letter-spacing: 0.5vw;
    user-select: none;
  }

  @keyframes pulse-boom {
    from {
      transform: scale(1) rotate(8deg);
    }
    to {
      transform: scale(1.2) rotate(-8deg);
    }
  }
</style>
