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
  let lastPieceToBoard = 0;
  let lastStitchScore = 0;
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
      boardExpanded: onBoardExpanded,
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
      bonusLevel: playStore.bonusMultiplier,
      bonusMultiplier: (1 + playStore.bonusMultiplier/25),
      elapsed: lastTimestamp ? elapsed(lastTimestamp) : 0,
      playScore: playStore.score,
      version: versionNumber,
    };
  }

  // Example usage of commonProperties in events below:

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
    });
    lastGroupExpired = now();
  }

  function onPieceDropped(event: {
    origin: string;
    piece: Piece;
    dragTime: number;
    rotationCount: number;
  }) {
    if (event.origin == "mergeBoard") {
      gtag("event", "pieceToBoard", {
        dragTime: event.dragTime,
        rotationCount: event.rotationCount,
        life: elapsed(event.piece.createdTime),
        shape: event.piece.shape,
        ...commonProperties(lastPieceToBoard),
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
