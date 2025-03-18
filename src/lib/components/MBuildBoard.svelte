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
  <MBoardFields fields={fields} groups={groups} width={width} />
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount} from "svelte";
  import Position from "$lib/game/geometry/Position";
  import Piece from "$lib/game/piece/Piece";
  import {uiBus} from "$lib/util";
  import MBoardFields from "$lib/components/MBoardFields.svelte";
  import {coloredField, emptyField, type FieldType} from "$lib/game/FieldType";
  import { FlatteningIterator, } from "@tomi20v/iterators";
  import {move, rotateCoords} from "@tomi20v/iterators";
  import Group from "$lib/game/Group";

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

  let width: number = $derived.by(() => {
    // this makes sure we update the width when the table size changes
    // const s = serial;
    const extraWidth = sizeX >= 5 ? 2.2 : 1.8;
    const extraHeight = sizeY >= 5 ? 1 : 1.8;
    const perWidth = Math.floor(boardWidth / (sizeX+extraWidth));
    const perHeight = Math.floor(boardHeight / (sizeY+extraHeight));
    const ret = Math.min(perWidth, perHeight);
    return ret;
  })

  onMount(() => {
    fields = Array.from(
            {length: sizeY},
            () => Array.from({length: sizeX}, emptyField)
    );
    uiBus.on('pieceDrop', onPieceDrop);
    uiBus.on('groupExpired', onGroupExpired);
  })

  function fitsOnBoard(iterator: FlatteningIterator<number>): boolean {
    for (const i of iterator) {
      if (i.value && (i.x < 0 || i.x >= sizeX || i.y < 0 || i.y >= sizeY)) {
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
    const w = width;
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
    const group = Group.fromPiece(new Position(cursorAt!.atX, cursorAt!.atY), piece);
    for (const i of iterator) {
      if (i.value) {
        fields[i.y][i.x] = coloredField(piece.color, group.group);
      }
    }
    groups.push(group);
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
      uiBus.emit('dev.points', Math.floor(1000*Math.random()));
    }
  }

</script>
