{#if (!consented)}
  <div id="cc-banner-back"></div>
{/if}
<slot></slot>

<script lang="ts">

  import {onMount} from "svelte";
  import * as CookieConsent from 'vanilla-cookieconsent';
  import 'vanilla-cookieconsent/dist/cookieconsent.css';
  import {cookieConsentConfig} from "$lib/cookieConsentConfig"

  let consentedCategories: string[] = $state([]);
  let consented = $derived(consentedCategories.includes('necessary') && consentedCategories.includes('analytics'));

  onMount(() => {
    setConsentedCategories();
    CookieConsent.run({
      ...cookieConsentConfig,

      // we don't really need this
      // onFirstConsent: () => {},
      onConsent: showIfNotConsented,
      onChange: showIfNotConsented,
      onModalHide: showIfNotConsented,

    });
  })

  function setConsentedCategories() {
    consentedCategories = CookieConsent.getUserPreferences().acceptedCategories;
  }

  function showIfNotConsented() {
    setConsentedCategories()
    setTimeout(() => consented || CookieConsent.showPreferences(), 500);
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
