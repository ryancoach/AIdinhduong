import { type AchievementHistory, type StreakData } from '../types';

const getISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Calculates the current consecutive achievement streak based on historical data.
 * A streak is a sequence of days where the calorie goal was met, ending either today or yesterday.
 */
export const calculateStreak = (history: AchievementHistory): StreakData => {
  let streakCount = 0;
  let lastStreakDate = '';
  const today = new Date();
  
  // Determine the starting point for streak calculation.
  // If today is not successful (or not logged yet), the streak must have ended yesterday to be current.
  const todayStr = getISODateString(today);
  const todayData = history[todayStr];
  const isTodaySuccessful = todayData && todayData.consumed > 0 && todayData.consumed <= todayData.goal;

  let startDate = new Date();
  if (!isTodaySuccessful) {
    // If today is not a success, the streak must end yesterday to be considered active.
    startDate.setDate(today.getDate() - 1);
  }

  // Iterate backwards from the determined start date
  for (let i = 0; i < 365; i++) { // Limit check to 1 year for performance
    const checkDate = new Date(startDate);
    checkDate.setDate(startDate.getDate() - i);
    const checkDateStr = getISODateString(checkDate);
    
    const dayData = history[checkDateStr];

    if (dayData && dayData.consumed > 0 && dayData.consumed <= dayData.goal) {
      streakCount++;
      // The last date of the streak is the first successful one we find
      if (lastStreakDate === '') {
        lastStreakDate = checkDateStr;
      }
    } else {
      // The sequence is broken, so stop counting
      break;
    }
  }

  return { count: streakCount, lastLogDate: lastStreakDate };
};
