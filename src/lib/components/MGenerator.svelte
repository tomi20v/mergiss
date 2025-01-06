<div class="flex gap-2 justify-center">
    {#if !disabled}
        <Image src="generator.png" class="w-2/3" />
        <div class="flex text-white m-1 justify-center items-center w-1/3
                border-3 border-blue-300 border-double rounded-lg border-l-0 border-r-0"
        >
            <div class="flex text-xs border-slate-600 border-2 border-dotted">piece<br/>here</div>
        </div>
    {:else}
        <Image src="generator-disabled.png" class="w-2/3" />
        <div class="flex text-white m-1 justify-center items-center w-1/3
                border-3 border-slate-500 border-double rounded-lg border-l-0 border-r-0"
        >
            <div class="flex text-xs border-slate-600 border-2 border-dotted">BUY</div>
        </div>
    {/if}
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
