import { Vector3 } from 'three';

export interface MarbleInteraction {
  marbleId: string;
  color: 'red' | 'blue';
  position: Vector3;
  duration: number;
  interactionType: 'click' | 'drag' | 'drop';
}

export interface ConceptualizationData {
  conceptType: 'addition' | 'subtraction';
  confidence: number;
  isImplicit: boolean;
  patternDetected: boolean;
}

export interface XAPIResult {
  score?: {
    raw: number;
    min?: number;
    max?: number;
    scaled?: number;
  };
  success?: boolean;
  completion?: boolean;
  duration?: string;
  response?: string;
  extensions?: Record<string, unknown>;
}

export interface XAPIContext {
  registration?: string;
  instructor?: {
    name: string;
    mbox?: string;
  };
  team?: {
    name: string;
    mbox?: string;
  };
  contextActivities?: {
    parent?: Array<{ id: string; type?: string }>;
    grouping?: Array<{ id: string; type?: string }>;
    category?: Array<{ id: string; type?: string }>;
    other?: Array<{ id: string; type?: string }>;
  };
  revision?: string;
  platform?: string;
  language?: string;
  statement?: {
    id: string;
    objectType: 'StatementRef';
  };
  extensions?: Record<string, unknown>;
}
