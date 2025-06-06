<MAchievementPopup />
<MAchievementsDialog {entropy} />
<!--<button onclick={onDev}>DEV</button>-->
<script lang="ts">

  import {onMount} from "svelte";
  import MAchievementsDialog from "$lib/components/achievement/MAchievementsDialog.svelte";
  import entropy from "$lib/game/entropy";
  import {uiBus} from "$lib/util/uiBus";
  import MAchievementPopup from "$lib/components/achievement/MAchievementPopup.svelte";
  import playStore from "$lib/playStore.svelte";
  import type {IAchievementCategory} from "$lib/game/achievement/IAchievementCategory";
  import type {IAchievement} from "$lib/game/achievement/IAchievement";
  import type {UnknownObject} from "../../../util/UnknownObject";

  const state: UnknownObject = $state({});

  onMount(() => {
    (entropy as unknown as IAchievementCategory[]).forEach((category: IAchievementCategory) => {
      if (category.achievements) {
        category.achievements
          .forEach((achievement: IAchievement) => {
            subscribeToAchievement(achievement, category);
          })
      }
    });
  })

  // function onDev() {
  //   playStore.achievementIds = ['astro-1', 'astro-2', 'astro-3', 'astro-4', 'astro-5', 'spin-1', 'spin-2', 'side-1', 'side-3'];
  //   playStore.achievementIds = ['astro-1', 'astro-2', 'astro-4', 'spin-2', 'side-1', ];
  //   uiBus.emit('achieved', {achievement: (entropy[3] as any).achievements[0], category: (entropy[3] as any)});
  // }

  function subscribeToAchievement(achievement: IAchievement, category: IAchievementCategory) {
    if (achievement.eventNames && !playStore.achievementIds.includes(achievement.id)) {
      achievement.eventNames.forEach(eventName => {
        const handler = function(eventData: object) {
          if (achievement.callback  && !playStore.achievementIds.includes(achievement.id)) {
            if (achievement.callback(state, eventName, eventData)) {
              playStore.achievementIds.push(achievement.id);
              uiBus.emit('achieved', {achievement, category});
              uiBus.off(eventName, handler);
            }
          }
        };
        uiBus.on(eventName, handler);
      });
    }
  }



</script>