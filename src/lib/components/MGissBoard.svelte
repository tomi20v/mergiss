<div class="flex flex-grow flex-col gap-0 p-2 text-white justify-center align-middle relative">
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
  {#each fields as row, iY}
  <div class="flex gap-0 justify-center">
    {#each row as _, iX}
      <div class="flex"
           style="color: white;
           aspect-ratio: 1;
           background-size: 100%;
           background-image: url({backgroundImageOf(iX, iY)});
           "
           style:width="{width}px"
           transition:elasticTransition|global
           ondragenter={(e) => onDragEnter(e, iX, iY)}
           ondragleave={(e) => onDragLeave(e, iX, iY)}
           ondragover={(e) => onDragOver(e, iX, iY)}
           ondrop={(e) => onDrop(e, iX, iY)}
           role="none"
      >
        {#if (fields[iY][iX])}
          <div
            class="flex grow bg-stone-500 m-0.5"
            style="border-radius: 15%; background-color: {fields[iY][iX]}; box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray"
          ></div>
        {/if}
      </div>
    {/each}
  </div>
  {/each}
</div>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount} from "svelte";
  import elasticTransition from "$lib/transitions/elasticTransition";
  import store from "$lib/store.svelte";
  import Position from "$lib/components/Position";
  import Piece from "$lib/game/piece/Piece";

  type FieldType = string|null;

  let { boardWidth, boardHeight } = $props();

  // @todo these shall go into some game state ("save") management
  const sX = 6, sY = 6;
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

  $effect(() => {
    store.mergeBoardCellWidth = width;
  })

  onMount(() => {
    fields = Array.from(
      {length: sizeX},
      () => Array.from({length: sizeY}, emptyField)
    );
  })

  function backgroundImageOf(atX: number, atY: number): string {
    return `grid/${String.fromCharCode(atY%6 + 65)}${atX%6+1}.png`;
  }

  function emptyField(): FieldType {
    return null;
  }

  function coloredField(color: string): FieldType {
    return color;
  }

  function fitsOnBoard(piece: Piece, position: Position): boolean {
    return (position.atX >= 0) && ((position.atX + piece.sizeX()) <= sizeX) &&
           (position.atY >= 0) && ((position.atY + piece.sizeY()) <= sizeY);
  }

  function onDragEnter(e: DragEvent, atX: number, atY: number) {
    // doesn't seem to do anything
    // e.dataTransfer.dropEffect = "move";
    // @todo make "dropMark" here
    // pieceAt = new Position(atX, atY);
  }
  function onDragLeave(e: DragEvent, atX: number, atY: number) {
    if (pieceAt?.equals(atX, atY)) {
      pieceAt = null;
    }
    // @todo we can shall "dropMark" here too?
  }
  function onDragOver(e: DragEvent, atX: number, atY: number) {
    // important: calling preventDefault enables dropping here at all
    e.preventDefault();
    // using the conditional it is measurably faster, eg. 0.01 vs 0.03
    if (!pieceAt?.equals(atX, atY)) {
      pieceAt = new Position(atX, atY);
    }
  }
  function onDrop(e: DragEvent, droppedAtX: number, droppedAtY: number) {
    const piece = Piece.fromJSON(e.dataTransfer?.getData("piece")||'');
    let piecePosition = new Position(droppedAtX, droppedAtY);
    const dragAt = Position.fromJSON(e.dataTransfer?.getData("dragAt")||'');
    if (dragAt) {
      piecePosition = piecePosition.sub(dragAt);
    }
    if (!fitsOnBoard(piece, piecePosition)) {
      return;
    }
    putOnBoard(piece, piecePosition);
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
