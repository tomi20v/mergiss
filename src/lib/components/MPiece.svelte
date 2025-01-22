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
            {#if (w<1)}
                <div class="flex w-0"></div>
            {/if}
            {#if (w<2)}
                <div class="flex w-0"></div>
            {/if}
            {#if (w<3)}
                <div class="flex w-0"></div>
            {/if}
            {#if (w<4)}
                <div class="flex w-0"></div>
            {/if}
            {#each eachRow as eachCell}
            <div class="flex aspect-square grow"
                 style="border-radius: 15%; {eachCell ? cellStyle : ''}">
            </div>
            {/each}
        </div>
    {/each}
</div>
<script lang="ts">

  let { piece } = $props();
  let w = $derived(piece.pixelMap[0].length);
  let maxWidth = $derived.by(() => {
    const h = piece.pixelMap.length;
    const w = piece.pixelMap[0].length;
    if ((h >2) || (w <= 2)) {
      return "66%";
    }
    return null;
  });
  // some old formulas
  // let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 2px, 1px 1px 1px dimgray');
  // let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 2px ' + piece.shadowColor + ', 1px 1px 1px dimgray');
  let cellStyle = $derived('background-color: ' + piece.color + '; box-shadow: inset 2px 2px 3px, 1px 1px 3px dimgray');

  let isDragging = $state(false);
  let scale = 1.2;

  function onDragEnd() {
    isDragging = false;
  }

  // const draggable: Action<
  //   HTMLElement,
  //   undefined,
  //   {}
  // > = (node) => {
  //
  // }

  function onDragStart(event: DragEvent) {
    isDragging = true;

// Ensure the target is an HTMLElement
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    target.style.opacity = '0';

    // Create a custom drag image
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '999px';
    dragImage.style.left = '99px';
    dragImage.style.opacity = '1'; // Ensure the drag image is visible
    dragImage.style.zIndex = '9999'; // Ensure the drag image is visible
    dragImage.style.minWidth = '299px'; // Ensure the drag image is visible
    console.log('DI', dragImage);
    document.body.appendChild(dragImage);

    // Set the custom drag image
    event.dataTransfer?.setDragImage(dragImage, 0, 0);

    // Clean up the custom drag image after the drag ends
    setTimeout(() => {
      document.body.removeChild(dragImage);
    });
  }

</script>
