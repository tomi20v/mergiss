<svelte:head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={measurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
  </script>
</svelte:head>

<CookieConsent consentCategories={consentCategories} onConsent={onAnalyticsConsent} />

<script lang="ts">

  import {uiBus} from "$lib/util/uiBus";
  import {onMount} from "svelte";
  import CookieConsent from "$lib/components/CookieConsent.svelte";
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

    initAnalytics();
    for (const [eventName, handler] of Object.entries({
      // onGroupExpire,
      onFullScreen,
    })) {
      uiBus.on(eventName, handler);
    }
  })

  // function ____gtag(...args: any[]) {
  //   window.dataLayer = window.dataLayer || [];
  //   // function gtag(...args: any[]){window.dataLayer.push(args);}
  //   window.dataLayer.push(args);
  // }

  function initAnalytics() {

    // if (dev) return;

    gtag('js', new Date());
    gtag('config', measurementId, {v: version});
    gtag('consent', 'default', currentCategories);

  }

  function onAnalyticsConsent(consentedCategories: string[]) {
    const categoryMap = consentCategories
      .filter(each => consentedCategories.includes(each))
      .reduce((prev, cur) => Object.assign(prev, {[cur]: 'granted'}), {});
    gtag('consent', 'update', categoryMap);
    // gtag('event', 'consented', categoryMap);
  }

  function onFullScreen(fullscreen: boolean) {
    gtag('event', 'fullscreen', {fullscreen, v: version});
  }

  // function onGroupExpire(group: Group) {
  //   ____gtag('event', 'groupExpired', {group, v: version});
  // }

</script>
