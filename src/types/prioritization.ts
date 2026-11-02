export interface SubGoal {
  id: string;
  name: 'Community' | 'Funnel' | 'Content' | 'Ads' | string;
  weight: number; // 1 to 10: Tầm quan trọng đối với Ultimate Goal
  description?: string;
}

export interface ProductionTask {
  id: string;
  title: string;
  subGoalId: string;
  impact: number; // 1 to 10: Tác động lên Sub-goal
  urgency: number; // 1 to 10: Độ cấp bách
  estimatedHours: number; // Thời gian thực hiện (giờ)
  rawScore?: number;
  priorityScore?: number;
  rank?: number;
  metadata?: {
    painPointId?: string;
    commentCount?: number;
    strategy?: string;
    scriptFile?: string;
    targetAudience?: string;
  };
}

export interface PrioritizationMatrixReport {
  timestamp: string;
  ultimateGoal: string;
  tasks: ProductionTask[];
  recommendedNextAction: ProductionTask | null;
}

