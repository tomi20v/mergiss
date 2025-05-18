<!-- Activator -->
{#if activator}
  <section onclick={onOpen} role="none">
    {@render activator?.()}
  </section>
{/if}

<!-- Template -->
<div class="dialog-overlay" class:visible={open} onclick={onClose} role="none">
  <div class="dialog-container golden-border" onclick={event => event.stopPropagation()} role="none">
    <div class="dialog-content golden-shadow-border bg-black golden-border golden-text rounded-md shadow-lg p-4">

      {#if title || subTitle}
        <div class="dialog-header golden-dark-border">
          {#if title}
            <h2 class="ffont-bold font-noto uppercase text-4xl text-left mt-0">{title}</h2>
          {/if}
          {#if subTitle}
            <h3 class="font-noto uppercase text-lg text-gray-400 text-left">{subTitle}</h3>
          {/if}
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
        <button class="close-button" onclick={onClose}>OK</button>
      {/if}

    </div>
  </div>
</div>

<!-- Script -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    subTitle?: string;
    title?: string;
    activator?: Snippet;
    children?: Snippet;
    footer?: Snippet;
  }

  let { open = $bindable(), subTitle = "", title = "", activator, children, footer }: Props = $props();

  function onOpen() {
    open = true;
  }

  function onClose() {
    open = false;
  }

  // Close on Escape key press
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      onClose();
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
            box-shadow: 0 0 32px 6px rgba(255, 208, 48, 0.6);
        }
        10%, 90% {
            box-shadow: 0 0 42px 8px rgba(255, 208, 48, 0.67);
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
        max-width: 80%;
        width: max-content;
        min-width: 40%;
        max-height: 80vh;
        overflow-y: auto;
        font-family: Orbitron, sans-serif;
        background: linear-gradient(to bottom right, #282111, #181014);
        border-width: 4px;
        border-radius: max(2vh, 1vw, 12px);
        box-shadow: 0 0 42px 8px rgba(255, 208, 48, 0.67), 0 25px 50px -12px rgba(0, 0, 0, 0.9);
        animation: glowBorder 2.2s ease-in-out infinite;
    }

    .dialog-content {
        /*border-radius: 1.5vh;*/
        border-radius: calc(max(2vh, 1vw, 12px) - 4px);
        pointer-events: none;
        border-width: 4px;
    }

    .dialog-header {
        margin-bottom: 1vh;
        padding-bottom: 1vh;
        border-width: 0 0 1px 0;
    }
    .dialog-header h2 {
        font-weight: bold;
        font-size: 4vw;
        margin-top: 0.5vh;
        margin-bottom: 0.5vh;
    }
    .dialog-header h3 {
        margin-top: 0.5vh;
        margin-bottom: 0;
    }

    .dialog-body {
        margin-bottom: 1vh;
        padding-bottom: 1vh;
        border-bottom: 1px solid;
        /*border-color: var(--game-gold, #FFD030);*/
        border-color: orange;
    }

    /* Prevent scrolling on body when dialog is open */
    :global(body:has(.dialog-overlay.visible)) {
        overflow: hidden;
    }

    .close-button {
        background: linear-gradient(to bottom right, #FFD030, #FFCC30, #FFCC30);
        color: black;
        border-radius: 0.375rem;
        padding: 0.75rem 1.75rem;
        font-size: 0.75rem;
        font-weight: bold;
        letter-spacing: 0.09em;
        box-shadow:
                0 1px 12px rgba(255, 208, 48, 0.53),
                0 0 4px rgba(255, 230, 150, 0.73);
        border: 2px solid rgba(255, 208, 48, 0.9);
        cursor: pointer;
        transition: all 0.2s;
    }

    .close-button:hover {
        filter: brightness(1.1);
    }
</style>