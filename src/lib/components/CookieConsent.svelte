{#if (!consented)}
  <div id="cc-banner-back"></div>
{:else}
  <slot></slot>
{/if}
<script lang="ts">

  import {dev} from "$app/environment";
  import {onMount} from "svelte";
  import * as CookieConsent from 'vanilla-cookieconsent';
  import 'vanilla-cookieconsent/dist/cookieconsent.css';
  import {cookieConsentConfig} from "$lib/cookieConsentConfig"

  let consented = false;

  onMount(() => {
    CookieConsent.run({
      ...cookieConsentConfig,

      onFirstConsent: ({cookie}) => {
        console.log('onFirstConsent fired', cookie);
      },

      onConsent: ({cookie}) => {
        console.log('onConsent fired!', cookie, CookieConsent.getUserPreferences());
      },

      onChange: ({changedCategories, changedServices }) => {
        console.log('onChange fired!', changedCategories, changedServices);
      },

      onModalReady: ({ modalName }) => {
        console.log('ready:', modalName);
      },

      onModalShow: ({ modalName }) => {
        console.log('visible:', modalName);
      },

      onModalHide: ({ modalName }) => {
        console.log('hidden:', modalName);
      },

    });
  })

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
