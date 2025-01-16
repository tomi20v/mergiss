{#if 1}
<TopAppBar
  variant="standard"
  dense
  >
  <Row>
    <Section>
      <IconButton class="material-icons">merge</IconButton>
      <Title>MERGISS</Title>
    </Section>
    <Section align="end" toolbar>
      <IconButton class="material-icons" onclick={toggleFullScreen}>fullscreen</IconButton>
    </Section>
  </Row>
</TopAppBar>
{/if}

<LayoutGrid class="bg-black pt-16">
  <Cell span={3} sstyle="border: 1px solid cyan;">
    <MGenerator />
  </Cell>
  <Cell span={3} sstyle="border: 1px solid gray;">
    <MGenerator disabled ></MGenerator>
  </Cell>
  <Cell span={3} sstyle="border: 1px solid gray;">
    <MGenerator disabled ></MGenerator>
  </Cell>
  <Cell span={3} sstyle="border: 1px solid gray;">
    <MGenerator disabled ></MGenerator>
  </Cell>

  <Cell span={2}>
  </Cell>
  <Cell span={8}>
    <MGissBoard
      ></MGissBoard>
  </Cell>

  {#if (dev)}
  <Cell span={12} style="border: 1px solid purple; color: white;">
    <ColorSamples />
  </Cell>
  {/if}
</LayoutGrid>

<script lang="ts">
  import "../app.css";

  import IconButton from '@smui/icon-button';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import MGissBoard from "$lib/components/MGissBoard.svelte";
  import MGenerator from "$lib/components/MGenerator.svelte";
  import ColorSamples from "$lib/components/dev/ColorSamples.svelte";
  import {dev} from "$app/environment";

  let isFullScreen = false;

  function toggleFullScreen() {
    isFullScreen ? closeFullscreen() : openFullscreen();
  }

  var elem = document.documentElement;

  /* View in fullscreen */
  function openFullscreen() {
    isFullScreen = true;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    } else {
      isFullScreen = false;
    }
  }

  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    isFullScreen = false;
  }

</script>

<style lang="postcss">
    /* Accessing the class with "*" in front limits
      the scope to anything under this component's
      elements. */
    * :global(.myClass) {
        font-style: italic;
    }
</style>
