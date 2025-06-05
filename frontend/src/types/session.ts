// Typescript types pour les sessions 3D
import { Activity3D } from './activity';

export type SessionType = 'PRETEST' | 'TRAINING' | 'POSTTEST';

export interface Session3D {
  id: string;
  userId: string;
  type: SessionType;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  activitiesCompleted: number;
  correctAnswers: number;
  badgeEarned: boolean;
  activities: Activity3D[];
}
