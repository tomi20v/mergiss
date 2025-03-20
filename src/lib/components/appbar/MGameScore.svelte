<Button style="background: linear-gradient(135deg, #E27D5F, #C75C8F) !important;
               box-shadow: 0px 0px 6px 1px rgba(199, 92, 143, 0.4) !important;">
  <Icon class="material-icons" style="transform: scale(1.3);">{icons.score}</Icon>
  <Label>{playStore.score.toLocaleString()}</Label>
</Button>

<script lang="ts">

  import Button, { Label, Icon } from '@smui/button';
  import icons from "$lib/icons";
  import playStore from "$lib/playStore.svelte.js";
  import {uiBus} from "$lib/util/uiBus";

  if (import.meta.env.MODE === 'development') {
    // this surrounding "if" removes the code from production builds
    uiBus.on("dev.score", (points: number) => {
      playStore.score += points;
    })
  }

</script>
