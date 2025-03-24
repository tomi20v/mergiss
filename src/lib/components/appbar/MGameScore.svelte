<!-- I can't use classes on components, but I can use styles :/ -->
<Button id={htmlId}
        style="background: linear-gradient(135deg, #E27D5F, #C75C8F) !important;
               box-shadow: 0px 0px 6px 1px rgba(199, 92, 143, 0.4) !important;
               transform: scale({scale.current});
               ">
  <Icon class="material-icons" style="transform: scale(1.3);">{icons.score}</Icon>
  <Label style="transform: scale({scale.current});">{scoreFormatted}</Label>
</Button>

<script lang="ts">

  import Button, { Label, Icon } from '@smui/button';
  import icons from "$lib/icons";
  import playStore from "$lib/playStore.svelte.js";
  import {uiBus} from "$lib/util/uiBus";
  import { onMount, onDestroy } from "svelte";
  import { Spring, Tween, } from "svelte/motion";
  import { expoOut } from "svelte/easing";
  import type Group from "$lib/game/Group";
  import type {PositionPair} from "$lib/game/geometry/positionPair";
  import {flyTo} from "$lib/util/flyTo";

  const htmlId = 'game-score';
  // these together (and with addScore) make a nice "pop" when score is increased
  let scale = new Spring(1, { stiffness: 0.8, damping: 1 });
  let score = Tween.of(() => playStore.score, {duration: 300, easing: expoOut});
  let scoreFormatted = $derived(Math.floor(score.current).toLocaleString());

  // DEV code only
  if (import.meta.env.MODE === 'development') {
    // this surrounding "if" removes the code from production builds
    uiBus.on("dev.score", (score: number) => addScore(score))
  }

  onMount(() => {
    uiBus.on("groupExpired", onGroupExpired)
    uiBus.on("stitchExpired", onStitchExpired)
  })

  onDestroy(() => {
    uiBus.off("groupExpired");
    uiBus.off("stitchExpired");
  })

  function addScore(score: number) {
    playStore.score += score;
    scale.set(1.18);
    setTimeout(() => scale.set(1), 150);
  }

  function flyToScore(flyId: string, onTransitionEnd: () => void = () => {}) {
    flyTo(flyId, 'game-score', onTransitionEnd);
  }

  function onGroupExpired({group, htmlId}: { group: Group, htmlId: string}) {
    flyToScore(htmlId, () => addScore(group.weight));
  }

  function onStitchExpired({stitch, htmlId}: { stitch: PositionPair, htmlId: string}) {
    // using sqrt will keep the earned points more linear (as the event is
    //  emitted as many times as many stitches)
    flyToScore(htmlId, () => addScore(
      // Math.sqrt(stitch.cnt||0)
      // let's be a bit more generous, stitches higher than 4 are really rare
      Math.pow(stitch.cnt||0, 2/3)
    ));
  }

</script>
<style>
  @keyframes pop {
      0% { transform: scale(1); }
      10% { transform: scale(1.3); }
      100% { transform: scale(1); }
  }
</style>
