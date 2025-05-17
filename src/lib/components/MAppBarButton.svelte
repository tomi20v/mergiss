<button class="app-bar-button material-symbols-rounded"
        onclick={onclick}
        tabindex="-1"
>{icon}</button>

<script lang="ts">
  let {icon, onclick = () => null}: {icon: string, onclick?: () => void} = $props();
</script>

<style>
    .app-bar-button {
        border: 1px solid transparent;
        border-radius: 10px;
        padding: 6px;
        position: relative;
        background-color: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.2s ease;
        color: orange;
        box-sizing: border-box;
        width: clamp(32px, 5vw, 64px);  /* Max size at 1280px viewport */
        height: clamp(20px, 3vw, 38px); /* Max size at 1280px viewport */
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .app-bar-button:hover {
        transform: scale(1.1);
        border-color: orange;
        box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.5), 0 0 10px rgba(255, 165, 0, 0.3);
    }
    .app-bar-button:active {
        transform: scale(0.95);
        border-color: rgb(255, 100, 0);
        box-shadow: inset 0 0 8px rgba(255, 165, 0, 0.5);
        background-color: rgba(255, 165, 0, 0.1);
    }
    .app-bar-button::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 8px;
        pointer-events: none;
        background: radial-gradient(circle, transparent 1%, rgba(0, 0, 0, 0) 1%) center/15000%;
        transition: background 0.5s;
    }
    .app-bar-button:active::after {
        background-color: rgba(255, 165, 0, 0.2);
        background-size: 100%;
        transition: background 0s;
    }
</style>

