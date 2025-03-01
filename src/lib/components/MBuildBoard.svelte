<svelte:window
        onmousemove={onMouseMove}
/>
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
      <div>{JSON.stringify(pieceAt)}</div>
    </div>
  {/if}
  <MBoardFields fields={fields} width={width} />
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount} from "svelte";
  import Position from "$lib/game/geometry/Position";
  import Piece from "$lib/game/piece/Piece";
  import {uiBus} from "$lib/util";
  import MBoardFields from "$lib/components/MBoardFields.svelte";
  import {coloredField, emptyField, type FieldType} from "$lib/components/FieldType";

  let { boardWidth, boardHeight } = $props();
  let elem: HTMLElement;
  // @todo these shall go into some game state ("save") management
  const sX = 5, sY = 5;
  // const sX = 10, sY = 10;
  // const sX = 30, sY = 20;
  // const sX = 40, sY = 20;
  // const sX = 15, sY = 15;
  // const sX = 42, sY = 42;

  let sizeX: number = $state(sX);
  let sizeY: number = $state(sY);
  let fields: FieldType[][] = $state([]);

  let pieceAt: Position|null = $state(null);

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
            {length: sizeX},
            () => Array.from({length: sizeY}, emptyField)
    );
    uiBus.on('pieceDrop', onPieceDrop);
  })

  function fitsOnBoard(piece: Piece, position: Position): boolean {
    return (position.atX >= 0) && ((position.atX + piece.sizeX()) <= sizeX) &&
           (position.atY >= 0) && ((position.atY + piece.sizeY()) <= sizeY);
  }

  function onPieceDrop(eventData: {piece: Piece, dragAt: Position}) {
    // console.log('pieceDrop', pieceAt);
    if (!pieceAt) {
      return;
    }
    const piecePosition = pieceAt.sub(eventData.dragAt);
    if (!fitsOnBoard(eventData.piece, piecePosition)) {
      return;
    }
    putOnBoard(eventData.piece, piecePosition);
    pieceAt = null;
    uiBus.emit('pieceDropped', {origin: 'mergeBoard', piece: eventData.piece});
  }

  function onMouseMove(event: MouseEvent) {
    const field = elem.querySelector('.m-board-field');
    const p = field?.getBoundingClientRect();
    const w = width;
    if (!p || event.clientX < p.left || event.clientY < p.top) {
      pieceAt = null;
      return;
    }
    const relX = Math.floor((event.clientX - p.left) / w);
    const relY = Math.floor((event.clientY - p.top) / w);
    if ((relX < sizeX) && (relY < sizeY)) {
      // using the conditional it is measurably faster vs always creating a new Position, eg. 0.01 vs 0.03
      if (!pieceAt?.equals(relX, relY)) {
        pieceAt = new Position(relX, relY);
      }
    }
    else {
      pieceAt = null;
    }
  }

  function putOnBoard(piece: Piece, position: Position) {
    // console.log('put on board: ', piece, position);
    for (let pieceY=0; pieceY<piece.sizeY(); pieceY++) {
      for (let pieceX=0; pieceX<piece.sizeX(); pieceX++) {
        const boardX = position.atX + pieceX;
        const boardY = position.atY + pieceY;
        if (piece.pixelMap[pieceY][pieceX]) {
          fields[boardY][boardX] = coloredField(piece.color);
        }
      }
    }
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

</script>
