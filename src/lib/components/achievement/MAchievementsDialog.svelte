<!-- Add at the bottom of your template -->
<MDialog bind:open={open} onclose={onToggle}
         title="Achievements" subTitle="2 of 6 unlocked">

  {#snippet activator()}
    <MAppBarButton icon="trophy" onclick={openAchievementDialog} />
  {/snippet}

  <div>
    <p class="font-bold">{achievement.name}</p>
    <p class="text-xs mt-2 font-noto">{achievement.description}</p>
    {#if achievement.points}
      <p class="text-xs mt-2">Points: {achievement.points}</p>
    {/if}
  </div>

  {#snippet footer()}
  <!--  <button-->
  <!--      class="px-3 py-1 bg-game-gold text-black rounded hover:opacity-90 transition text-sm"-->
  <!--      onclick={onToggle}-->
  <!--  >-->
  <!--  Close-->
  <!--  </button>-->
  {/snippet}

</MDialog>

<script lang="ts">
  import MDialog from "$lib/components/MDialog.svelte";
  import MAppBarButton from "$lib/components/MAppBarButton.svelte";

  const achievement = {
    name: 'Name',
    description: 'Lorem ipsum dolor sit amet',
    earned: false,
    icon: 'trophy',
    points: 42,
  }

  // Add this state variable to control dialog visibility
  // let dialogOpen = $state(false);
  let { open = $bindable() } = $props();

  function onToggle() {
    open = !open;
  }

  // Add a function to open the dialog
  function openAchievementDialog() {
    open = true;
  }

</script>