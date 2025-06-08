import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import achievements from './achievements';
import type { IAchievement } from './IAchievement';
import type { IAchievementCategory } from './IAchievementCategory';

// Mock the playStore module
vi.mock('$lib/playStore.svelte', () => ({
  default: {
    achievementIds: []
  }
}));

// Import the mocked module
import playStore from '$lib/playStore.svelte';

describe('Achievement functions', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    // Reset the achievementIds array
    playStore.achievementIds = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('achievements.achieved function', () => {
    it('should return true if achievement ID exists in playStore.achievementIds', () => {
      // Arrange
      playStore.achievementIds = ['test-achievement-1', 'test-achievement-2'];
      
      // Act & Assert
      expect(achievements.achieved('test-achievement-1')).toBe(true);
      expect(achievements.achieved('test-achievement-2')).toBe(true);
    });

    it('should return false if achievement ID does not exist in playStore.achievementIds', () => {
      // Arrange
      playStore.achievementIds = ['test-achievement-1', 'test-achievement-2'];
      
      // Act & Assert
      expect(achievements.achieved('test-achievement-3')).toBe(false);
      expect(achievements.achieved('non-existent-achievement')).toBe(false);
    });

    it('should return false for an empty achievementIds array', () => {
      // Arrange
      playStore.achievementIds = [];
      
      // Act & Assert
      expect(achievements.achieved('test-achievement')).toBe(false);
    });
  });

  describe('achievements.unlocked function', () => {
    // Setup test data
    let testCategory: IAchievementCategory;
    
    beforeEach(() => {
      // Create test achievements
      const testAchievements: IAchievement[] = [
        { id: 'achievement-1', title: 'First Achievement', description: 'Test description', hint: 'Test hint', gain: 'Test gain' } as IAchievement,
        { id: 'achievement-2', title: 'Second Achievement', description: 'Test description', hint: 'Test hint', gain: 'Test gain' } as IAchievement,
        { id: 'achievement-3', title: 'Third Achievement', description: 'Test description', hint: 'Test hint', gain: 'Test gain' } as IAchievement,
        { id: 'achievement-4', title: 'Fourth Achievement', description: 'Test description', hint: 'Test hint', gain: 'Test gain' } as IAchievement,
        { id: 'achievement-5', title: 'Fifth Achievement', description: 'Test description', hint: 'Test hint', gain: 'Test gain' } as IAchievement,
        { id: 'achievement-6', title: 'Sixth Achievement', description: 'Test description', hint: 'Test hint', gain: 'Test gain' } as IAchievement,
      ];
      
      // Create test category
      testCategory = {
        category: 'Test Category',
        achievements: testAchievements
      };
    });

    it('should always unlock the first two achievements', () => {
      // Test first achievement
      expect(achievements.unlocked(testCategory, testCategory.achievements[0])).toBe(true);
      
      // Test second achievement
      expect(achievements.unlocked(testCategory, testCategory.achievements[1])).toBe(true);
    });

    it('should keep the third achievement locked if neither first nor second is earned', () => {
      // Arrange - no achievements earned yet
      playStore.achievementIds = [];
      
      // Act & Assert - third achievement should be locked
      expect(achievements.unlocked(testCategory, testCategory.achievements[2])).toBe(false);
    });

    it('should unlock the third achievement if the first achievement is earned', () => {
      // Arrange - first achievement is earned
      playStore.achievementIds = ['achievement-1'];
      
      // Act & Assert - third achievement should be achievements.unlocked
      expect(achievements.unlocked(testCategory, testCategory.achievements[2])).toBe(true);
    });

    it('should unlock the third achievement if the second achievement is earned', () => {
      // Arrange - second achievement is earned
      playStore.achievementIds = ['achievement-2'];
      
      // Act & Assert - third achievement should be achievements.unlocked
      expect(achievements.unlocked(testCategory, testCategory.achievements[2])).toBe(true);
    });

    it('should keep the fourth achievement locked if neither the first and second, nor the third are earned', () => {
      // Arrange - no achievements earned
      playStore.achievementIds = [];
      
      // Act & Assert - fourth achievement should be locked
      expect(achievements.unlocked(testCategory, testCategory.achievements[3])).toBe(false);
    });

    it('should unlock the fourth achievement if both the first and second achievements are earned', () => {
      // Arrange - first and second achievements are earned
      playStore.achievementIds = ['achievement-1', 'achievement-2'];
      
      // Act & Assert - fourth achievement should be achievements.unlocked
      expect(achievements.unlocked(testCategory, testCategory.achievements[3])).toBe(true);
    });

    it('should unlock the fourth achievement if the third achievement is earned', () => {
      // Arrange - third achievement is earned
      playStore.achievementIds = ['achievement-3'];
      
      // Act & Assert - fourth achievement should be achievements.unlocked
      expect(achievements.unlocked(testCategory, testCategory.achievements[3])).toBe(true);
    });

    it('should keep the fifth achievement locked if the fourth achievement is not earned', () => {
      // Arrange - first three achievements earned, but not the fourth
      playStore.achievementIds = ['achievement-1', 'achievement-2', 'achievement-3'];
      
      // Act & Assert - fifth achievement should be locked
      expect(achievements.unlocked(testCategory, testCategory.achievements[4])).toBe(false);
    });

    it('should unlock the fifth achievement if the fourth achievement is earned', () => {
      // Arrange - fourth achievement is earned
      playStore.achievementIds = ['achievement-4'];
      
      // Act & Assert - fifth achievement should be achievements.unlocked
      expect(achievements.unlocked(testCategory, testCategory.achievements[4])).toBe(true);
    });

  });

  describe('achievements.implemented function', () => {

    let achievement: IAchievement;

    beforeEach(() => {
      achievement = {
        id: 'test-achievement',
        title: 'Test Achievement',
        description: 'Test description',
        hint: 'Test hint',
        gain: 'Test gain',
        eventNames: ['testEvent'],
        callback: () => true
      } as unknown as IAchievement;
    });

    it('should return true for an achievement with both eventNames and callback defined', () => {
      // Act & Assert
      expect(achievements.implemented(achievement)).toBe(true);
    });

    it('should return false for an achievement with eventNames but no callback', () => {
      // Arrange
      achievement.callback = undefined;
      const category = {
        category: 'Test Category',
        achievements: [achievement]
      };

      // Act & Assert
      expect(achievements.implemented(achievement)).toBe(false);
    });

    it('should return false for an achievement with callback but no eventNames', () => {
      // Arrange
      achievement.eventNames = undefined;

      // Act & Assert
      expect(achievements.implemented(achievement)).toBe(false);
    });

    it('should return false for an achievement with neither eventNames nor callback', () => {
      // Arrange
      delete achievement.eventNames;
      delete achievement.callback;

      // Act & Assert
      expect(achievements.implemented(achievement)).toBe(false);
    });
  });

});
