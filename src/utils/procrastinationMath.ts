import { SubGoal, ProductionTask, PrioritizationMatrixReport } from '../types/prioritization';

/**
 * Calculates priority scores based on the G Russ Reverse-Engineering Framework (YouTube: eagkwELZQjI @ 4:39)
 *
 * Formula:
 * Raw Score = (Impact * Urgency * Weight) / (Time + 1)
 * Normalized Score = Raw Score * K (scale 0-100)
 * where K = 100 / max(Raw Score)
 */
export function calculatePriorityMatrix(
  tasks: ProductionTask[],
  subGoals: Record<string, SubGoal>,
  ultimateGoal: string = '100K Views & 100 Học Viên / Tháng'
): PrioritizationMatrixReport {
  if (!tasks || tasks.length === 0) {
    return {
      timestamp: new Date().toISOString(),
      ultimateGoal,
      tasks: [],
      recommendedNextAction: null,
    };
  }

  // 1. Calculate Raw Scores
  const scoredTasks: ProductionTask[] = tasks.map((task) => {
    const subGoal = subGoals[task.subGoalId];
    const weight = subGoal ? subGoal.weight : 5; // Default weight is 5 if undefined
    const impact = Math.max(1, Math.min(10, task.impact));
    const urgency = Math.max(1, Math.min(10, task.urgency));
    const time = Math.max(0.1, task.estimatedHours);

    const rawScore = (impact * urgency * weight) / (time + 1);

    return {
      ...task,
      impact,
      urgency,
      estimatedHours: time,
      rawScore,
    };
  });

  // 2. Find Max Raw Score to derive K constant
  const maxRawScore = Math.max(...scoredTasks.map((t) => t.rawScore || 0));
  const k = maxRawScore > 0 ? 100 / maxRawScore : 1;

  // 3. Compute Normalized Priority Score (0 - 100) and sort descending
  const rankedTasks = scoredTasks
    .map((task) => ({
      ...task,
      priorityScore: parseFloat(((task.rawScore || 0) * k).toFixed(1)),
    }))
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .map((task, idx) => ({
      ...task,
      rank: idx + 1,
    }));

  return {
    timestamp: new Date().toISOString(),
    ultimateGoal,
    tasks: rankedTasks,
    recommendedNextAction: rankedTasks[0] || null,
  };
}

/**
 * Pre-configured channel sub-goals for @azzammastertradinggold
 */
export const DEFAULT_AZZAM_SUBGOALS: Record<string, SubGoal> = {
  content: {
    id: 'content',
    name: 'Content',
    weight: 9.5, // Content is king for traffic & retention
    description: 'Sản xuất video YouTube Shorts / Long-form & Kịch bản XAUUSD M15',
  },
  funnel: {
    id: 'funnel',
    name: 'Funnel',
    weight: 9.0, // Critical for converting viewers to students
    description: 'Lead magnet, Landing page học viện learn.azzamedu.com',
  },
  community: {
    id: 'community',
    name: 'Community',
    weight: 8.0, // Retaining active trading community in Telegram
    description: 'Chăm sóc học viên, giải đáp kịch bản trong nhóm Telegram',
  },
  ads: {
    id: 'ads',
    name: 'Ads',
    weight: 5.0, // Organic traffic currently prioritized over paid ads
    description: 'Quảng bá trả phí và chạy phân phối bổ trợ',
  },
};
