<Button>
  <Icon class="material-icons" style="transform: scale(1.3);">{icons.score}</Icon>
  <Label>{playStore.score.toLocaleString()}</Label>
</Button>

<script lang="ts">

  import Button, { Label, Icon } from '@smui/button';
  import icons from "$lib/icons";
  import playStore from "$lib/playStore.svelte.js";
  import {uiBus} from "$lib/util/uiBus";

  if (import.meta.env.MODE === 'development') {
    // this if removes the code from production builds
    uiBus.on("dev.points", (points: number) => {
      playStore.score += points;
    })
  }

</script>
