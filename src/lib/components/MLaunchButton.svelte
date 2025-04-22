<div class="rocket-button">
  <!-- NOTE adjusting the size of the actual icon by css seems not to work -->
  <Icon class="material-icons">rocket_launch</Icon>
</div>

<script lang="ts">
  import { Icon } from '@smui/button';
</script>

<style lang="postcss">
.rocket-button {
    position: relative;
    background-color: #c0392b;
    border: 4px solid #e74c3c;
    border-radius: 12px;
    box-shadow:
            inset 0 0 8px #a93226,
            0 4px 8px rgba(0, 0, 0, 0.6);
    color: white;
    /*padding: 16px 24px;*/
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    width: 100%;
    aspect-ratio: 16/9;
}

.rocket-button:hover {
    background-color: #e74c3c;
    box-shadow:
            inset 0 0 10px #922b21,
            0 6px 12px rgba(0, 0, 0, 0.7);
}

</style>