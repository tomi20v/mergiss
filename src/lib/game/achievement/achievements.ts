import playStore from "$lib/playStore.svelte";
import type { IAchievement } from "./IAchievement";
import type { IAchievementCategory } from "./IAchievementCategory";

/**
 * Check if an achievement is earned by checking if its ID exists in playStore.achievementIds
 */
function achieved(id: string): boolean {
  return playStore.achievementIds.includes(id);
}

/**
 * Determines if an achievement is unlocked based on specific rules:
 * - First 2 achievements are always unlocked
 * - Earning the 1st or 2nd unlocks the 3rd
 * - Earning both 1st and 2nd unlocks 3rd and 4th
 * - Earning the 3rd unlocks the 4th
 * - Earning the 4th unlocks the 5th
 *
 * Patterns described:
 * UULLL - First 2 unlocked, rest locked
 * EUULL - Earning 1st unlocks 3rd
 * EEUUL - Earning 1st and 2nd unlocks 3rd and 4th
 * UEULL - Earning 2nd unlocks 3rd
 * EUEUL - Earning 1st and 3rd
 * EEEUL - Earning 1st, 2nd, and 3rd unlocks 4th
 * ...and so on
 */
function unlocked(category: IAchievementCategory, item: IAchievement): boolean {
  const achievements = category.achievements;

  // Get the index of this achievement in its category
  const achievementIndex = achievements.findIndex(
    (achievement: IAchievement) => achievement.id === item.id
  );

  // First 2 are always unlocked
  if (achievementIndex < 2) {
    return true;
  }

  // Check if specific achievements are earned
  const isFirstEarned = playStore.achievementIds.includes(achievements[0]?.id);
  const isSecondEarned = playStore.achievementIds.includes(achievements[1]?.id);
  const isThirdEarned = playStore.achievementIds.includes(achievements[2]?.id);
  const isFourthEarned = playStore.achievementIds.includes(achievements[3]?.id);

  // Apply unlocking rules
  if (achievementIndex === 2) {
    // 3rd is unlocked if either 1st or 2nd is earned
    return isFirstEarned || isSecondEarned;
  }

  if (achievementIndex === 3) {
    // 4th is unlocked if (both 1st and 2nd are earned) OR (3rd is earned)
    return (isFirstEarned && isSecondEarned) || isThirdEarned;
  }

  if (achievementIndex === 4) {
    // 5th is unlocked if 4th is earned
    return isFourthEarned;
  }

  // Default to locked for any other cases
  return false;
}

/**
 * Check if an achievement is implemented
 */
function implemented(item: IAchievement): boolean {
  return !!item.eventNames && !!item.callback;
}

export default {achieved, unlocked, implemented};
