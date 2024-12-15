export class MetricsCalculator {
  // Constants
  private static MANUAL_TIME_PER_QUESTION = 23;

  static calculateFormMetrics(metricHistory: MetricsHistory[]): {
    total: number;
    weeklyTrend: number;
  } {
    const total = metricHistory.reduce(
      (sum, entry) => sum + entry.formsFilled,
      0,
    );
    if (total === 0) {
      return { total: 0, weeklyTrend: 0 };
    }
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 7);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    let thisWeekForms = 0;
    let lastWeekForms = 0;
    for (const entry of metricHistory) {
      const entryDate = new Date(entry.date);
      if (entryDate >= thisWeekStart) {
        thisWeekForms += entry.formsFilled;
      } else if (entryDate >= lastWeekStart) {
        lastWeekForms += entry.formsFilled;
      }
    }
    const weeklyTrend =
      (lastWeekForms === 0
        ? 1
        : (thisWeekForms - lastWeekForms) / lastWeekForms) * 100;
    return { total, weeklyTrend };
  }

  private static calculateTimeDifference(entry: MetricsHistory): number {
    const manualTime = entry.toBeFilledQuestions
      ? entry.toBeFilledQuestions * this.MANUAL_TIME_PER_QUESTION
      : entry.timeAI;
    return manualTime - entry.timeAI;
  }

  static calculateTimeSaved(metricHistory: MetricsHistory[]): {
    totalHours: number;
    totalMin: number;
    totalSec: number;
    dailyTrend: number;
  } {
    let total = metricHistory.reduce(
      (sum, entry) => sum + this.calculateTimeDifference(entry),
      0,
    );
    if (total < 0) {
      total = 0;
    }
    if (this.calculateFormMetrics(metricHistory).total === 0) {
      return { totalHours: 0, totalMin: 0, totalSec: 0, dailyTrend: 0 };
    }
    const totalHours = Math.floor(total / 3600);
    const totalMin = Math.floor((total % 3600) / 60);
    const totalSec = Math.floor(total % 60);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];
    const todayTotal = metricHistory
      .filter((entry) => entry.date === today)
      .reduce((sum, entry) => sum + this.calculateTimeDifference(entry), 0);
    const yesterdayTotal = metricHistory
      .filter((entry) => entry.date === yesterday)
      .reduce((sum, entry) => sum + this.calculateTimeDifference(entry), 0);
    const dailyTrend =
      (yesterdayTotal === 0
        ? 1
        : (todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
    return { totalHours, totalMin, totalSec, dailyTrend };
  }

  static calculateStreaks(metricHistory: MetricsHistory[]): {
    currentStreak: number;
    activeStreak: number;
  } {
    if (!metricHistory || metricHistory.length === 0) {
      return { currentStreak: 0, activeStreak: 0 };
    }

    const sortedHistory = [...metricHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    if (this.calculateFormMetrics(metricHistory).total === 0) {
      return { currentStreak: 0, activeStreak: 0 };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastEntryDate = sortedHistory[0]
      ? new Date(sortedHistory[0].date)
      : new Date();
    lastEntryDate.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let activeStreak = 0;
    let tempStreak = 0;

    const daysSinceLastEntry = Math.floor(
      (today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceLastEntry <= 1) {
      tempStreak = 1;
      for (let i = 0; i < sortedHistory.length - 1; i++) {
        const currentDate = new Date(sortedHistory[i]?.date || '');
        currentDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(sortedHistory[i + 1]?.date || 0);
        nextDate.setHours(0, 0, 0, 0);

        const dayDifference = Math.floor(
          (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (dayDifference === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      currentStreak = daysSinceLastEntry === 0 ? tempStreak : 0;
    }
    let longestStreak = 1;
    tempStreak = 1;

    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const currentDate = new Date(sortedHistory[i]?.date || '');
      currentDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(sortedHistory[i + 1]?.date || '');
      nextDate.setHours(0, 0, 0, 0);

      const dayDifference = Math.floor(
        (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (dayDifference === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    activeStreak = longestStreak;

    return { currentStreak, activeStreak };
  }

  private static calculateRateForEntries(entries: MetricsHistory[]): number {
    const successful = entries.reduce(
      (sum, entry) => sum + (entry.successfulQuestions || 0),
      0,
    );
    const hasToFill = entries.reduce(
      (sum, entry) => sum + (entry.toBeFilledQuestions || 0),
      0,
    );
    // console.log('questions, successful', questions, successful);
    return (
      (hasToFill
        ? successful / hasToFill
        : this.calculateFormMetrics(entries).total > 0
          ? 1
          : 0) * 100
    );
  }

  static calculateSuccessRate(metricHistory: MetricsHistory[]): {
    rate: number;
    weeklyTrend: number;
  } {
    if (this.calculateFormMetrics(metricHistory).total === 0) {
      return { rate: 0, weeklyTrend: 0 };
    }

    const rate = this.calculateRateForEntries(metricHistory);
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 7);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const thisWeekRate = this.calculateRateForEntries(
      metricHistory.filter((entry) => new Date(entry.date) >= thisWeekStart),
    );
    const lastWeekRate = this.calculateRateForEntries(
      metricHistory.filter((entry) => {
        const date = new Date(entry.date);
        return date >= lastWeekStart && date < thisWeekStart;
      }),
    );

    const weeklyTrend =
      (lastWeekRate === 0 ? 1 : (thisWeekRate - lastWeekRate) / lastWeekRate) *
      100;
    return { rate, weeklyTrend };
  }
}
