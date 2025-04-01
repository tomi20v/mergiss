<svelte:window onmousemove={onMouseMove} />
<div bind:this={elem} class="flex flex-grow flex-col gap-0 p-2 text-white justify-center align-middle relative">
  {#if (dev)}
    <div class="flex flex-col gap-1 absolute top-0 right-0 bg-red-600 justify-center align-middle" >
      <div class="flex flex-row gap-1 items-center justify-center">
        <button onclick={resizeRemoveColumn}>dec</button>
        <div class="flex flex-col gap-1 position=relative">
          <button onclick={resizeRemoveRow}>dec</button>
          <button onclick={resizeAddRow}>add</button>
        </div>
        <button onclick={resizeAddColumn}>add</button>
      </div>
      <div>{JSON.stringify(cursorAt)}</div>
      <div><button onclick="{testScore}">score!</button></div>
    </div>
  {/if}
  <MBoardFields fields={fields} groups={groups} cellWidth={cellWidth} />
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount} from "svelte";
  import Position from "$lib/game/geometry/Position";
  import Piece from "$lib/game/piece/Piece";
  import {uiBus} from "$lib/util/uiBus";
  import MBoardFields from "$lib/components/MBoardFields.svelte";
  import {coloredField, emptyField, type FieldType} from "$lib/game/fields";
  import {FlatteningIterator, move, rotateCoords,} from "@tomi20v/iterators";
  import Group from "$lib/game/Group";
  import playStore from "$lib/playStore.svelte";
  import {type PositionPair, sortedPositionPair} from "$lib/game/geometry/positionPair";
  import {EDirection} from "$lib/game/geometry/EDirection";

  let { boardWidth, boardHeight } = $props();
  let elem: HTMLElement;
  // @todo these shall go into some game state ("save") management
  // const sX = 3, sY = 3;
  // const sX = 3, sY = 3;
  const sX = 5, sY = 5;
  // const sX = 10, sY = 10;
  // const sX = 15, sY = 15;
  // const sX = 30, sY = 20;
  // const sX = 5, sY = 20;
  // const sX = 5, sY = 30;
  // const sX = 30, sY = 30;
  // const sX = 40, sY = 20;
  // const sX = 42, sY = 42;

  let sizeX: number = $state(sX);
  let sizeY: number = $state(sY);
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

  function onGroupExpired({group}: {group: Group}) {
    const index = groups.indexOf(group);
    for (const row of fields) {
      for (const field of row) {
        if (field.group == group.group) {
          field.color = null;
          field.group = 0;
        }
      }
    }
    groups.splice(index, 1);
  }

  function onMouseMove(event: MouseEvent) {
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

  function onPieceDrop({piece, dragAt}: {piece: Piece, dragAt: Position}) {

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
    uiBus.emit('pieceDropped', {origin: 'mergeBoard', piece: piece});

  }

  function putOnBoard(piece: Piece, iterator: FlatteningIterator<number>) {
    // first just create a new grooup. We'll merge it with connecting groups later
    const newGroup = Group.fromPiece(new Position(cursorAt!.atX, cursorAt!.atY), piece);
    const groupIdsToMerge: Set<number> = new Set();
    const stitches: PositionPair[] = [];

    // set fields to contain new color and group, gather groups with which the new piece overlaps
    for (const i of iterator) {
      if (!i.value) continue;
      let groupUnder = fields[i.y][i.x].group;
      if (groupUnder) {
        groupIdsToMerge.add(groupUnder);
      }
      fields[i.y][i.x] = coloredField(piece.color, newGroup.group);
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

      mergeGroups(groupIdsToMerge, stitches.length, newGroup);

      stitches.forEach(each => {
        uiBus.emit('stitch', {...each, cnt: stitches.length});
      })

    }
    else {
      groups.push(newGroup);
    }

    const rowCounts: number[] = fields.map(
      eachRow => eachRow.filter(eachField => eachField.color != null).length
    );
    const columnCounts: number[] = fields.reduce(
      (acc: number[], row) => row.map((field, x) => acc[x] + (field.color == null ? 0 : 1)),
      Array(fields[0].length).fill(0)
    )

    const oSizeX = sizeX;
    const oSizeY = sizeY;

    // unshifting effs up the current board content internally, results in "cannot read properties of undefined reading 'group' at MGroupCountDown 57:19 accelerate
    // it could be solved by recalculating group center after shifts
    // however, animation is also hindered in this case (shows in: animation for last row/column, not first one)
    // @todo re-count and/or adjust (when unshifting) group centers
    if (rowCounts[0] == oSizeX) {
      resizeAddRow(EDirection.up);
    }
    if (rowCounts[rowCounts.length-1] == oSizeX) {
      resizeAddRow(EDirection.down);
    }
    if (columnCounts[0] == oSizeY) {
      resizeAddColumn(EDirection.left);
    }
    if (columnCounts[columnCounts.length-1] == oSizeY) {
      resizeAddColumn(EDirection.right);
    }
    // @todo remove groups without fields after cleanup

    // uiBus.emit('pieceDropped', {origin: 'mergeBoard', piece: piece});
  }

  function mergeGroups(groupIdsToMerge: Set<number>, stitchCount: number, newGroup: Group) {
    const groupsToMerge: Group[] = groups
      .filter(each => groupIdsToMerge.has(each.group));
    const mergedGroup = groupsToMerge
      .reduce(mergeMapper(groupsToMerge.length, stitchCount), newGroup);

    // update group ID in fields which belong to a merged group
    fields.forEach(eachRow => {
      eachRow.forEach(eachField => {
        if (groupIdsToMerge.has(eachField.group)) {
          eachField.group = mergedGroup.group;
        }
      })
    })

    // remove merged ones, and add the new one
    groupsToMerge.forEach(each => {
      groups.splice(groups.indexOf(each), 1);
    });
    // I need a slight timeout so that MBoardFields can pick up the change even when the center hasn't changed
    setTimeout(() => groups.push(mergedGroup), 1);
  }

  // curry this to get a (Group, Group) => Group merger function
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
      return new Group(
        (prev.centerX*prev.weight + curr.centerX*curr.weight) / w,
        (prev.centerY*prev.weight + curr.centerY*curr.weight) / w,
        w,
        ttl,
      );
    }
  }

  function resizeAddColumn(direction: EDirection) {
    sizeX++;
    fields.forEach(each => direction == EDirection.left ? each.unshift(emptyField()) : each.push(emptyField()));
    // fields.forEach(each => setTimeout(() => each.push(emptyField()), 400*Math.random()));
  }
  function resizeAddRow(direction: EDirection) {
    sizeY++;
    const row: FieldType[] = [];
    for (let x=0; x<sizeX; x++) {
      row.push(emptyField());
    }
    if (direction == EDirection.up) {
      fields.unshift(row);
    }
    else {
      fields.push(row);
    }
  }
  function resizeRemoveColumn() {
    if (sizeX <= 3) {
      return;
    }
    sizeX--;
    fields.forEach(each => each.pop());
    // funky effect :D
    // fields.forEach(each => setTimeout(() => each.pop(), 400*Math.random()));
  }
  function resizeRemoveRow() {
    if (sizeY <= 3) {
      return;
    }
    sizeY--;
    fields.pop();
  }

  function testScore() {
    if (import.meta.env.MODE === 'development') {
      uiBus.emit('dev.score', Math.floor(1000*Math.random()));
    }
  }

</script>
