import { useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { XAPIService } from '../services/xapi.service';

export interface XAPIStatement {
  actor: {
    name: string;
    mbox: string;
  };
  verb: {
    id: string;
    display: {
      'fr-FR': string;
    };
  };
  object: {
    id: string;
    definition: {
      type: string;
      name: {
        'fr-FR': string;
      };
    };
  };
  context?: {
    contextActivities?: {
      parent?: Array<{
        id: string;
        definition?: {
          type: string;
          name?: {
            'fr-FR': string;
          };
        };
      }>;
    };
    extensions?: {
      [key: string]: unknown;
    };
  };
  result?: {
    success?: boolean;
    completion?: boolean;
    score?: {
      scaled?: number;
      raw?: number;
      min?: number;
      max?: number;
    };
    extensions?: {
      [key: string]: unknown;
    };
  };
  timestamp: string;
}

export const useXAPITracking = () => {
  const gameState = useGameStore();
  const analytics = useAnalyticsStore();
  const xapiService = useMemo(() => new XAPIService(), []);

  const trackAction = useCallback((action: {
    verb: string;
    verbDisplay: string;
    objectId: string;
    objectType: string;
    objectName: string;
    success?: boolean;
    score?: number;
    extensions?: Record<string, unknown>;
  }): XAPIStatement => {
    const statement: XAPIStatement = {
      actor: {
        name: 'student',
        mbox: 'mailto:student@example.com'
      },
      verb: {
        id: `http://adlnet.gov/expapi/verbs/${action.verb}`,
        display: {
          'fr-FR': action.verbDisplay
        }
      },
      object: {
        id: action.objectId,
        definition: {
          type: action.objectType,
          name: {
            'fr-FR': action.objectName
          }
        }
      },
      context: {
        contextActivities: {
          parent: [{
            id: `level-${gameState.level}`,
            definition: {
              type: 'level',
              name: {
                'fr-FR': `Niveau ${gameState.level}`
              }
            }
          }]
        },
        extensions: {
          'https://w3id.org/xapi/cmi5/context/extensions/sessionid': analytics.currentSession,
          'https://w3id.org/xapi/cmi5/context/extensions/cognitiveload': analytics.cognitiveLoadEstimate,
          ...action.extensions
        }
      },
      timestamp: new Date().toISOString()
    };

    if (action.success !== undefined || action.score !== undefined) {
      statement.result = {
        success: action.success,
        score: action.score !== undefined ? {
          scaled: action.score,
          raw: action.score * 100,
          min: 0,
          max: 100
        } : undefined
      };
    }    // Envoyer le statement au LRS
    xapiService.sendStatement(statement).catch(error => {
      console.error('Erreur lors de l\'envoi du statement:', error);
    });
    
    return statement;
  }, [gameState.level, analytics.currentSession, analytics.cognitiveLoadEstimate]);

  return { trackAction };
}
