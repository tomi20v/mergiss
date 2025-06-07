<button id="launch-button"
        class="rocket-button"
        style="transform: scale({currentScale});"
        onclick={onClick}
        class:pulsating={isRotating}
        tabindex="-1"
>
  <img
          id="rocket-icon"
          src="/rocket.svg"
          alt="Rocket"
          class="rocket-icon"
          class:rotating={isRotating}
          style="opacity: {opacity};"
  />
  {#if fill === 1}
    <span class="multiplier">{playStore.rocketMultiplier}x</span>
  {/if}
</button>
<!--{isRotating}-->

<script lang="ts">
  import { uiBus } from "$lib/util/uiBus";
  import { onDestroy, onMount } from "svelte";
  import type RocketLaunchData from "$lib/events/RocketLaunchData";
  import playStore from "$lib/playStore.svelte";

  // const increment = 0.05;
  const increment = 0.1;
  const scaleMinimum = 0.07;
  const overshootFactor = 3; // How much to overshoot (3x the increment)
  const scaleCompleteAt = 0.8; // Scale reaches 1 at this fill value
  const opacityStart = 0.2; // Opacity at scaleCompleteAt

  let fill = $state(0);
  let isLaunching = $state(false);
  let isRotating = $derived((fill == 1) && !isLaunching);
  let currentScale = $state(scaleMinimum);
  let targetScale = $state(scaleMinimum);
  let animationId: number | null = null;

  // Calculate opacity based on fill value
  let opacity = $derived.by<number>(() => {
    if (fill <= scaleCompleteAt) {
      // Opacity increases from 0 to opacityStart as fill goes from 0 to scaleCompleteAt
      return (fill / scaleCompleteAt) * opacityStart;
    } else {
      // Opacity increases from opacityStart to 1 as fill goes from scaleCompleteAt to 1
      const remainingFill = fill - scaleCompleteAt;
      const remainingOpacity = 1 - opacityStart;
      const ratio = remainingFill / (1 - scaleCompleteAt);
      return opacityStart + (ratio * remainingOpacity);
    }
  });

  onMount(() => {
    uiBus.on("launchButtonFill", onFill);
    uiBus.on("pieceDropped", onPieceDropped);
    uiBus.on("rocketLaunched", onRocketLaunched);
    uiBus.on("rocketLaunchFailed", onRocketLaunchFailed);
  });
  
  onDestroy(() => {
    uiBus.off("launchButtonFill", onFill);
    uiBus.off("pieceDropped", onPieceDropped);
    uiBus.off("rocketLaunched", onRocketLaunched);
    uiBus.off("rocketLaunchFailed", onRocketLaunchFailed);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });

  function onPieceDropped() {
    const oldFill = fill;
    // Increase fill by random value between 0-0.1, capped at 1
    const randomIncrease = Math.random() * increment;
    fill = Math.min(1, fill + randomIncrease);
    updateScale(fill, oldFill);
  }

  function onClick() {
    if (fill < 1) {
      const oldFill = fill;
      // fill = Math.min(1, fill + (fill < 0.7 ? 0.1 : 0.025));
      fill = Math.min(1, fill + 0.05);
      updateScale(fill, oldFill);
    }
    else {
      isLaunching = true;

      // setTimeout() is added so isRotating is updated (removed) before cloning
      setTimeout(() => {
        // Emit event to expire the biggest group
        uiBus.emit('rocketLaunch', {
          origin: 'launchButton',
          flyingId: 'rocket-icon',
          flyOptions: {
            // I could tweak this based on aspect/screen size?
            duration: 1.2,
            acceleration: 12,
            // duration: 6.1,
            // duration: 1.1,
            removeOriginal: false,
            scale: 0.3,
            // scale: 1,
          },
        } as RocketLaunchData);
      })
    }
  }

  function onFill() {
    fill = 0.99;
    updateScale(fill, fill);
  }

  function onRocketLaunched() {
    isLaunching = false;
    // Reset fill and rotation state after launch is complete
    const oldFill = fill;
    fill = 0;

    // Explicitly call updateScale to reset the scale
    updateScale(fill, oldFill);
  }

  function onRocketLaunchFailed() {
    isLaunching = false;
  }

  function triggerOvershootAnimation(increase: number): void {
    // Cancel any existing animation
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    // Calculate overshoot target (limited to a max scale of 1.2)
    const overshootTarget = Math.min(1.2, currentScale + (increase * overshootFactor));

    // Start animation timestamp
    let startTime: number | null = null;
    const duration = 600; // Animation duration in ms

    function animate(timestamp: number): void {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      // First 33% of animation - overshoot
      if (progress < 0.33) {
        const overshootProgress = progress / 0.33;
        currentScale = targetScale - increase + (overshootTarget - targetScale + increase) * overshootProgress;
      }
      // Last 67% of animation - bounce back
      else {
        const bounceProgress = (progress - 0.33) / 0.67;
        currentScale = overshootTarget - (overshootTarget - targetScale) * bounceProgress;
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        currentScale = targetScale;
        animationId = null;
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  function updateScale(newFill: number, oldFill: number): void {
    // Calculate the new target scale based on fill, reaching 1 at SCALE_COMPLETE_AT
    let newTargetScale;
    if (newFill <= scaleCompleteAt) {
      // Scale from scaleMinimum to 1 as fill goes from 0 to SCALE_COMPLETE_AT
      const scalingRange = 1 - scaleMinimum;
      const ratio = newFill / scaleCompleteAt;
      newTargetScale = scaleMinimum + (ratio * scalingRange);
    } else {
      // Keep scale at 1 after SCALE_COMPLETE_AT
      newTargetScale = 1;
    }

    // 1. Handle reset to 0 case (after activation)
    if (newFill === 0 && oldFill === 1) {
      targetScale = newTargetScale;
      currentScale = targetScale;
      // Note: isRotating is already set to false in onClick
    }
    // 2. Final Boost: Check if fill crosses the threshold >= 1
    else if (newFill >= 1 && oldFill < 1) {
      targetScale = 1; // Ensure target scale is exactly 1
      triggerOvershootAnimation(0.2); // Trigger final boost with fixed increment
    }
    // 3. Normal Increase: Handle increases below the threshold < 1
    else if (newFill < 1) {
      if (newTargetScale > targetScale) {
        // Normal increase phase (fill 0 to 0.8)
        const increase = newTargetScale - targetScale;
        targetScale = newTargetScale;
        triggerOvershootAnimation(increase);
      } else if (newFill > scaleCompleteAt) {
        // Special phase (fill 0.8 to < 1) - use actual fill increase for bounce
        const fillIncrease = newFill - oldFill;
        targetScale = 1; // Target scale remains 1
        triggerOvershootAnimation(fillIncrease);
      } else if (targetScale !== newTargetScale) {
        // Fill increased, but target scale didn't. Update silently.
        targetScale = newTargetScale;
        currentScale = targetScale;
      }
    }
  }
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
        cursor: pointer;
        transition: none; /* Remove transition to avoid conflicting with our animation */
        width: 100%;
        aspect-ratio: 16/9;
        /* Changed to relative positioning for absolute children */
        position: relative;
        /* Removed flex centering since we're using absolute positioning */
    }

    .rocket-button:hover {
        background-color: #e74c3c;
        box-shadow:
                inset 0 0 10px #922b21,
                0 6px 12px rgba(0, 0, 0, 0.7);
    }

    .rocket-icon {
        height: 60%; /* Slightly smaller to ensure it fits within the button */
        width: auto; /* Maintains aspect ratio */
        object-fit: contain; /* Ensures the image scales properly */
        filter: brightness(0) invert(1);
        /* Position rocket inside the button */
        position: absolute;
        left: 20%; /* Moved more to the right to ensure it's fully visible */
        top: 50%;
        transform: translate(50%, -50%);
        transform-origin: 80% 50%; /* Moved origin point closer to center of rocket to reduce rotation radius */
        transition: opacity 0.3s ease-in-out;
    }

    @keyframes spin {
        from {
            /* Keep the rocket positioned correctly while rotating with tighter radius */
            transform: translate(-45%, -50%) rotate(0deg);
        }
        to {
            /* Keep the rocket positioned correctly while rotating with tighter radius */
            transform: translate(-45%, -50%) rotate(360deg);
        }
    }

    .rocket-icon.rotating {
        animation: spin 2s linear infinite;
    }

    @keyframes pulse {
        0%, 100% {
            /* Use the final scale from JS as base */
            transform: scale(1);
        }
        50% {
            /* Pulse slightly larger */
            transform: scale(1.12);
        }
    }

    .rocket-button.pulsating {
        /* Apply the pulse animation ON TOP of the JS scale */
        /* Note: This might conflict visually if JS is still animating scale */
        /* But should take over once JS animation stops at scale 1 */
        animation: pulse 0.8s ease-in-out infinite;
    }

    .multiplier {
        position: absolute;
        right: 10%;
        bottom: 10%;
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
        animation: pulse 0.8s ease-in-out infinite;
    }

    /** this sets a useful size, since original "60%" would translate to 60% screen height when attached to body */
    :global(.rocket-icon.html-trajectory-cloned) {
        /*height: 10vw !important;*/
        height: 10vw !important;
        width: 10vw !important;
        transform-origin: center center !important;
        filter: brightness(0) invert(1)
                drop-shadow(0 0 6px #fff) 
                drop-shadow(0 0 10px rgba(30, 144, 255, 0.8)) /* Dodger Blue */
                drop-shadow(0 0 14px rgba(204, 102, 51, 0.7)); /* Terracotta */
        animation: rocket-glow 1.5s ease-in-out infinite;
    }
    
    @keyframes rocket-glow {
        0%, 100% { 
            filter: brightness(0) invert(1) 
                    drop-shadow(0 0 6px #fff) 
                    drop-shadow(0 0 10px rgba(30, 144, 255, 0.8)) /* Dodger Blue */
                    drop-shadow(0 0 14px rgba(204, 102, 51, 0.7)); /* Terracotta */
        }
        50% { 
            filter: brightness(0) invert(1) 
                    drop-shadow(0 0 8px #fff) 
                    drop-shadow(0 0 15px rgba(65, 105, 225, 0.9)) /* Royal Blue */
                    drop-shadow(0 0 20px rgba(227, 115, 54, 0.8)); /* Deeper Terracotta */
        }
    }

</style>
