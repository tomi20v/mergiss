<div class="flex flex-grow flex-col gap-0.5"
     style="cursor: grab; transform: scale({isDragging ? scale : 1});"
     style:max-width="{maxWidth}"
     style:opacity="{isDragging ? 0 : 1}"
     draggable={true}
     ondragstart={onDragStart}
     ondragend={onDragEnd}
     role="none"
>
    {#each piece.pixelMap as eachRow}
        <div class="flex grow flex-row gap-0.5">
            <!-- we need these shims so things don't "jump around" when piece width changes between 2 and 4 - otherwise
                the gapping make these cases uneven and things start jumping around
                HOWEVER it still jumps between empty and having a piece which might happen when dragging later?
                -->
            {#if (piece.sizeX()<1)}
                <div class="flex w-0"></div>
            {/if}
            {#if (piece.sizeX()<2)}
                <div class="flex w-0"></div>
            {/if}
            {#if (piece.sizeX()<3)}
                <div class="flex w-0"></div>
            {/if}
            {#if (piece.sizeX()<4)}
                <div class="flex w-0"></div>
            {/if}
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
  import Position from "$lib/components/Position";

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
      default:
        // DragAtOptions.topLeft
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
      default:
        // DragAtOptions.topLeft
        return 0;
    }
  })

  let isDragging = $state(false);
  let scale = 1.2;

  function onDragEnd() {
    isDragging = false;
  }

  function onDragStart(event: DragEvent) {

    isDragging = true;

    // Ensure the target is an HTMLElement
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    target.style.opacity = '0';

    // Create a custom drag image
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.left = '-9999px';
    dragImage.style.opacity = '1'; // Ensure the drag image is visible
    dragImage.style.zIndex = '9999'; // Ensure the drag image is visible
    // dragImage.style.width = store.mergeBoardCellWidth + 'px'; // Ensure the drag image is visible
    // Ensure the drag image is same size as the board. Due to relative gaps we set the size of the whole
    const draggedWidth = store.mergeBoardCellWidth * piece.sizeX();
    dragImage.style.width = draggedWidth + 'px';

    event.dataTransfer?.setDragImage(
      dragImage,
      (dragAtX + 0.5) * store.mergeBoardCellWidth,
      (dragAtY + 0.5) * store.mergeBoardCellWidth
    );
    // this doesn't seem to work but triggers possibly null error
    // event.dataTransfer.effectAllowed = "all";

    event.dataTransfer?.setData("dragAt", JSON.stringify(new Position(dragAtX, dragAtY)));
    event.dataTransfer?.setData("piece", JSON.stringify(piece));
    event.dataTransfer?.setData("source", "???");

    document.body.appendChild(dragImage);

    // Clean up the custom drag image after setting it for drag
    setTimeout(() => {
      document.body.removeChild(dragImage);
    });

  }

</script>
