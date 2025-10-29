import { renderHook, act } from '@testing-library/react';
import { useXAPITracking } from '../../hooks/useXAPITracking';
import { useGameStore } from '../../stores/gameStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { XAPIService } from '../../services/xapi.service';

// Mock des stores et services
jest.mock('../../stores/gameStore', () => ({
  useGameStore: jest.fn()
}));

jest.mock('../../stores/analyticsStore', () => ({
  useAnalyticsStore: jest.fn()
}));

jest.mock('../../services/xapi.service', () => {
  return {
    XAPIService: jest.fn().mockImplementation(() => ({
      sendStatement: jest.fn().mockResolvedValue({ ok: true }),
      sendStatements: jest.fn().mockResolvedValue({ ok: true })
    }))
  };
});

describe('useXAPITracking', () => {
  const mockGameState = {
    level: 1,
    marbles: [],
    score: 0,
    currentProblem: {
      type: 'addition',
      operand1: 2,
      operand2: 3,
      answer: null
    }
  };

  const mockAnalyticsState = {
    currentSession: 'test-session-id',
    cognitiveLoadEstimate: 0.5,
    lastActivityTimestamp: Date.now(),
    implicitConceptualization: {
      addition: true,
      subtraction: false,
      confidence: 0.8
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mockedGameStore = useGameStore as unknown as jest.Mock;
    const mockedAnalyticsStore = useAnalyticsStore as unknown as jest.Mock;
    mockedGameStore.mockReturnValue(mockGameState);
    mockedAnalyticsStore.mockReturnValue(mockAnalyticsState);
    jest.useFakeTimers().setSystemTime(new Date('2025-06-05T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('devrait créer un statement xAPI valide', () => {
    const { result } = renderHook(() => useXAPITracking());

    const action = {
      verb: 'interacted',
      verbDisplay: 'a déplacé',
      objectId: 'marble-1',
      objectType: 'marble',
      objectName: 'Bille rouge',
      extensions: {
        'https://w3id.org/xapi/cmi5/context/extensions/position': { x: 1, y: 0, z: 2 }
      }
    };

    const statement = result.current.trackAction(action);

    expect(statement).toMatchObject({
      actor: {
        name: 'student',
        mbox: 'mailto:student@example.com'
      },
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/interacted',
        display: {
          'fr-FR': 'a déplacé'
        }
      },
      object: {
        id: 'marble-1',
        definition: {
          type: 'marble',
          name: {
            'fr-FR': 'Bille rouge'
          }
        }
      },
      context: {
        contextActivities: {
          parent: [{
            id: 'level-1',
            definition: {
              type: 'level',
              name: {
                'fr-FR': 'Niveau 1'
              }
            }
          }]
        },
        extensions: {
          'https://w3id.org/xapi/cmi5/context/extensions/sessionid': 'test-session-id',
          'https://w3id.org/xapi/cmi5/context/extensions/cognitiveload': 0.5,
          'https://w3id.org/xapi/cmi5/context/extensions/position': { x: 1, y: 0, z: 2 }
        }
      },
      timestamp: '2025-06-05T12:00:00.000Z'
    });
  });

  it('devrait gérer les erreurs d\'envoi au LRS', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Erreur LRS simulée');
    
    // Mock de XAPIService pour simuler une erreur
    (XAPIService as jest.Mock).mockImplementation(() => ({
      sendStatement: jest.fn().mockRejectedValue(mockError)
    }));

    const { result } = renderHook(() => useXAPITracking());

    const action = {
      verb: 'attempted',
      verbDisplay: 'a essayé',
      objectId: 'test-error',
      objectType: 'activity',
      objectName: 'Test erreur'
    };

    result.current.trackAction(action);

  // Attendre que la promesse soit rejetée
  await Promise.resolve();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erreur lors de l\'envoi du statement:',
      mockError
    );

    consoleErrorSpy.mockRestore();
  });

  it('devrait inclure le score et le succès', () => {
    const { result } = renderHook(() => useXAPITracking());

    const action = {
      verb: 'completed',
      verbDisplay: 'a terminé',
      objectId: 'exercise-1',
      objectType: 'activity',
      objectName: 'Addition avec billes',
      success: true,
      score: 0.85
    };

    const statement = result.current.trackAction(action);

    expect(statement.result).toEqual({
      success: true,
      score: {
        scaled: 0.85,
        raw: 85,
        min: 0,
        max: 100
      }
    });
  });

  it('devrait inclure toutes les extensions contextuelles', () => {
    const { result } = renderHook(() => useXAPITracking());

    const action = {
      verb: 'experienced',
      verbDisplay: 'a expérimenté',
      objectId: 'learning-session',
      objectType: 'session',
      objectName: 'Session d\'apprentissage',
      extensions: {
        'https://w3id.org/xapi/cmi5/context/extensions/duration': 300,
        'https://w3id.org/xapi/cmi5/context/extensions/difficulty': 'medium'
      }
    };

    const statement = result.current.trackAction(action);

    expect(statement.context?.extensions).toEqual({
      'https://w3id.org/xapi/cmi5/context/extensions/sessionid': 'test-session-id',
      'https://w3id.org/xapi/cmi5/context/extensions/cognitiveload': 0.5,
      'https://w3id.org/xapi/cmi5/context/extensions/duration': 300,
      'https://w3id.org/xapi/cmi5/context/extensions/difficulty': 'medium'
    });
  });
});
