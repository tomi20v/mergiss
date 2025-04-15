<svelte:window
        onwheel={onWheel}
        onmousemove={onMouseMove}
        onmouseup={onMouseUp}
        onmousedown={onMouseDown}
        onkeydown={onkeydown}
/>
<div class="flex flex-grow flex-col"
     style="row-gap: 2px; cursor: grab; transform: scale({dragging ? 1.2 : 1}); pointer-events: inherit;"
     style:max-width="{maxWidth}"
     style:opacity="{dragging ? 0 : 1}"
     draggable={false}
     onmousedown={dragStart}
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

  import playStore from "$lib/playStore.svelte.js";
  import PieceType from "$lib/game/piece/Piece";
  import {uiBus} from "$lib/util/uiBus";
  import Position from "$lib/game/geometry/Position";
  import {blur} from "svelte/transition";
  import {bounceOut} from "svelte/easing";
  import MouseButtons from "$lib/MouseButtons";

  const DragAtOptions = {
    topLeft: 0,
    bottomRight: 1,
    bottomMiddle: 2,
  }

  // for mobile, bottom right would work better, at least for right handed ppl. For others, bottom left. For screens
  //    top left seems better to minimize mouse travel :D But top center would even be better. Anyway make this a setting
  // const DragAtSetting = DragAtOptions.bottomRight;
  const DragAtSetting = DragAtOptions.bottomMiddle;
  // const DragAtSetting = DragAtOptions.topLeft;

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
  let cellStyle = $derived<string>('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 3px white, 1px 1px 3px dimgray');

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
        for (i=0; i<row.length; i++) {
          if (row[i]) {
            break;
          }
        }
        return i;
      case DragAtOptions.bottomMiddle:
      default:
        for (i=Math.floor(row.length/2); i<row.length; i++) {
          if (row[i]) {
            break;
          }
        }
        return Math.min(i, row.length);
    }
  })
  let dragAtY: number = $derived.by<number>(() => {
    const pixelMap = piece.pixelMap;
    switch (DragAtSetting) {
      case DragAtOptions.bottomRight:
      case DragAtOptions.bottomMiddle:
        return pixelMap.length - 1;
      case DragAtOptions.topLeft:
      default:
        return 0;
    }
  })
  let dragButton = $state(MouseButtons.NOBUTTON);
  let dragging = $derived(dragButton !== MouseButtons.NOBUTTON);
  let dragImage!: HTMLElement;
  let dragRotation = $state(0);
  let dragStartTime = 0;
  let rotationCount = 0;

  function dragDrop() {
    // this eliminates flickering between mouseup and removing the piece (if it is to be removed)
    setTimeout(() => dragButton = MouseButtons.NOBUTTON, 1);
    document.body.removeChild(dragImage);
    // putting in a setTimeout results in better sequence: mouseUp here, enter on other (board cell), onPieceDrop on other (board)
    setTimeout(() => uiBus.emit('pieceDrop', {
      piece,
      dragAt: new Position(dragAtX, dragAtY, dragRotation),
      dragTime: Date.now()/1000 - dragStartTime,
      rotationCount,
    }));
  }

  // specific mouse down on piece itself (fires before generic onMouseDown)
  function dragStart(event: MouseEvent) {

    dragButton = event.button;
    dragRotation = 0;
    rotationCount = 0;
    dragStartTime = Date.now()/1000;

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
    // dragImage.style.opacity = '1'; // Ensure the drag image is visible
    dragImage.style.opacity = '0.9'; // Ensure the drag image is visible
    dragImage.style.zIndex = '9999'; // Ensure the drag image is visible
    // dragImage.style.width = store.mergeBoardCellWidth + 'px'; // Ensure the drag image is visible
    // Ensure the drag image is same size as the board. Due to relative gaps we set the size of the whole
    const draggedWidth = playStore.mergeBoardCellWidth * piece.sizeX();
    dragImage.style.width = draggedWidth + 'px';
    dragImage.style.transformOrigin = ((dragAtX + 0.5) * playStore.mergeBoardCellWidth) + 'px ' + ((dragAtY + 0.5) * playStore.mergeBoardCellWidth) + 'px';
    dragImage.style.transition = "transform .3s cubic-bezier(0.64, 0.57, 0.67, 1.53)";

    document.body.appendChild(dragImage);

  }

  function onkeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'r':
        rotate(true);
        break;
      case 'R':
        rotate(false);
        break;
    }
  }

  // generic mouse down handler
  function onMouseDown(event: MouseEvent) {
    // while dragging, any button left to the dragging button should rotate CCW, and any button to the right rotate CW
    // plus, shift changes rotate direction
    // - when dragging with LMB then MMB and RMB rotate CW (right)
    // - when dragging with RMB then LMB and MMB  rotate CCW (left)
    // - when dragging with MMB then LMB rotates CCW and RMB rotates CW
    if (dragging && (event.button !== dragButton)) {
      rotate(event.shiftKey !== (event.button > dragButton));
    }
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging || !dragImage) {
      return;
    }
    // @todo don't use mergeboardcellwidth here
    dragImage.style.left = (event.clientX - (dragAtX + 0.5) * playStore.mergeBoardCellWidth ) + 'px';
    dragImage.style.top = (event.clientY - (dragAtY + 0.5) * playStore.mergeBoardCellWidth ) + 'px';
    // console.log('mouseMove', event.clientX, event.clientY, dragAtX, dragAtY, store.mergeBoardCellWidth);
  }

  function onMouseUp(_: MouseEvent) {
    if (dragging && _.button === dragButton) {
      dragDrop();
    }
  }

  function onWheel(event: WheelEvent) {
    if (dragging) {
      rotate(event.shiftKey !== (event.deltaY > 0));
    }
  }

  function rotate(clockwise: boolean) {
    if (dragging) {
      dragRotation += clockwise ? 90 : -90;
      dragImage.style.transform = `rotate(${dragRotation}deg)`;
      rotationCount++;
    }
  }

</script>
