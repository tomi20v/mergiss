<TopAppBar
  variant="standard"
  dense
  >
  <Row>
    <Section>
      <IconButton class="material-icons">merge</IconButton>
      <Title>MERGISS</Title>
    </Section>
  </Row>

</TopAppBar>

<LayoutGrid>
  <Cell span={12}>
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
  </Cell>
  <Cell span={3} style="border: 1px solid gray;">
    <MGenerator
      ></MGenerator>
  </Cell>
  <Cell span={3} style="border: 1px solid gray;">
    <MGenerator
      ></MGenerator>
  </Cell>
  <Cell span={3} style="border: 1px solid gray;">
    <MGenerator
      ></MGenerator>
  </Cell>
  <Cell span={3} style="border: 1px solid gray;">
    <MGenerator
      ></MGenerator>
  </Cell>

  <Cell span={8}>
    <MGissBoard
      ></MGissBoard>
  </Cell>

  <Cell span={6} style="border: 1px solid red;">
    <div>
      <Button onclick={() => clicked++}>
        <Label>Default</Label>
      </Button>
      <Button onclick={() => clicked++} disabled>
        <Label>Disabled</Label>
      </Button>
      <Button onclick={() => clicked++} ripple={false}>
        <Label>No Ripple</Label>
      </Button>
      <!--
        Note: to target this class, you need to use
        a :global() selector. See the styles below.
      -->
      <Button onclick={() => clicked++} class="myClass">
        <Label>With a Class</Label>
      </Button>
    </div>

    <pre class="status">Clicked: {clicked}</pre>

  </Cell>
  <Cell span={6} style="border: 1px solid red;">
    teszt
  </Cell>
</LayoutGrid>

<script lang="ts">
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import MGissBoard from "$lib/components/MGissBoard.svelte";
  import MGenerator from "$lib/components/MGenerator.svelte";

  let clicked = $state(0);
</script>

<style>
    /* Accessing the class with "*" in front limits
      the scope to anything under this component's
      elements. */
    * :global(.myClass) {
        font-style: italic;
    }
</style>
