<svelte:head>
  <!-- Google Analytics Script -->
  <!--{#if (!dev && measurementId)}-->
  <!--<script async src="https://www.googletagmanager.com/gtag/js?id={measurementId}"></script>-->
  <!--{/if}-->

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={measurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
  </script>
<!--    gtag('js', new Date());-->
<!--    gtag('config', {measurementId}, "{'app_version':{version}}");-->
<!--    gtag('consent', 'default', currentCategories);-->
</svelte:head>

<CookieConsent consentCategories={consentCategories} onConsent={onAnalyticsConsent} />

<script lang="ts">

  import {dev} from "$app/environment";
  import {uiBus} from "$lib/util/uiBus";
  import {onMount} from "svelte";
  import CookieConsent from "$lib/components/CookieConsent.svelte";
  import type Group from "$lib/game/Group";
  import { version } from '$app/environment';

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

    // const script = document.createElement('script');
    // script.innerHTML = `
    //   window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date());
    //   gtag('config', '${measurementId}', {"app_version": "${version}"});
    //   gtag('consent', 'default', ${JSON.stringify(currentCategories)});
    // `;
    // document.head.appendChild(script);

    initAnalytics();
    for (const [eventName, handler] of Object.entries({
      // onGroupExpire,
      onFullScreen,
    })) {
      uiBus.on(eventName, handler);
    }
  })

  function ____gtag(...args: any[]) {
    window.dataLayer = window.dataLayer || [];
    // function gtag(...args: any[]){window.dataLayer.push(args);}
    window.dataLayer.push(args);
  }

  function initAnalytics() {

    // if (dev) return;

    gtag('js', new Date());
    gtag('config', measurementId, {app_version: version});
    // gtag('consent', 'default', currentCategories);

  }

  function onAnalyticsConsent(consentedCategories: string[]) {
    // const categoryMap = consentCategories
    //   .filter(each => consentedCategories.includes(each))
    //   .reduce((prev, cur) => Object.assign(prev, {[cur]: 'granted'}), {});
    // // ____gtag('consent', 'update', categoryMap);
    // // ____gtag('event', 'consented', categoryMap);
    // // ____gtag({'event': 'consented2', 'consentedCategories': consentedCategories});
    // gtag('consent', 'update', categoryMap);
    // gtag('event', 'consented', categoryMap);
  }

  function onFullScreen(fullscreen: boolean) {
    gtag('event', 'fullscreen', {fullscreen});
  }

  function onGroupExpire(group: Group) {
    ____gtag('event', 'groupExpired', group);
  }

</script>
