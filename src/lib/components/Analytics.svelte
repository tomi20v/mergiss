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

</script>
