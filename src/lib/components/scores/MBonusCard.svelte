<div class="panel-border flex bonus-container"
     title="Bonus multiplier! All scores are multiplied" >
    <div class="bonus-value">
        <span class="multiplier-x golden-dark-text">×</span>
        <span class="multiplier-number golden-text golden-text-shadow">{showValue}</span>
    </div>
</div>

<script lang="ts">
  import playStore from "$lib/playStore.svelte";

  let showValue = $derived(playStore.bonusMultiplier > 10 ? Math.floor(playStore.bonusMultiplier).toString() : playStore.bonusMultiplier.toFixed(1));
</script>

<style>
  .bonus-container {
    position: relative;
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
    padding: 0.5vw 1vw;
    z-index: 2;
  }

  .multiplier-x {
    font-size: 1.5vw;
    margin-right: 0.25vw;
    opacity: 0.8;
  }

  .multiplier-number {
    font-size: 2.5vw;
    letter-spacing: 0.05em;
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