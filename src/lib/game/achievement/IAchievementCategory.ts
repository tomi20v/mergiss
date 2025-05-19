import type {IAchievement} from "$lib/game/achievement/IAchievement";

export interface IAchievementCategory {
  category: string;
  achievements: IAchievement[];
}
