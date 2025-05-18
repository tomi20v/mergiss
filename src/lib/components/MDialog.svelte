<!-- Activator -->
{#if activator}
  <section onclick={onOpen} role="none">
    {@render activator?.()}
  </section>
{/if}

<!-- Template -->
<div class="dialog-overlay" class:visible={open} onclick={onClose} role="none">
  <div class="dialog-container golden-border flex" onclick={event => event.stopPropagation()} role="none">
    <div class="dialog-content golden-shadow-border golden-border golden-text p-4">

      {#if title || subTitle}
        <div class="dialog-header golden-dark-border">
          <div class="dialog-title flex flex-row align-bottom">
          {#if icon}
            <h2 class="material-symbols-rounded self-center mr-2">{icon}</h2>
          {/if}
          {#if title}
            <h2 class="font-bold font-noto xuppercase text-left">
              {title}
            </h2>
          {/if}
          </div>
          {#if subTitle}
            <h3 class="font-noto uppercase text-gray-400 text-left">{subTitle}</h3>
          {/if}
        </div>
      {/if}

      <div class="dialog-body">
        {@render children?.()}
      </div>

      {#if footer === true}
        <button class="close-button" onclick={onClose}>OK</button>
      {:else if footer}
        <div class="dialog-footer golden-dark-border flex justify-end">
          {@render footer?.()}
        </div>
      {/if}

    </div>
  </div>
</div>

<!-- Script -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    icon?: string;
    subTitle?: string;
    title?: string;
    activator?: Snippet;
    children?: Snippet;
    footer?: Snippet|boolean;
  }

  let { open = $bindable(), icon, subTitle, title, activator, children, footer }: Props = $props();

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
        /*max-height: 80vh;*/
        /*overflow-y: auto;*/
        /*overflow-y: hidden;*/
        font-family: Orbitron, sans-serif;
        background: linear-gradient(to bottom right, #282111, #181014);
        border-width: 4px;
        border-radius: max(2vh, 1vw, 12px);
        box-shadow: 0 0 42px 8px rgba(255, 208, 48, 0.67), 0 25px 50px -12px rgba(0, 0, 0, 0.9);
        animation: glowBorder 2.2s ease-in-out infinite;
    }
    
    .dialog-content {
        padding: 0.5vh 2vh;
        padding-left:  max(2vh, 2vw);
        padding-right: max(2vh, 2vw);
        /*border-radius: 1.5vh;*/
        border-radius: calc(max(2vh, 1vw, 12px) - 4px);
        pointer-events: auto;
        border-width: 4px;
        display: flex;
        flex-direction: column;
        max-height: 65vh;
        height: 100%;
        width: 100%;
        background-color: #080808;
    }
    
    .dialog-header {
        margin-bottom: max(1vh, 1vw);
        padding-bottom: 1vh;
        border-width: 0 0 1px 0;
        flex-shrink: 0;
    }
    .dialog-header h2,
    :global(.dialog-footer h2) {
        font-weight: bold;
        font-size: min(4vw, 8vh);
        /*font-size: min(4vw, 4vw);*/
        /*margin-top: 1vh;*/
        margin-top: 0;
        padding-bottom: 0;
        /*margin-bottom: 1vh;*/
        margin-bottom: 0;
    }
    .dialog-header h2 {
        text-shadow: 0 0 20px #ff9900;
    }
    .dialog-header h3,
    :global(.dialog-footer h3) {
        margin-top: 0;
        padding-top: 0;
        margin-bottom: 0;
        font-size: min(2vw, 5vh);
        font-family: Noto Sans, sans-serif;
        color: rgb(156 163 175);
    }
    
    .dialog-body {
        margin-bottom: 0.5vh;
        padding-bottom: 1vh;
        /*border-bottom: 1px solid;*/
        /*border-color: var(--game-gold, #FFD030);*/
        border-color: orange;
        /*overflow-y: auto;*/
        flex-grow: 1;
        overflow-y: auto;
    }

    /* Prevent scrolling on body when dialog is open */
    :global(body:has(.dialog-overlay.visible)) {
        overflow: hidden;
    }

    .dialog-footer {
        border-width: 1px 0 0 0;
        border-style: solid;
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