<svelte:window onresize={onResized} />
<!-- I can't use classes on components, but I can use styles :/ -->
{#if showFullVariant}
  <div class="score-card panel-border panel-padding-small" in:fade={{duration: 200}} out:fade={{duration: 200}}>
  <div class="h1">
      {leetize("score")}
    </div>
    <div class="score-box">
      <div id="game-score" class="score" style="transform: scale({scaleSpring.current});">
        {formattedScore}
      </div>
    </div>
  </div>
{:else if showMiniVariant}
  <div class="score-card panel-border panel-padding-small" in:fade={{duration: 200}} out:fade={{duration: 200}}>
    <div id="game-score" class="score" style="transform: scale({scaleSpring.current});">
      {formattedScore}
    </div>
  </div>
{/if}

<script lang="ts">

  import playStore from "$lib/playStore.svelte.js";
  import {uiBus} from "$lib/util/uiBus";
  import { onMount, onDestroy } from "svelte";
  import { Spring, Tween, } from "svelte/motion";
  import { expoOut } from "svelte/easing";
  import {fade} from "svelte/transition";
  import type Group from "$lib/game/Group.svelte";
  import {flyTo} from "html-trajectory";
  import {EStitchLevel, type Stitch} from "$lib/game/stitches";
  import {leetize} from "../../util/texts";

  // these together (and with addScore) make a nice "pop" when score is increased
  // let scaleSpring = new Spring(1, { stiffness: 0.8, damping: 1 });
  let scaleSpring = new Spring(1, { stiffness: 0.3, damping: 0.25 });
  let score = Tween.of(() => playStore.score, {duration: 300, easing: expoOut});
  let formattedScore = $derived(Math.floor(score.current).toLocaleString());

  // Separate state variables for variant control
  let showFullVariant = $state(true);
  let showMiniVariant = $state(false);

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
    uiBus.on("groupExpired", onGroupExpired);
    uiBus.on("stitchExpired", onStitchExpired);
    setInterval(onResized, 1000);
    
    // Initialize the variant state based on current window size
    onResized();
  })

  onDestroy(() => {
    uiBus.off("groupExpired");
    uiBus.off("stitchExpired");
  })

  function addScore(score: number, bonusMultiplier?: number): number {
    // here we can apply bonuses later
    // const scoreToAdd = score;
    const realMultiplier = bonusMultiplier || playStore.bonusMultiplier;
    const scoreToAdd = score * realMultiplier;
    playStore.score += scoreToAdd;
    scaleSpring.set(1.25);
    setTimeout(() => scaleSpring.set(1), 150);
    return scoreToAdd;
  }

  function flyToScore(flyId: string, onTransitionEnd: () => void = () => {}) {
    const element = document.getElementById(flyId);
    if (!element || !flyId) {
      // If there's no HTML ID or it's not valid, just execute the callback
      onTransitionEnd();
      // setTimeout(onTransitionEnd, 1);
    } else {
      // Otherwise, call flyTo as before
      flyTo(flyId, 'game-score', {onTransitionEnd, removeOriginal: false});
    }
  }

  function onGroupExpired(event: {
      group: Group,
      htmlId: string,
      origin: string,
      bonusMultiplier: number,
    }) {
    // @todo? score could be increased when one color is dominant. and/or colors can have different
    //  scores which don't increase linearly
    flyToScore(event.htmlId, () => {
      const rocketMultiplier = origin == 'rocketLaunch' ? playStore.rocketMultiplier : 1;
      const score = addScore(event.group.score * rocketMultiplier, event.bonusMultiplier);
      uiBus.emit("groupExpiredScore", {
        group: event.group,
        score,
        origin: event.origin,
        bonusMultiplier: event.bonusMultiplier,
      });
      if (origin == 'rocketLaunch') {
        uiBus.emit("resetBonusBar");
      }
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

  function onResized() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const smallerDimension = Math.min(width, height);
    
    // Update both variant variables based on screen size
    if (smallerDimension > 700) {
      showMiniVariant = false;
      setTimeout(() => showFullVariant = true, 201);
    } else {
      showFullVariant = false;
      setTimeout(() => showMiniVariant = true, 201);
    }
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
      text-transform: uppercase;
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
