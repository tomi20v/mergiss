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

  let {
    measurementId,
    consentCategories,
  } : {
    measurementId: string,
    consentCategories: string[],
  } = $props();

  let boardSize = $derived(playStore.boardSizeX + playStore.boardSizeY);
  let currentCategories: object = {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'wait_for_update': 500,
  }
  let lastBoardExpanded = 0;
  let lastGroupExpired = 0;
  let lastPieceToBoard = 0;
  let versionNumber: number = $derived.by(() => {
    const v = version.split('.').reverse();
    let ret = 0;
    let i = 1;
    v.forEach((each: string) => {
      ret += each.to * i;
      i*= 100;
    });
    return ret;
  })

  onMount(() => {

    initAnalytics();

    for (const [eventName, handler] of Object.entries({
      boardExpanded: onBoardExpanded,
      groupCreated: onGroupCreated,
      groupExpired: onGroupExpired,
      onFullScreen,
      pieceDropped: onPieceDropped,
    })) {
      uiBus.on(eventName, handler);
    }

  })

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

  function onBoardExpanded(event: {
    origin: string,
    boardSizeBefore: {sizeX: number, sizeY: number},
    expansions: number,
  }) {
    gtag('event', 'boardExpanded', {
      boardSize,
      boardSizeBefore: event.boardSizeBefore.sizeX + event.boardSizeBefore.sizeY,
      expansions: event.expansions,
      elapsed: lastBoardExpanded ? 0 : elapsed(lastBoardExpanded),
      version: versionNumber,
    });
    lastBoardExpanded = now();
  }

  function onFullScreen(fullscreen: boolean) {
    gtag('event', 'fullscreen', {fullscreen, version: versionNumber});
  }

  function onGroupCreated(event: {
    group: Group,
    mergedGroupCount: number,
    overlaps: number,
    stitchCount: number,
  }) {
    gtag('event', 'groupCreated', {
      ttl: event.group.ttl,
      score: event.group.score,
      weight: event.group.weight,
      mergedGroupCount: event.mergedGroupCount,
      overlaps: event.overlaps,
      stitchCount: event.stitchCount,
      availableColorCount: playStore.availableColors.length,
      boardSize,
      version: versionNumber,
    });
  }

  function onGroupExpired(event: {
    group: Group,
  }) {
    gtag('event', 'groupExpired', {
      acceleratedTime: event.group.acceleratedTime,
      boardSize,
      score: event.group.score,
      weight: event.group.weight,
      elapsed: elapsed(lastGroupExpired),
      version: versionNumber
    });
    lastGroupExpired = now();
  }

  function onPieceDropped(event: {
    origin: string,
    piece: Piece,
    dragTime: number,
    rotationCount: number,
  }) {
    if (event.origin == 'mergeBoard') {
      gtag('event', 'pieceToBoard', {
        dragTime: event.dragTime,
        rotationCount: event.rotationCount,
        shape: event.piece.shape,
        availableColorCount: playStore.availableColors.length,
        boardSize,
        elapsed: elapsed(lastPieceToBoard),
        version: versionNumber,
      });
      lastPieceToBoard = now();
    }
  }

  function elapsed(lastTime: number) {
    return lastTime ? now() - lastTime : 0;
  }

</script>
