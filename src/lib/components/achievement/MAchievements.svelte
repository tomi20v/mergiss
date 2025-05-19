<MAchievementsDialog {entropy} />
<AchievementPopup />
<button onclick={onDev}>DEV</button>
<script lang="ts">

  import {onMount} from "svelte";
  import MAchievementsDialog from "$lib/components/achievement/MAchievementsDialog.svelte";
  import entropy from "$lib/game/entropy";
  import {uiBus} from "$lib/util/uiBus";
  import AchievementPopup from "$lib/components/achievement/AchievementPopup.svelte";

  // const achievements = _a;

  onMount(() => {
    console.log('HU', entropy);
    // console.log('HU', achievements);
  })

  function onDev() {
    uiBus.emit('achieved', entropy[3].achievements[0]);
  }

</script>

