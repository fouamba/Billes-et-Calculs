// Typescript types pour les activités 3D (composition/décomposition)
export type ActivityType = 'composition' | 'decomposition';

export interface MarbleConfiguration {
  red: number;
  blue: number;
  total: number;
}

export interface Activity3D {
  id: string;
  sessionId: string;
  userId: string;
  type: ActivityType;
  marbleConfiguration: MarbleConfiguration;
  numberRange: [number, number];
  isCorrect: boolean;
  responseTime: number;
  interactions: any; // À détailler selon le besoin
  speechData?: any;
}
