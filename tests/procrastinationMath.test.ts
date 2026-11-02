import { describe, it, expect } from 'vitest';
import { calculatePriorityMatrix, DEFAULT_AZZAM_SUBGOALS } from '../src/utils/procrastinationMath';
import { ProductionTask } from '../src/types/prioritization';

describe('Procrastination Math Prioritization Engine (G Russ Framework @ 4:39)', () => {
  it('correctly calculates raw and normalized priority scores using (Impact * Urgency * Weight) / (Time + 1) * K', () => {
    const sampleTasks: ProductionTask[] = [
      {
        id: 'task-1',
        title: 'Dựng Shorts PP-0023: Đọc 3 Cây Nến Dòng Tiền (488 comments)',
        subGoalId: 'content',
        impact: 10,
        urgency: 9,
        estimatedHours: 0.5, // 30 phút
      },
      {
        id: 'task-2',
        title: 'Thiết kế lại Logo & Avatar kênh',
        subGoalId: 'content',
        impact: 2,
        urgency: 2,
        estimatedHours: 3.0,
      },
      {
        id: 'task-3',
        title: 'Gắn link Lead Magnet Khóa Học OPT-1 vào mô tả',
        subGoalId: 'funnel',
        impact: 9,
        urgency: 8,
        estimatedHours: 0.2, // 12 phút
      },
    ];

    const report = calculatePriorityMatrix(sampleTasks, DEFAULT_AZZAM_SUBGOALS, '10K MRR Azzam Academy');

    expect(report.tasks.length).toBe(3);
    // Task with highest (Impact * Urgency * Weight) / (Time + 1) should be Rank 1
    expect(report.recommendedNextAction).not.toBeNull();
    expect(report.recommendedNextAction?.rank).toBe(1);

    // Rank 1 task should have priorityScore = 100.0 (normalized maximum)
    expect(report.tasks[0].priorityScore).toBe(100.0);

    // Verify low-impact, high-time procrastination task is ranked last
    const lowRankTask = report.tasks.find((t) => t.id === 'task-2');
    expect(lowRankTask?.rank).toBe(3);
    expect(lowRankTask?.priorityScore).toBeLessThan(15.0);
  });

  it('handles empty task list gracefully without crashing', () => {
    const report = calculatePriorityMatrix([], DEFAULT_AZZAM_SUBGOALS);
    expect(report.tasks).toEqual([]);
    expect(report.recommendedNextAction).toBeNull();
  });

  it('proves that high-time productive procrastination tasks get penalized heavily by the denominator (Time + 1)', () => {
    const quickWin: ProductionTask = {
      id: 'quick-win',
      title: 'Khóa $30 Stop Loss & Xuất bản Video trước 00:00 VN',
      subGoalId: 'content',
      impact: 9,
      urgency: 10,
      estimatedHours: 0.2, // 12 phút
    };

    const perfectionistTrap: ProductionTask = {
      id: 'perfectionist-trap',
      title: 'Tự render lại 100 nến 3D phức tạp (Productive Procrastination)',
      subGoalId: 'content',
      impact: 9,
      urgency: 5,
      estimatedHours: 20.0, // 20 tiếng
    };

    const report = calculatePriorityMatrix([quickWin, perfectionistTrap], DEFAULT_AZZAM_SUBGOALS);

    expect(report.tasks[0].id).toBe('quick-win');
    expect(report.tasks[0].priorityScore).toBe(100.0);
    expect(report.tasks[1].id).toBe('perfectionist-trap');
    expect(report.tasks[1].priorityScore).toBeLessThan(10.0);
  });
});
