<svelte:head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={measurementId}"></script>
</svelte:head>

<CookieConsent consentCategories={consentCategories} onConsent={onAnalyticsConsent} />

<script lang="ts">

  import {uiBus} from "$lib/util/uiBus";
  import {onMount} from "svelte";
  import CookieConsent from "$lib/components/CookieConsent.svelte";
  import { dev, version } from '$app/environment';
  import type Piece from "$lib/game/piece/Piece";
  import playStore from "$lib/playStore.svelte";
  import type Group from "$lib/game/Group.svelte";
  import now from "$lib/util/now";
  import type {Stitch} from "$lib/game/stitches";
  import debounce from 'lodash.debounce';
  import type {IAchievement} from "$lib/game/achievement/IAchievement";
  import type {IAchievementCategory} from "$lib/game/achievement/IAchievementCategory";

  let {
    measurementId,
    consentCategories,
  } : {
    measurementId: string,
    consentCategories: string[],
  } = $props();

  let availableColorCount = $derived(playStore.availableColors.length);
  let boardSize = $derived(playStore.boardSizeX + playStore.boardSizeY);
  let currentCategories: object = {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'wait_for_update': 500,
  }
  let lastBoardExpanded = 0;
  let lastGroupCreated = 0;
  let lastGroupExpired = 0;
  let lastPieceChanged = 0;
  let lastPieceColorChanged = 0;
  let lastPieceToBoard = 0;
  let lastStitchScore = 0;
  let pieceToBoardAvgElapsed = 0;
  let pieceToBoardCount = 0;
  let versionNumber: number = $derived.by(() => {
    const v = version.split('.').reverse();
    let ret = 0;
    let i = 1;
    v.forEach((each: string) => {
      ret += parseFloat(each) * i;
      i*= 100;
    });
    return ret;
  })

  type StitchAggregate = {
    baseScore: number,
    maxLevel: number
    score: number,
    stitchCount: number,
    debouncedSend: () => void,
  };
  let stitchAggregates = new Map<number, StitchAggregate>();

  onMount(() => {

    initAnalytics();

    for (const [eventName, handler] of Object.entries({
      achieved: onAchieved,
      boardExpanded: onBoardExpanded,
      changePiece: onChangePiece,
      changePieceColor: onChangePieceColor,
      groupCreated: onGroupCreated,
      groupExpiredScore: onGroupExpired,
      onFullScreen,
      pieceDropped: onPieceDropped,
      stitchScore: onStitchScore,
    })) {
      uiBus.on(eventName, handler);
    }

  })

  function elapsed(lastTime: number) {
    return lastTime ? now() - lastTime : 0;
  }

  function gtag(..._: any[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function initAnalytics() {

    const config: {
      debug_mode?: boolean,
      version: number,
    } = {
      version: versionNumber,
    };

    if (dev) {
      config.debug_mode = true;
      window.gtag = gtag;
    }


    gtag('js', new Date());
    gtag('config', measurementId, config);
    gtag('consent', 'default', currentCategories);

  }

  function onAnalyticsConsent(consentedCategories: string[]) {
    const categoryMap = consentCategories
      .filter(each => consentedCategories.includes(each))
      .reduce((prev, cur) => Object.assign(prev, {[cur]: 'granted'}), {});
    gtag('consent', 'update', categoryMap);
  }

  // Refactored common properties function
  function commonProperties(lastTimestamp?: number) {
    return {
      availableColorCount,
      boardSize,
      bonusLevel: playStore.bonusPcnt,
      bonusMultiplier: playStore.bonusMultiplier,
      elapsed: lastTimestamp ? elapsed(lastTimestamp) : 0,
      playScore: playStore.score,
      version: versionNumber,
    };
  }

  // Example usage of commonProperties in events below:

  function onAchieved(event: {
    achievement: IAchievement,
    category: IAchievementCategory,
  }) {
    gtag("event", "unlock_achievement", {
      achievement_id: event.achievement.id,
      ...commonProperties(),
    });
  }

  function onBoardExpanded(event: {
    origin: string;
    boardSizeBefore: { sizeX: number, sizeY: number };
    expansions: number;
  }) {
    gtag("event", "boardExpanded", {
      boardSizeBefore: event.boardSizeBefore.sizeX + event.boardSizeBefore.sizeY,
      expansions: event.expansions,
      ...commonProperties(lastBoardExpanded),
    });
    lastBoardExpanded = now();
  }

  function onChangePiece() {
    gtag("event", "pieceChanged", commonProperties(lastPieceChanged));
  }

  function onChangePieceColor() {
    gtag("event", "pieceColorChanged", commonProperties(lastPieceColorChanged));
  }

  function onFullScreen(fullscreen: boolean) {
    gtag("event", "fullscreen", {
      fullscreen,
      ...commonProperties(),
    });
  }

  function onGroupCreated(event: {
    group: Group;
    mergedGroupCount: number;
    overlaps: number;
    stitchCount: number;
  }) {
    gtag("event", "groupCreated", {
      mergedGroupCount: event.mergedGroupCount,
      overlaps: event.overlaps,
      baseScore: event.group.score,
      ttl: event.group.ttl,
      weight: event.group.weight,
      stitchCount: event.stitchCount,
      ...commonProperties(lastGroupCreated),
    });
    lastGroupCreated = now();
  }

  function onGroupExpired(event: {
    group: Group;
    score: number;
    origin: string;
    bonusMultiplier: number;
  }) {
    gtag("event", "groupExpired", {
      acceleratedTime: event.group.acceleratedTime,
      baseScore: event.group.score,
      lifeTime: elapsed(event.group.createdAt),
      remainingTTL: event.group.ttl,
      score: event.score,
      origin: event.origin,
      weight: event.group.weight,
      ...commonProperties(lastGroupExpired),
      bonusMultiplier: event.bonusMultiplier,
    });
    lastGroupExpired = now();
  }

  function onPieceDropped(event: {
    origin: string;
    piece: Piece;
    dragTime: number;
  }) {
    if (event.origin == "mergeBoard") {
      let currentElapsed = elapsed(lastPieceToBoard);
      let reportedElapsed = currentElapsed;
      
      // Don't record elapsed if the current elapsed time is 4x greater than the average
      // eg. the user takes a break or looks around in the UI, it's not relevant when
      // tuning for piece to board avg time
      if (pieceToBoardCount > 0 && currentElapsed > pieceToBoardAvgElapsed * 4) {
        reportedElapsed = 0;
      }
      
      // Update the running average (always include the real elapsed time)
      pieceToBoardAvgElapsed = pieceToBoardCount === 0 
        ? currentElapsed 
        : (pieceToBoardAvgElapsed * pieceToBoardCount + currentElapsed) / (pieceToBoardCount + 1);
      pieceToBoardCount++;
      
      gtag("event", "pieceToBoard", {
        dragTime: event.dragTime,
        rotationCount: event.piece.rotationCount,
        life: elapsed(event.piece.createdTime),
        shape: event.piece.shape,
        ...commonProperties(),
        elapsed: reportedElapsed,
      });
      lastPieceToBoard = now();
    }
  }

  function onStitchScore(event: {
    stitch: Stitch,
    baseScore: number,
    score: number
  }) {
    const groupId = event.stitch.group;

    // Get or create aggregation for this group
    let aggregation = stitchAggregates.get(groupId);
    if (!aggregation) {
      aggregation = {
        baseScore: 0,
        maxLevel: 0,
        score: 0,
        stitchCount: 0,
        debouncedSend: debounce(() => sendStitchScore(groupId), 1000),
      };
      stitchAggregates.set(groupId, aggregation);
    }

    // Aggregate the metrics
    aggregation.baseScore += event.baseScore;
    aggregation.maxLevel = Math.max(aggregation.maxLevel, event.stitch.level);
    aggregation.score += event.score;
    aggregation.stitchCount++;

    // Reset the debounce timer
    aggregation.debouncedSend();
  }

  // receiving groupId instead of the aggregate is strange but we need
  //  groupId to remove that aggregation (in worst case it would be re-created,
  //  but group IDs are unique and not reused so makes sense to delete)
  function sendStitchScore(groupId: number) {
    const aggregate = stitchAggregates.get(groupId);
    if (!aggregate) return;

    gtag("event", "stitchScore", {
      baseScore: aggregate.baseScore,
      maxLevel: aggregate.maxLevel,
      score: aggregate.score,
      stitchCount: aggregate.stitchCount,
      ...commonProperties(lastStitchScore),
    });

    lastStitchScore = now();
    stitchAggregates.delete(groupId);
  }

</script>
