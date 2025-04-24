<div class="panel-border progress-bar-container h-full flex grow">
  <div class="progress-bar-track">
    {#if label}
      <div class="progress-bar-label"
           style:color="{labelColor}"
           style:text-shadow="{dynamicTextShadow}"
      >
        {#each label.split('') as char}
          <span>{char}</span>
        {/each}
      </div>
    {/if}
    <div class="progress-bar-fill"
         class:pulsating={clampedFill === 100}
         style="height: {clampedFill}%;
                background-color: {currentVariant.bg};
                border-color: {currentVariant.border};
                box-shadow: inset 0 1px 4px rgba(255, 255, 255, 0.8), 0 0 10px {currentVariant.glow};"
    ></div>
    {#each markPositions as position}
      <div class="progress-bar-mark" style="bottom: {position}%;"></div>
    {/each}
  </div>
</div>

<script lang="ts">

  import {adjustColorBrightness, hexToRgba} from "$lib/components/colorUtils";

  let {
    fill = 0,
    markPositions = [33, 66],
    color = 'amber',
    label = '' // Default to empty string
  } = $props();

  // Ensure fill is between 2% and 99%
  let clampedFill = $derived(Math.min(99, Math.max(2, fill)));

  // Calculate label color based on fill percentage
  // Dark gray when low, white when high
  let labelColor = $derived.by<string>(() => {
    // Use thresholds based on fill value only
    // const textMinThreshold = 25; // Below this, text uses background color
    // const textMaxThreshold = 75; // Above this, text is white
    const textMinThreshold = 40; // Below this, text uses background color
    const textMaxThreshold = 80; // Above this, text is white

    if (clampedFill <= textMinThreshold) {
      // For 0-25% fill, text should match the background or be nearly invisible
      // Use a dark color that will blend with the dark background
      return '#1a1a1a'; // Match the progress-bar-track background color
    } else if (clampedFill >= textMaxThreshold) {
      // White for high values (75-100%)
      return '#ffffff';
    } else {
      // Gradual transition between dark and white for mid-range values (25-75%)
      const percentage = (clampedFill - textMinThreshold) / (textMaxThreshold - textMinThreshold);
      const r = Math.floor(26 + (255 - 26) * percentage);
      const g = Math.floor(26 + (255 - 26) * percentage);
      const b = Math.floor(26 + (255 - 26) * percentage);
      return `rgb(${r}, ${g}, ${b})`;
    }
  });

  // Calculate dynamic text shadow based on fill value
  let dynamicTextShadow = $derived.by<string>(() => {
    // Shadow visibility thresholds based on requirements
    const minThreshold = 25; // Below this, shadow is invisible (transparent)
    const maxThreshold = 75; // Above this, shadow is at maximum intensity

    // If below minimum threshold, return completely transparent shadow (invisible)
    if (clampedFill <= minThreshold) {
      return 'none'; // No shadow at all for 0-25% fill
    }

    // Calculate shadow intensity factor (0 to 1.0 based on fill percentage within the range)
    const shadowFactor = clampedFill >= maxThreshold
      ? 1.0  // Max intensity for fill at or above max threshold
      : (clampedFill - minThreshold) / (maxThreshold - minThreshold); // Gradual increase between thresholds

    // Base shadow values with intensity based on fill percentage
    const shadow1 = `0 0 ${5}px rgba(225, 225, 225, ${0.9 * shadowFactor})`;
    const shadow2 = `0 0 ${10}px rgba(225, 225, 225, ${0.7 * shadowFactor})`;
    const shadow3 = `0 0 ${15}px rgba(225, 225, 225, ${0.9 * shadowFactor})`;
    const shadow4 = `0 0 ${20}px rgba(225, 225, 225, ${0.9 * shadowFactor})`;

    // Return combined shadows
    return `${shadow1}, ${shadow2}, ${shadow3}, ${shadow4}`;
  });

  // Base colors for different color variants
  const baseColors = {
    amber: '#ff8c1a', // Standard amber
    green: '#16a34a'  // Standard green
  };

  // Dynamic color variant generation based on fill level
  function generateColorVariant(baseColor: string, fillPercentage: number) {
    // Check if fill is exactly 100%
    if (fillPercentage === 100) {
      // Extra bright settings for 100% fill
      const extraBrightFactor = 2.0; // Much brighter
      const bgColor = adjustColorBrightness(baseColor, extraBrightFactor);
      const borderColor = adjustColorBrightness(baseColor, extraBrightFactor + 0.2);
      const glowColor = hexToRgba(baseColor, 1.0); // Full opacity glow

      return {
        bg: bgColor,
        border: borderColor,
        glow: glowColor
      };
    }

    // Normal brightness progression for other fill levels
    // Calculate brightness factor: 0.3 (pale) at 0% fill, 1.0 (original) at 50% fill, 1.3 (brighter) at 99% fill
    const brightnessFactor = 0.3 + (fillPercentage / 100) * 1.0;

    // Generate background color with adjusted brightness
    const bgColor = adjustColorBrightness(baseColor, brightnessFactor);

    // Generate border color (slightly brighter than bg)
    const borderColor = adjustColorBrightness(baseColor, brightnessFactor + 0.1);

    // Generate glow color with opacity that increases with fill
    const glowOpacity = 0.2 + (fillPercentage / 100) * 0.6;
    const glowColor = hexToRgba(baseColor, glowOpacity);

    return {
      bg: bgColor,
      border: borderColor,
      glow: glowColor
    };
  }

  // Get current color variant based on fill percentage
  let currentVariant = $derived(generateColorVariant(baseColors[color], clampedFill));
</script>

<style lang="postcss">
    .progress-bar-container {
        width: 1fr;
        height: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
    }

    .progress-bar-track {
        position: relative; /* Needed for absolute positioning of children */
        width: 20px;
        height: 96%;
        background-color: #1a1a1a;
        border-radius: 6px;
        display: flex;
        align-items: flex-end; /* Keep fill at bottom */
        overflow: hidden;
        box-shadow: inset 0 0 2px #000;
    }

    .progress-bar-label {
        position: absolute;
        top: 5px; /* Add some padding from the top */
        left: 50%; /* Center horizontally */
        transform: translateX(-50%) scale(0.8, 1); /* Adjust horizontal centering */
        display: flex;
        flex-direction: column;
        align-items: center;
        /*color: orange; !* Match the orange color used in score *!*/
        /*color: white; !* Match the orange color used in score *!*/
        font-size: max(1.8vw, 1em); /* Adjusted for Orbitron which appears larger */
        letter-spacing: 0; /* Increased spacing between letters */
        z-index: 3; /* Ensure label is above fill and marks */
        text-align: center;
        user-select: none; /* Prevent text selection */
        text-transform: uppercase; /* Keep text uppercase */
        /* dynamic now */
        /*text-shadow: 0 0 5px rgba(225, 225, 225, 0.9), 0 0 10px rgba(225, 225, 225, 0.7), 0 0 15px rgba(225, 225, 225, 0.9), 0 0 20px rgba(225, 225, 225, 0.9); !* Multi-layered glow effect *!*/
        font-weight: 900; /* Maximum boldness */
    }


    .progress-bar-fill {
        width: 100%;
        border: 1px solid;
        border-radius: 4px 4px 0 0;
        transition: height 0.3s ease, background-color 0.5s ease, border-color 0.5s ease;
        z-index: 1; /* Ensure fill is below label and marks */
    }

    .progress-bar-fill.pulsating {
        /* Add pulsating animation if needed */
    }


    .progress-bar-mark {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: #3a3a3a;
        z-index: 2; /* Marks above fill, below label */
    }

    /* Remove duplicate rules */
    /* .progress-bar-container, .progress-bar-track, .progress-bar-fill, .progress-bar-mark styles were duplicated, removed the second set */

</style>