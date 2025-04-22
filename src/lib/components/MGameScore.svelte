<!-- I can't use classes on components, but I can use styles :/ -->
<div class="score-card panel-border panel-padding-small">
  <div class="h1">
    SC0RΞ
  </div>
  <div class="score-box">
    <div id="game-score" class="score" style="transform: scale({scaleSpring.current});">
      {formattedScore}
    </div>
  </div>
</div>


<script lang="ts">

  import playStore from "$lib/playStore.svelte.js";
  import {uiBus} from "$lib/util/uiBus";
  import { onMount, onDestroy } from "svelte";
  import { Spring, Tween, } from "svelte/motion";
  import { expoOut } from "svelte/easing";
  import type Group from "$lib/game/Group.svelte";
  import {flyTo} from "$lib/util/flyTo";
  import {EStitchLevel, type Stitch} from "$lib/game/stitches";

  // these together (and with addScore) make a nice "pop" when score is increased
  // let scaleSpring = new Spring(1, { stiffness: 0.8, damping: 1 });
  let scaleSpring = new Spring(1, { stiffness: 0.3, damping: 0.25 });
  let score = Tween.of(() => playStore.score, {duration: 300, easing: expoOut});
  let formattedScore = $derived(Math.floor(score.current).toLocaleString());

  const stitchLevelMultipliers: Record<EStitchLevel, number> = {
    [EStitchLevel.normal]: 1,
    [EStitchLevel.matchingColors]: Math.sqrt(2),
    [EStitchLevel.matchingColorsOverlap]: Math.sqrt(5),
  };

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

  function addScore(score: number): number {
    // here we can apply bonuses later
    const scoreToAdd = score;
    playStore.score += scoreToAdd;
    scaleSpring.set(1.25);
    setTimeout(() => scaleSpring.set(1), 150);
    return scoreToAdd;
  }

  function flyToScore(flyId: string, onTransitionEnd: () => void = () => {}) {
    flyTo(flyId, 'game-score', onTransitionEnd);
  }

  function onGroupExpired({group, htmlId}: { group: Group, htmlId: string}) {
    flyToScore(htmlId, () => {
      const score = addScore(group.score);
      uiBus.emit("groupExpiredScore", { group, score });
    });
  }

  function onStitchExpired({stitch, htmlId}: { stitch: Stitch, htmlId: string}) {
    // using sqrt will keep the earned points more linear (as the event is
    //  emitted as many times as many stitches)
    flyToScore(htmlId, () => {
      // const baseScore = Math.sqrt(stitch.cnt||0)
      // let's be a bit more generous, stitches higher than 4 are really rare
      const baseScore = Math.pow(stitch.cnt||0, 2/3) * stitchLevelMultipliers[stitch.level];
      const score = addScore(baseScore);
      uiBus.emit("stitchScore", { stitch, baseScore, score });
    });
  }

</script>
<style lang="postcss">
  @keyframes pop {
      0% { transform: scale(1); }
      10% { transform: scale(1.3); }
      100% { transform: scale(1); }
  }

  .score-card {
      /*background-color: #0a0a0a;*/
      color: orange;
      /*display: flex;*/
      justify-content: center;
      align-items: center;
      flex-direction: column;
  }

  .h1 {
      /*font-size: 2.5rem;*/
      font-size: 2vw;
      font-weight: bold;
      line-height: 1.6vw;
      /*margin-bottom: 1rem;*/
      margin-bottom: 1vw;
      text-shadow: 0 0 20px #ff9900;
      color: orange;
      justify-self: center;
  }

  .score-box {
      /*width: 100%;*/
      border: 3px solid #333;
      padding: 0.3vw 0.3vw;
      border-radius: 10px;
      background-color: #111;
      box-shadow: 0 0 10px #111;
      margin-bottom: 0.1vw;
  }

  .score {
      /*font-size: 2rem;*/
      font-size: 1.66vw;
      color: red;
      text-shadow: 0 0 10px red;
      justify-self: end;
  }

</style>
