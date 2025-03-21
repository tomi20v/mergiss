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
  import { FlatteningIterator, } from "@tomi20v/iterators";
  import {move, rotateCoords} from "@tomi20v/iterators";
  import Group from "$lib/game/Group";
  import playStore from "$lib/playStore.svelte";

  let { boardWidth, boardHeight } = $props();
  let elem: HTMLElement;
  // @todo these shall go into some game state ("save") management
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

  function fitsOnBoard(iterator: FlatteningIterator<number>): boolean {
    for (const i of iterator) {
      if (i.value && !areValidCoordinates(i.x, i.y)) {
        return false;
      }
    }
    return true;
  }

  function onGroupExpired(group: Group) {
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

    if (!fitsOnBoard(iterator)) {
      return;
    }

    putOnBoard(piece, iterator);
    cursorAt = null;
    uiBus.emit('pieceDropped', {origin: 'mergeBoard', piece: piece});

  }

  function putOnBoard(piece: Piece, iterator: FlatteningIterator<number>) {
    // first just create a new grooup. We'll merge it with connecting groups later
    const newGroup = Group.fromPiece(new Position(cursorAt!.atX, cursorAt!.atY), piece);
    const groupsToMerge: Group[] = [];
    for (const i of iterator) {
      if (i.value) {
        fields[i.y][i.x] = coloredField(piece.color, newGroup.group);
        const position = new Position(i.x, i.y);
        boardPositionsAround(position)
          .forEach(otherPosition => {
            const otherField: FieldType = fields[otherPosition.atY][otherPosition.atX];
            if ((otherField.color !== null) && (otherField.group !== newGroup.group)) {
              const otherGroup = groups.find(each => each.group == otherField.group);
              // there will always be an otherGroup in practice, butkeep compiler happy
              if (otherGroup && !groupsToMerge.includes(otherGroup)) {
                groupsToMerge.push(otherGroup);
              }
              // I will need this to get extra points for stiching. OR maybe could just
              //  emit count of stiches with the (final) group created?
              // uiBus.emit('pieceStitch', {group, otherGroup, position, otherPosition})
            }
          })
      }
    }

    if (groupsToMerge.length > 0) {
      // we'll merge this new group immediately (as groups are immutable)
      groupsToMerge.push(newGroup);
      // calculate new center and new TTL
      const newCenter = groupsToMerge.reduce((prev, curr) => {
        const w = prev.weight + curr.weight;
        return {
          x: (prev.x*prev.weight + curr.centerX*curr.weight) / w,
          y: (prev.y*prev.weight + curr.centerY*curr.weight) / w,
          weight: w,
          ttl: (prev.ttl*prev.weight + curr.ttl*curr.weight) / w * Math.pow(groupsToMerge.length-1, 1/2),
        }
      }, {x: 0, y: 0, weight: 0, ttl: 0});
      const megedGroup = new Group(newCenter.x, newCenter.y, newCenter.weight, newCenter.ttl);
      const groupIdsToMerge = groupsToMerge.map(each => each.group);

      // update group ID in fields which belong to a merged group
      fields.forEach(eachRow => {
        eachRow.forEach(eachField => {
          if (groupIdsToMerge.includes(eachField.group)) {
            eachField.group = megedGroup.group;
          }
        })
      })

      // remove merged ones, and add the new one
      groupsToMerge.forEach(each => {
        groups.splice(groups.indexOf(each), 1);
      });
      groups.push(megedGroup);
    }
    else {
      groups.push(newGroup);
    }
    // uiBus.emit('pieceDropped', {origin: 'mergeBoard', piece: piece});
  }

  function resizeAddColumn() {
    sizeX++;
    fields.forEach(each => each.push(emptyField()));
    // fields.forEach(each => setTimeout(() => each.push(emptyField()), 400*Math.random()));
  }
  function resizeRemoveColumn() {
    if (sizeX <= 5) {
      return;
    }
    sizeX--;
    fields.forEach(each => each.pop());
    // funky effect :D
    // fields.forEach(each => setTimeout(() => each.pop(), 400*Math.random()));
  }
  function resizeAddRow() {
    sizeY++;
    const row: FieldType[] = [];
    for (let x=0; x<sizeX; x++) {
      row.push(emptyField());
    }
    fields.push(row);
  }
  function resizeRemoveRow() {
    if (sizeY <= 5) {
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

  function boardPositionsAround(p: Position): Position[] {
    return [
      new Position(p.atX, p.atY-1),
      new Position(p.atX+1, p.atY),
      new Position(p.atX, p.atY+1),
      new Position(p.atX-1, p.atY),
    ]
      .filter(each => areValidCoordinates(each.atX, each.atY));
  }

</script>
