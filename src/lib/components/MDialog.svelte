<!-- Activator -->
{#if activator}
  <section onclick={onOpenDialog} role="none">
    {@render activator?.()}
  </section>
{/if}

<!-- Template -->
<div class="dialog-overlay" class:visible={open} onclick={event => handleBackdropClick(event)} role="none">
  <div class="dialog-container" role="dialog" aria-modal="true">
    <div class="dialog-content bg-black border border-game-gold text-game-gold rounded-md shadow-lg p-4">

      {#if title}
        <div class="dialog-header">
          <h2 class="font-bold text-lg">{title}</h2>
        </div>
      {/if}

      <div class="dialog-body">
        {@render children?.()}
      </div>

      {#if footer}
      <div class="dialog-footer flex justify-end gap-2 mt-4">
        {@render footer?.()}
      </div>
      {:else}
        <button class="close-button">OK</button>
      {/if}

    </div>
  </div>
</div>

<!-- Script -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    onclose?: () => void;
    title?: string;
    activator?: Snippet;
    children?: Snippet;
    footer?: Snippet;
  }

  let { open = false, onclose, title = "", activator, children, footer }: Props = $props();

  function onOpenDialog() {
    open = true;
  }

  // Close on Escape key press
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open && onclose) {
      onclose();
    }
  }

  // Close when clicking outside the dialog
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget && onclose) {
      onclose();
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<!-- Style -->
<style>
    @keyframes glowBorder {
        0%, 100% {
            box-shadow: 0 0 32px 6px rgba(255, 224, 102, 0.6);
        }
        10%, 90% {
            box-shadow: 0 0 42px 8px rgba(255, 224, 102, 0.67);
        }
    }

    .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s linear 0.2s, opacity 0.2s ease-in-out;
    }

    .dialog-overlay.visible {
        visibility: visible;
        opacity: 1;
        transition-delay: 0s;
    }

    .dialog-container {
        position: relative;
        max-width: 90%;
        width: max-content;
        min-width: 400px;
        max-height: 90vh;
        overflow-y: auto;
        font-family: Orbitron, sans-serif;
        background: linear-gradient(to bottom right, #282111, #181014);
        border: 4px solid rgba(255, 224, 64, 0.8);
        border-radius: 1rem;
        box-shadow: 0 0 42px 8px rgba(255, 224, 102, 0.67), 0 25px 50px -12px rgba(0, 0, 0, 0.9);
        animation: glowBorder 2.2s ease-in-out infinite;
    }

    .dialog-content {
        /*font-family: 'Courier New', Courier, monospace;*/
        border-radius: 1rem;
        pointer-events: none;
        border: 4px solid rgba(255, 224, 64, 0.3);
    }

    .dialog-header {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid;
        border-color: var(--game-gold, #FFD700);
    }

    .dialog-body {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid;
        border-color: var(--game-gold, #FFD700);
    }

    /* Prevent scrolling on body when dialog is open */
    :global(body:has(.dialog-overlay.visible)) {
        overflow: hidden;
    }

    .close-button {
        background: linear-gradient(to bottom right, #ffeb33, #ffeb40, #ffeb40);
        color: black;
        border-radius: 0.375rem;
        padding: 0.75rem 1.75rem;
        font-size: 0.75rem;
        font-weight: bold;
        letter-spacing: 0.09em;
        box-shadow:
                0 1px 12px rgba(255, 224, 102, 0.53),
                0 0 4px rgba(255, 250, 194, 0.73);
        border: 2px solid rgba(255, 224, 51, 0.9);
        cursor: pointer;
        transition: all 0.2s;
    }

    .close-button:hover {
        filter: brightness(1.1);
    }
</style>