<svelte:window onmousemove={throttledOnMouseMove} />
<div bind:this={elem} class="flex flex-grow flex-col gap-0 p-2 text-white justify-center align-middle relative">
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
      <div>{JSON.stringify(cursorAt)}</div>
      <div>
        <button onclick="{testScore}">score!</button>
        {#if (playStore.paused)}
        <button onclick={() => playStore.paused=false}>&nbsp;&gt;&nbsp;</button>
        {:else}
        <button onclick={() => playStore.paused=true}>||</button>
        {/if}
      </div>
    </div>
  {/if}
  <MBoardFields fields={fields} groups={groups} cellWidth={cellWidth} startX={startX} startY={startY} />
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount, onDestroy} from "svelte";
  import Position from "$lib/game/geometry/Position";
  import Piece from "$lib/game/piece/Piece";
  import {uiBus} from "$lib/util/uiBus";
  import MBoardFields from "$lib/components/MBoardFields.svelte";
  import {emptyField, type FieldType} from "$lib/game/fields.svelte";
  import {FlatteningIterator, move, rotateCoords,} from "@tomi20v/iterators";
  import Group from "$lib/game/Group";
  import playStore from "$lib/playStore.svelte";
  import {type PositionPair, sortedPositionPair} from "$lib/game/geometry/positionPair";
  import {EDirection} from "$lib/game/geometry/EDirection";
  import throttle from 'lodash.throttle';

  let { boardWidth, boardHeight } = $props();
  let elem: HTMLElement;

  let sizeX: number = $derived(playStore.boardSizeX);
  let sizeY: number = $derived(playStore.boardSizeY);
  // we'll need these so that [0;0] keeps the same ID when unshifting (when unshifting, we'll sub 1 from these)
  let startX: number = $state(0);
  let startY: number = $state(0);
  let fields: FieldType[][] = $state([]);
  const groups: Group[] = $state([]);

  let cursorAt: Position|null = $state(null);

  let cellWidth: number = $derived.by(() => {
    // this makes sure we update the width when the table size changes
    // const s = serial;
    const extraWidth = sizeX >= 5 ? 2.2 : 1.8;
    const extraHeight = sizeY >= 5 ? 1 : 1.8;
    const perWidth = Math.floor(boardWidth / (sizeX+extraWidth));
    const perHeight = Math.floor(boardHeight / (sizeY+extraHeight));
    const ret = Math.min(perWidth, perHeight);
    return ret;
  })
  // keep it updated in the store too
  $effect(() => {
    playStore.mergeBoardCellWidth = cellWidth;
  })

  onMount(() => {
    fields = Array.from(
            {length: sizeY},
            () => Array.from({length: sizeX}, emptyField)
    );
    uiBus.on('pieceDrop', onPieceDrop);
    uiBus.on('groupExpired', onGroupExpired);
  })

  onDestroy(() => {
    uiBus.off('pieceDrop', onPieceDrop);
    uiBus.off('groupExpired', onGroupExpired);
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
      const field = fields[i.y][i.x];
      if (field.color && field.color != color) {
        return false;
      }
    }
    return true;
  }

  function clearRow(row: number) {
    for (let i=0; i<sizeX; i++) {
      fields[row][i].group = 0;
      fields[row][i].color = null;
    }
  }
  function clearColumn(column: number) {
    for (let i=0; i<sizeY; i++) {
      fields[i][column].group = 0;
      fields[i][column].color = null;
    }
  }

  function expandBoard() {
    const rowCounts: number[] = fields.map(
      eachRow => eachRow.filter(eachField => eachField.color != null).length
    );
    const columnCounts: number[] = fields.reduce(
      (acc: number[], row) => row.map((field, x) => acc[x] + (field.color == null ? 0 : 1)),
      Array(fields[0].length).fill(0)
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
    const group: Group = groups.slice(-1).pop() as Group;
    if (!fields.flat().find(each => each.group == group.group)) {
      group.ttl = 0;
    }
    uiBus.emit('groupExpired', {group});
  }

  function mergeGroups(groupIdsToMerge: Set<number>, stitchCount: number, newGroup: Group): Group {
    const groupsToMerge: Group[] = groups
      .filter(each => groupIdsToMerge.has(each.group));
    const mergedGroup = groupsToMerge
      .reduce(mergeMapper(groupsToMerge.length, stitchCount), newGroup);

    // update group ID in fields which belong to a merged group
    fields.flat().forEach(eachField => {
      if (groupIdsToMerge.has(eachField.group)) {
        eachField.group = mergedGroup.group;
      }
    })
    // remove merged ones, and add the new one
    groupsToMerge.forEach(each => {
      groups.splice(groups.indexOf(each), 1);
    });
    // note: we shall not use a timeout here as it causes more problems than it solves
    groups.push(mergedGroup);
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
      const q = Math.pow(1+(groupCount-1)/10 + Math.min(stitchCount, 9)/20, 1/4);
      const ttl = Math.min(
        (prev.ttl*2 + curr.ttl),
        (prev.ttl + curr.ttl*2),
        (prev.ttl * 1.05 + curr.ttl * 1.4 + 1),
        (prev.ttl + curr.ttl) * q
      );
      const score = Math.min(
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
      );
    }
  }

  function onGroupExpired({group}: {group: Group}) {
    const index = groups.indexOf(group);
    fields.flat().forEach(field => {
      if (field.group == group.group) {
        field.color = null;
        field.group = 0;
      }
    })
    groups.splice(index, 1);
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
    rotationCount,
  }: {
    piece: Piece,
    dragAt: Position,
    dragTime: number,
    rotationCount: number,
  }) {

    if (!cursorAt) {
      return;
    }

    const iterator = piece.getFlatIterator()
      .use(
        move({x: -dragAt.atX, y: -dragAt.atY}),
        rotateCoords(dragAt.rotXY),
        move({x: cursorAt.atX, y: cursorAt.atY})
      );

    if (!fitsOnBoard(iterator, piece.color)) {
      return;
    }

    putOnBoard(piece, iterator);
    cursorAt = null;
    uiBus.emit('pieceDropped', {
      origin: 'mergeBoard',
      piece: piece,
      dragTime,
      rotationCount,
    });

  }

  function putOnBoard(piece: Piece, iterator: FlatteningIterator<number>) {
    // first just create a new grooup. We'll merge it with connecting groups later
    const newGroup = Group.fromPiece(new Position(cursorAt!.atX, cursorAt!.atY), piece);
    const groupIdsToMerge: Set<number> = new Set();
    let overlaps = 0;
    const stitches: PositionPair[] = [];
    let mergedGroup!: Group;

    // set fields to contain new color and group, gather groups with which the new piece overlaps
    for (const i of iterator) {
      if (!i.value) continue;
      let groupUnder = fields[i.y][i.x].group;
      if (groupUnder) {
        overlaps++;
        groupIdsToMerge.add(groupUnder);
      }
      fields[i.y][i.x].color = piece.color;
      fields[i.y][i.x].group = newGroup.group;
    }

    // look around each field and check touching groups
    for (const i of iterator) {
      if (!i.value) continue;
      const position = new Position(i.x, i.y);
      boardPositionsAround(position)
        .forEach(otherPosition => {
          const otherGroupId = fields[otherPosition.atY][otherPosition.atX].group;
          if (!otherGroupId) return;
          // this will pick up newGroup.id as well, so it will be merged too
          groupIdsToMerge.add(otherGroupId);
          if (otherGroupId != newGroup.group) {
            stitches.push(sortedPositionPair(position, otherPosition));
          }
        })
    }

    if (groupIdsToMerge.size > 0) {

      mergedGroup = mergeGroups(groupIdsToMerge, stitches.length, newGroup);

      stitches.forEach(each => {
        uiBus.emit('stitch', {...each, cnt: stitches.length});
      })

    }
    else {
      groups.push(newGroup);
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

  function resizeAddColumn(direction: EDirection) {
    playStore.boardSizeX++;
    if (direction == EDirection.left) {
      startX--;
    }
    fields.forEach(each => direction == EDirection.left ? each.unshift(emptyField()) : each.push(emptyField()));
    // fields.forEach(each => setTimeout(() => each.push(emptyField()), 400*Math.random()));
  }
  function resizeAddRow(direction: EDirection) {
    playStore.boardSizeY++;
    const row: FieldType[] = Array.from({length: sizeX}, emptyField);
    if (direction == EDirection.up) {
      fields.unshift(row);
      startY--;
    }
    else {
      fields.push(row);
    }
  }
  function resizeRemoveColumn() {
    if (sizeX <= 3) {
      return;
    }
    playStore.boardSizeX--;
    fields.forEach(each => each.pop());
    // funky effect :D
    // fields.forEach(each => setTimeout(() => each.pop(), 400*Math.random()));
  }
  function resizeRemoveRow() {
    if (sizeY <= 3) {
      return;
    }
    playStore.boardSizeY--;
    fields.pop();
  }

  function testScore() {
    if (import.meta.env.MODE === 'development') {
      uiBus.emit('dev.score', Math.floor(1000*Math.random()));
    }
  }

</script>
