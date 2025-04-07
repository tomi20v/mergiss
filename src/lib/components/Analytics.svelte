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

    console.log("analytics initialized");

  }

</script>
