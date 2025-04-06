{#if (!consented)}
  <div id="cc-banner-back"></div>
{:else}
  <slot></slot>
{/if}
<script lang="ts">

  import {onMount} from "svelte";
  import * as CookieConsent from 'vanilla-cookieconsent';
  import 'vanilla-cookieconsent/dist/cookieconsent.css';
  import {cookieConsentConfig} from "$lib/cookieConsentConfig"

  let consented = false;

  onMount(() => {
    CookieConsent.run({
      ...cookieConsentConfig,

      onFirstConsent: ({cookie}) => {
        // implement google consent mode here
        console.log('onFirstConsent fired', cookie);
      },

      onConsent: () => showIfNotConsented(),
      onChange: () => showIfNotConsented(),
      onModalHide: () => showIfNotConsented(),

    });
  })

  function showIfNotConsented() {
    const categories: string[] = CookieConsent.getUserPreferences().acceptedCategories;
    if (categories.includes('necessary') && categories.includes('analytics')) {
      consented = true;
    }
    else {
      setTimeout(CookieConsent.showPreferences, 500);
    }
  }

</script>

<style>
    #cc-banner-back {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #444;
        opacity: 0.8;
        z-index: 10001;
    }
</style>
