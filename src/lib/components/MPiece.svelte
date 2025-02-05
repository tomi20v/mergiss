<svelte:window
        onwheel={onWheel}
        onmousemove={onMouseMove}
        onmouseup={onMouseUp}
/>
<div class="flex flex-grow flex-col"
     style="row-gap: 2px; cursor: grab; transform: scale({dragging ? 1.2 : 1});"
     style:max-width="{maxWidth}"
     style:opacity="{dragging ? 0 : 1}"
     draggable={false}
     onmousedown={onMouseDown}
     role="none"
     in:blur={{delay: 1, duration: 500, easing: bounceOut}}
>
    {#each piece.pixelMap as eachRow}
        <div class="flex grow flex-row" style="column-gap: 2px;">
            {#each eachRow as eachCell}
            <div class="flex aspect-square grow piece-cell {eachCell ? 'piece-cell-full' : 'piece-cell-empty'}"
                 style="border-radius: 15%; {eachCell ? cellStyle : ''}"
            >
            </div>
            {/each}
        </div>
    {/each}
</div>
<script lang="ts">

  import store from "$lib/store.svelte";
  import PieceType from "$lib/game/piece/Piece";
  import {uiBus} from "$lib/util";
  import Position from "$lib/components/Position";
  import {blur} from "svelte/transition";
  import {bounceOut} from "svelte/easing";

  const DragAtOptions = {
    topLeft: 0,
    bottomRight: 1,
  }

  // for mobile, bottom right would work better, at least for right handed ppl. For others, bottom left. For screens
  //    top left seems better to minimize mouse travel :D But top center would even be better. Anyway make this a setting
  // const DragAtSetting = DragAtOptions.bottomRight;
  const DragAtSetting = DragAtOptions.topLeft;

  let {
    piece
  }: {
    piece: PieceType
  } = $props();
  let maxWidth = $derived.by<string|null>(() => {
    if ((piece.sizeY() >2) || (piece.sizeX() <= 2)) {
      return "66%";
    }
    return null;
  });
  // some old formulas
  // let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 2px, 1px 1px 1px dimgray');
  // let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 2px ' + piece.shadowColor + ', 1px 1px 1px dimgray');
  let cellStyle = $derived<string>('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray');

  let dragAtX: number = $derived.by<number>(() => {
    const row = piece.pixelMap[dragAtY];
    let i = 0;
    switch (DragAtSetting) {
      case DragAtOptions.bottomRight:
        for (i=row.length-1; i>0; i--) {
          if (row[i]) {
            break;
          }
        }
        return i;
      case DragAtOptions.topLeft:
      default:
        for (i=0; i<row.length; i++) {
          if (row[i]) {
            break;
          }
        }
        return i;
    }
  })
  let dragAtY: number = $derived.by<number>(() => {
    const pixelMap = piece.pixelMap;
    switch (DragAtSetting) {
      case DragAtOptions.bottomRight:
        return pixelMap.length - 1;
      case DragAtOptions.topLeft:
      default:
        return 0;
    }
  })
  let dragging = $state(false);
  let dragImage!: HTMLElement;
  let dragRotation = $state(0);

  function onMouseDown(event: MouseEvent) {

    if (dragging) {
      return;
    }

    dragging = true;
    dragRotation = 0;

    // Ensure the target is an HTMLElement
    const target = event.currentTarget as HTMLElement;
    if (!target) {
      return;
    }

    // Create a custom drag image
    dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.left = '0';
    // dragImage.style.top = '200px';
    // dragImage.style.left = '100px';
    dragImage.style.opacity = '1'; // Ensure the drag image is visible
    dragImage.style.zIndex = '9999'; // Ensure the drag image is visible
    // dragImage.style.width = store.mergeBoardCellWidth + 'px'; // Ensure the drag image is visible
    // Ensure the drag image is same size as the board. Due to relative gaps we set the size of the whole
    const draggedWidth = store.mergeBoardCellWidth * piece.sizeX();
    dragImage.style.width = draggedWidth + 'px';

    document.body.appendChild(dragImage);

  }

  function onMouseUp(_: MouseEvent) {
    if (!dragging) {
      return;
    }
    dragging = false;
    document.body.removeChild(dragImage);
    // putting in a setTimeout results in better sequence: mouseUp here, enter on other (board cell), onPieceDrop on other (board)
    setTimeout(() => uiBus.emit('pieceDrop', {piece, dragAt: new Position(dragAtX, dragAtY)}));
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging || !dragImage) {
      return;
    }
    dragImage.style.left = (event.clientX - (dragAtX + 0.5) * store.mergeBoardCellWidth ) + 'px';
    dragImage.style.top = (event.clientY - (dragAtY + 0.5) * store.mergeBoardCellWidth ) + 'px';
    // console.log('mouseMove', event.clientX, event.clientY, dragAtX, dragAtY, store.mergeBoardCellWidth);
  }

  function onWheel(event: WheelEvent) {
    console.log('onWheel');
    if (!dragging) {
      return;
    }
    // event.preventDefault();
    dragRotation += event.deltaY > 0 ? 90 : -90;
    dragImage.style.transform = `rotate(${dragRotation}deg)`;
  }

</script>
