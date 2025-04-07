<svelte:head>
  <!-- Google Analytics Script -->
  {#if (!dev && measurementId)}
  <script async src="https://www.googletagmanager.com/gtag/js?id={measurementId}"></script>
  {/if}
</svelte:head>

<CookieConsent consentCategories={consentCategories} onConsent={onAnalyticsConsent} />

<script lang="ts">

  import {dev} from "$app/environment";
  import {uiBus} from "$lib/util/uiBus";
  import {onMount} from "svelte";
  import CookieConsent from "$lib/components/CookieConsent.svelte";

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
  }

  onMount(() => {
    initAnalytics();
  })

  function gtag(...args: any[]) {
    window.dataLayer = window.dataLayer || [];
    // function gtag(...args: any[]){window.dataLayer.push(args);}
    window.dataLayer.push(args);
  }


  function initAnalytics() {

    if (dev) return;

    gtag('js', new Date());
    gtag('config', measurementId);
    gtag('consent', 'default', currentCategories);

  }

  function onAnalyticsConsent(consentedCategories: string[]) {
    const categoryMap = consentCategories
      .filter(each => consentedCategories.includes(each))
      .reduce((prev, cur) => Object.assign(prev, {[cur]: 'granted'}), {});
    gtag('consent', 'update', categoryMap);
    gtag('event', 'consented', categoryMap);
  }

  }

</script>
