{#if (!consented)}
  <div id="cc-banner-back"></div>
{/if}

<script lang="ts">

  import {onMount} from "svelte";
  import * as CookieConsent from 'vanilla-cookieconsent';
  import 'vanilla-cookieconsent/dist/cookieconsent.css';
  import {cookieConsentConfig} from "$lib/cookieConsentConfig"

  let {
    // default config could be used even when not all categories are to be shown (eg. only analytics is required)
    consentCategories = [],
    onConsent
  }: {
    consentCategories: string[],
    onConsent: (categories: string[]) => void,
  } = $props();

  let consentedCategories: string[] = $state([]);
  let consented = $derived(consentedCategories.includes('necessary') && consentedCategories.includes('analytics_storage'));

  onMount(() => {
    setConsentedCategories();
    if (consentCategories.length > 0) {
      cookieConsentConfig.categories = Object.fromEntries(
        Object.entries(cookieConsentConfig.categories)
          .filter(([key]) => consentCategories.concat(["necessary"]).includes(key))
      );
    }
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
    if (consented) {
      onConsent(consentedCategories);
    }
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
