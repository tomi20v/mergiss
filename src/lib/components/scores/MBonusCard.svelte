<div class="panel-border flex bonus-container">
    <div class="bonus-value">
        <span class="multiplier-x golden-dark-text">×</span>
        <span class="multiplier-number golden-text golden-text-shadow">{showValue}</span>
    </div>
    <div class="bonus-glow"></div>
</div>

<script lang="ts">
  import playStore from "$lib/playStore.svelte";

  let showValue = $derived(playStore.bonusMultiplier > 10 ? Math.floor(playStore.bonusMultiplier).toString() : playStore.bonusMultiplier.toFixed(1));
</script>

<style>
  .bonus-container {
    position: relative;
    min-height: 5rem;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .bonus-value {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    padding: 0.5rem 1rem;
    z-index: 2;
    /*text-shadow: 0 0 15px #ffb700, 0 0 25px #ff9500;*/
    /*animation: pulse 2.5s infinite ease-in-out;*/
  }

  .multiplier-x {
    font-size: 1.5rem;
    /*color: #ffa726;*/
    margin-right: 0.25rem;
    opacity: 0.8;
  }

  .multiplier-number {
    font-size: 2.5rem;
    /*color: #ffd700;*/
    letter-spacing: 0.05em;
  }

  .bonus-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /*background: radial-gradient(circle at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%);*/
    opacity: 0.7;
    z-index: 1;
    /*animation: glow 3s infinite alternate ease-in-out;*/
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes glow {
    0% { opacity: 0.4; }
    100% { opacity: 0.8; }
  }
</style>