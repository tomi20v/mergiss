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
  import type Group from "$lib/game/Group";

  let {
    measurementId,
    consentCategories,
  } : {
    measurementId: string,
    consentCategories: string[],
  } = $props();
  let currentCategories: object = {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'wait_for_update': 500,
  }

  onMount(() => {

    initAnalytics();

    for (const [eventName, handler] of Object.entries({
      boardExpanded: onBoardExpanded,
      groupCreated: onGroupCreated,
      // onGroupExpire,
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
      v: string,
    } = {
      v: version,
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
    boardSize: {sizeX: number, sizeY: number},
    boardSizeBefore: {sizeX: number, sizeY: number},
    expansions: number,
  }) {
    gtag('event', 'boardExpanded', {
      boardSize: event.boardSize.sizeX + event.boardSize.sizeY,
      boardSizeBefore: event.boardSizeBefore.sizeX + event.boardSizeBefore.sizeY,
      dimensions: event.boardSize,
      expansions: event.expansions,
      v: version,
    });
  }

  function onFullScreen(fullscreen: boolean) {
    gtag('event', 'fullscreen', {fullscreen, v: version});
  }

  // function onGroupExpire(group: Group) {
  //   gtag('event', 'groupExpired', {group, v: version});
  // }

  function onPieceDropped(event: {
    origin: string,
    piece: Piece,
    dragTime: number,
    rotationCount: number,
    boardSize: {sizeX: number, sizeY: number}
  }) {
    if (event.origin == 'mergeBoard') {
      gtag('event', 'pieceToBoard', {
        dragTime: event.dragTime,
        rotationCount: event.rotationCount,
        shape: event.piece.shape,
        availableColorCount: playStore.availableColors.length,
        boardSize: event.boardSize.sizeX + event.boardSize.sizeY,
        v: version,
      })
    }
  }

  function onGroupCreated(event: {
    group: Group,
    mergedGroupCount: number,
    overlaps: number,
    stitchCount: number,
    boardSize: {sizeX: number, sizeY: number}
  }) {
    gtag('event', 'groupCreated', {
      ttl: event.group.ttl,
      score: event.group.score,
      weight: event.group.weight,
      mergedGroupCount: event.mergedGroupCount,
      overlaps: event.overlaps,
      stitchCount: event.stitchCount,
      availableColorCount: playStore.availableColors.length,
      boardSize: event.boardSize.sizeX + event.boardSize.sizeY,
      v: version,
    });
  }

</script>
