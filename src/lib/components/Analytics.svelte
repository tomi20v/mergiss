<svelte:head>
  <!-- Google Analytics Script -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={measurementId}"></script>
</svelte:head>
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount} from "svelte";

  let { measurementId } : { measurementId: string } = $props();
  let initialized = false;

  onMount(() => {
    initAnalytics();
  })

  function initAnalytics() {

    if (dev) return;
    if (initialized) return;

    // Ensure gtag is available
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]){window.dataLayer.push(args);}
    gtag('js', new Date());
    gtag('config', measurementId);

    initialized = true;

    console.log("analytics initialized");

  }

</script>
