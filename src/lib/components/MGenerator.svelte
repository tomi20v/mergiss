<div style="background-color: black;">
<!--  <ImageAspectContainer>-->
    {#if !disabled}
    <Image src="generator.png" />
    {:else}
    <Image src="generator-disabled.png" />
    {/if}
<!--  </ImageAspectContainer>-->
</div>
<script lang="ts">
  import {Image} from "@smui/image-list";
  let { disabled } = $props();
  // enum states {
  //   disabled = 'disabled',
  //   enabled = 'enabled',
  // };
  // const state: states = states.disabled;
</script>